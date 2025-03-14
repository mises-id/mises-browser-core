/* Copyright (c) 2021 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "mises/components/permissions/permission_expirations.h"

#include <algorithm>
#include <memory>
#include <optional>
#include <string_view>
#include <utility>

#include "base/stl_util.h"
#include "mises/components/permissions/permission_lifetime_pref_names.h"
#include "components/content_settings/core/browser/content_settings_registry.h"
#include "components/content_settings/core/browser/content_settings_utils.h"
#include "components/content_settings/core/browser/website_settings_info.h"
#include "components/content_settings/core/browser/website_settings_registry.h"
#include "components/pref_registry/pref_registry_syncable.h"
#include "components/prefs/pref_service.h"
#include "components/prefs/scoped_user_pref_update.h"

using content_settings::WebsiteSettingsInfo;
using content_settings::WebsiteSettingsRegistry;

namespace permissions {

namespace {

// Pref data keys.
constexpr std::string_view kRequestingOriginKey = "ro";
constexpr std::string_view kEmbeddingOriginKey = "eo";
constexpr std::string_view kContentSettingKey = "cs";

template <typename Container, typename ConstIterator>
typename Container::iterator ConstCastIterator(Container& c, ConstIterator it) {
  return c.erase(it, it);
}

}  // namespace

// static
void PermissionExpirations::RegisterProfilePrefs(
    user_prefs::PrefRegistrySyncable* registry) {
  // Ensure the content settings are all registered.
  content_settings::ContentSettingsRegistry::GetInstance();

  registry->RegisterDictionaryPref(prefs::kPermissionLifetimeExpirations);
}

PermissionExpirations::PermissionExpirations(PrefService* prefs)
    : prefs_(prefs) {
  ReadExpirationsFromPrefs();
}

PermissionExpirations::~PermissionExpirations() = default;

void PermissionExpirations::AddExpiringPermission(
    ContentSettingsType content_type,
    PermissionExpirationKey expiration_key,
    PermissionOrigins permission_origins) {
  expirations_[content_type][expiration_key].push_back(
      std::move(permission_origins));
  UpdateExpirationsPref(content_type, {expiration_key});
}

bool PermissionExpirations::RemoveExpiringPermissions(
    ContentSettingsType content_type,
    base::RepeatingCallback<bool(const PermissionOrigins&)> predicate) {
  auto expirations_it = expirations_.find(content_type);
  if (expirations_it == expirations_.end()) {
    return false;
  }

  auto& key_expirations_map = expirations_it->second;
  std::vector<PermissionExpirationKey> expiration_keys_to_update_prefs;

  // Remove all elements for which |predicate| returned true.
  for (auto key_expirations_it = key_expirations_map.begin();
       key_expirations_it != key_expirations_map.end();) {
    const auto& expiration_key = key_expirations_it->first;
    auto& expiring_permissions = key_expirations_it->second;
    bool is_anything_removed = false;

    for (auto expiring_permission_it = expiring_permissions.begin();
         expiring_permission_it != expiring_permissions.end();) {
      if (predicate.Run(*expiring_permission_it)) {
        expiring_permission_it =
            expiring_permissions.erase(expiring_permission_it);
        is_anything_removed = true;
      } else {
        ++expiring_permission_it;
      }
    }

    // Track removed items to update prefs.
    if (is_anything_removed) {
      expiration_keys_to_update_prefs.push_back(expiration_key);
    }

    // Remove empty nested containers.
    if (expiring_permissions.empty()) {
      key_expirations_it = key_expirations_map.erase(key_expirations_it);
    } else {
      ++key_expirations_it;
    }
  }

  // If nothing was removed then we're done here.
  if (expiration_keys_to_update_prefs.empty()) {
    return false;
  }

  // Remove empty nested containers.
  if (key_expirations_map.empty()) {
    expirations_.erase(expirations_it);
  }

  // Update prefs.
  UpdateExpirationsPref(content_type, expiration_keys_to_update_prefs);
  return true;
}

PermissionExpirations::ExpiredPermissions
PermissionExpirations::RemoveExpiredPermissions(base::Time current_time) {
  return RemoveExpiredPermissionsImpl(base::BindRepeating(
      [](const PermissionExpirationKey& expiration_key,
         const PermissionExpirations::KeyExpirationsMap& key_expirations) {
        return std::make_pair(key_expirations.begin(),
                              key_expirations.upper_bound(expiration_key));
      },
      PermissionExpirationKey(current_time)));
}

PermissionExpirations::ExpiredPermissions
PermissionExpirations::RemoveExpiredPermissions(const std::string& domain) {
  return RemoveExpiredPermissionsImpl(base::BindRepeating(
      [](const PermissionExpirationKey& expiration_key,
         const PermissionExpirations::KeyExpirationsMap& key_expirations) {
        return key_expirations.equal_range(expiration_key);
      },
      PermissionExpirationKey(domain)));
}

PermissionExpirations::ExpiredPermissions
PermissionExpirations::RemoveAllDomainPermissions() {
  return RemoveExpiredPermissionsImpl(base::BindRepeating(
      [](const PermissionExpirationKey& expiration_key,
         const PermissionExpirations::KeyExpirationsMap& key_expirations) {
        return std::make_pair(key_expirations.upper_bound(expiration_key),
                              key_expirations.end());
      },
      PermissionExpirationKey(base::Time::Max())));
}

PermissionExpirations::ExpiredPermissions
PermissionExpirations::RemoveExpiredPermissionsImpl(
    base::RepeatingCallback<std::pair<KeyExpirationsMap::const_iterator,
                                      KeyExpirationsMap::const_iterator>(
        const KeyExpirationsMap&)> predicate) {
  ExpiredPermissions expired_permissions;

  // Enumerate all content types and remove all expired permissions.
  for (auto expirations_it = expirations_.begin();
       expirations_it != expirations_.end();) {
    const auto content_type = expirations_it->first;
    auto& key_expirations_map = expirations_it->second;

    std::vector<PermissionExpirationKey> expiration_keys_to_clear_prefs;
    auto iterator_pair = predicate.Run(key_expirations_map);
    auto key_expirations_begin_it =
        ConstCastIterator(key_expirations_map, iterator_pair.first);
    auto key_expirations_end_it =
        ConstCastIterator(key_expirations_map, iterator_pair.second);
    for (auto key_expirations_it = key_expirations_begin_it;
         key_expirations_it != key_expirations_end_it; ++key_expirations_it) {
      const auto& expiration_key = key_expirations_it->first;
      auto& expiring_permissions = key_expirations_it->second;
      std::move(expiring_permissions.begin(), expiring_permissions.end(),
                std::back_inserter(expired_permissions[content_type]));
      expiration_keys_to_clear_prefs.push_back(expiration_key);
    }
    key_expirations_map.erase(key_expirations_begin_it, key_expirations_end_it);

    // Remove empty nested containers.
    if (key_expirations_map.empty()) {
      expirations_it = expirations_.erase(expirations_it);
    } else {
      ++expirations_it;
    }

    // Update prefs.
    UpdateExpirationsPref(content_type, expiration_keys_to_clear_prefs);
  }
  return expired_permissions;
}

void PermissionExpirations::UpdateExpirationsPref(
    ContentSettingsType content_type,
    const std::vector<PermissionExpirationKey>& expiration_keys) {
  if (!prefs_) {
    return;
  }

  // Use a scoped pref update to update only changed pref subkeys.
  ScopedDictPrefUpdate key_expirations(prefs_,
                                       prefs::kPermissionLifetimeExpirations);
  const std::string& content_type_name =
      WebsiteSettingsRegistry::GetInstance()->Get(content_type)->name();

  const auto& expirations_it = expirations_.find(content_type);
  if (expirations_it == expirations_.end()) {
    // Remove content type if it's absent in a runtime container.
    key_expirations->RemoveByDottedPath(content_type_name);
    return;
  }

  const auto& key_expirations_map = expirations_it->second;
  for (const auto& expiration_key : expiration_keys) {
    const auto& key_expirations_it = key_expirations_map.find(expiration_key);
    const std::string& key = expiration_key.ToString();
    if (key_expirations_it == key_expirations_map.end() ||
        key_expirations_it->second.empty()) {
      // Remove a key element if it's absent or empty in a runtime container.
      base::Value::Dict* content_type_expirations =
          key_expirations->FindDict(content_type_name);
      if (content_type_expirations) {
        content_type_expirations->Remove(key);
      }
    } else {
      // Update a key element if it's not empty in a runtime container.
      key_expirations->EnsureDict(content_type_name)
          ->Set(key, ExpiringPermissionsToList(key_expirations_it->second));
    }
  }
}

void PermissionExpirations::ReadExpirationsFromPrefs() {
  if (!prefs_) {
    return;
  }

  const auto& type_expirations_map_val =
      prefs_->GetDict(prefs::kPermissionLifetimeExpirations);

  std::vector<std::string> invalid_content_type_names;
  for (const auto&& [key, value] : type_expirations_map_val) {
    const std::string& content_type_name = key;
    const base::Value& key_expirations_map_val = value;
    if (!key_expirations_map_val.is_dict()) {
      continue;
    }
    const WebsiteSettingsInfo* website_settings_info =
        WebsiteSettingsRegistry::GetInstance()->GetByName(content_type_name);
    if (!website_settings_info) {
      invalid_content_type_names.push_back(content_type_name);
      continue;
    }
    KeyExpirationsMap key_expirations_map;
    for (const auto key_expirations_val : key_expirations_map_val.GetDict()) {
      const std::string& key_str = key_expirations_val.first;
      const base::Value& expiring_permissions_val = key_expirations_val.second;
      ExpiringPermissions expiring_permissions =
          ParseExpiringPermissions(expiring_permissions_val);
      if (expiring_permissions.empty()) {
        continue;
      }
      key_expirations_map.emplace(PermissionExpirationKey::FromString(key_str),
                                  std::move(expiring_permissions));
    }
    if (!key_expirations_map.empty()) {
      expirations_.emplace(website_settings_info->type(),
                           std::move(key_expirations_map));
    }
  }

  if (!invalid_content_type_names.empty()) {
    ScopedDictPrefUpdate key_expirations(prefs_,
                                         prefs::kPermissionLifetimeExpirations);
    for (const auto& invalid_content_type_name : invalid_content_type_names) {
      key_expirations->RemoveByDottedPath(invalid_content_type_name);
    }
  }
}

PermissionExpirations::ExpiringPermissions
PermissionExpirations::ParseExpiringPermissions(
    const base::Value& expiring_permissions_val) {
  ExpiringPermissions expiring_permissions;
  if (!expiring_permissions_val.is_list()) {
    return expiring_permissions;
  }

  expiring_permissions.reserve(expiring_permissions_val.GetList().size());
  for (const auto& entry : expiring_permissions_val.GetList()) {
    const auto* item = entry.GetIfDict();
    if (!item) {
      continue;
    }
    const std::string* requesting_origin =
        item->FindString(kRequestingOriginKey);
    const std::string* embedding_origin = item->FindString(kEmbeddingOriginKey);
    if (!requesting_origin) {
      continue;
    }
    std::optional<int> content_setting = item->FindInt(kContentSettingKey);
    expiring_permissions.push_back(PermissionOrigins(
        requesting_origin, embedding_origin,
        content_setting.value_or(ContentSetting::CONTENT_SETTING_ALLOW)));
  }

  return expiring_permissions;
}

base::Value::List PermissionExpirations::ExpiringPermissionsToList(
    const ExpiringPermissions& expiring_permissions) const {
  base::Value::List items;
  items.reserve(expiring_permissions.size());

  for (const auto& expiring_permission : expiring_permissions) {
    base::Value::Dict value;
    value.Set(kRequestingOriginKey,
              expiring_permission.requesting_origin().spec());
    if (expiring_permission.embedding_origin() !=
        expiring_permission.requesting_origin()) {
      value.Set(kEmbeddingOriginKey,
                expiring_permission.embedding_origin().spec());
    }
    value.Set(kContentSettingKey, expiring_permission.content_setting());
    items.Append(std::move(value));
  }

  return items;
}

}  // namespace permissions
