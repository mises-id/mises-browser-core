/* Copyright (c) 2019 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "chrome/browser/ui/webui/settings/site_settings_helper.h"

#define HasRegisteredGroupName HasRegisteredGroupName_ChromiumImpl
#define GetVisiblePermissionCategories \
  GetVisiblePermissionCategories_ChromiumImpl

// clang-format off
#define MISES_CONTENT_SETTINGS_TYPE_GROUP_NAMES_LIST               \
  {ContentSettingsType::MISES_ETHEREUM, nullptr},                  \
  {ContentSettingsType::MISES_SOLANA, nullptr},                    \
  {ContentSettingsType::MISES_REMEMBER_1P_STORAGE, nullptr},                 
// clang-format on

#define MISES_SITE_SETTINGS_HELPER_CONTENT_SETTINGS_TYPE_FROM_GROUP_NAME \
  if (name == "autoplay")                                                \
    return ContentSettingsType::AUTOPLAY;

#define MISES_SITE_SETTINGS_HELPER_CONTENT_SETTINGS_TYPE_TO_GROUP_NAME \
  if (type == ContentSettingsType::AUTOPLAY)                           \
    return "autoplay";                        

#include "src/chrome/browser/ui/webui/settings/site_settings_helper.cc"

#undef MISES_SITE_SETTINGS_HELPER_CONTENT_SETTINGS_TYPE_FROM_GROUP_NAME
#undef MISES_SITE_SETTINGS_HELPER_CONTENT_SETTINGS_TYPE_TO_GROUP_NAME
#undef MISES_CONTENT_SETTINGS_TYPE_GROUP_NAMES_LIST
#undef GetVisiblePermissionCategories
#undef HasRegisteredGroupName

namespace site_settings {

bool HasRegisteredGroupName(ContentSettingsType type) {
  if (type == ContentSettingsType::MISES_ETHEREUM)
    return true;
  if (type == ContentSettingsType::MISES_SOLANA)
    return true;
  return HasRegisteredGroupName_ChromiumImpl(type);
}

}

const std::vector<ContentSettingsType>& GetVisiblePermissionCategories() {
  static base::NoDestructor<std::vector<ContentSettingsType>> types{
      {ContentSettingsType::MISES_ETHEREUM,
       ContentSettingsType::MISES_SOLANA}};
  static bool initialized = false;
  if (!initialized) {
    auto& base_types = GetVisiblePermissionCategories_ChromiumImpl();
    types->insert(types->end(), base_types.begin(), base_types.end());
    initialized = true;
  }

  return *types;
}

}  // namespace site_settings

