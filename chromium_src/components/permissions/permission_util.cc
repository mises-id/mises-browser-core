/* Copyright (c) 2021 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "components/permissions/permission_util.h"
#include "components/permissions/permission_uma_util.h"
#include "third_party/blink/public/common/permissions/permission_utils.h"

#define PermissionUtil PermissionUtil_ChromiumImpl

#define PERMISSION_UTIL_PERMISSION_TYPE_TO_CONTENT_SETTINGS_TYPE \
  case PermissionType::MISES_ETHEREUM:                           \
    return ContentSettingsType::MISES_ETHEREUM;                  \
  case PermissionType::MISES_SOLANA:                             \
    return ContentSettingsType::MISES_SOLANA;                    

#include "src/components/permissions/permission_util.cc"
#undef PermissionUtil
#undef PERMISSION_UTIL_PERMISSION_TYPE_TO_CONTENT_SETTINGS_TYPE

namespace permissions {

// static
std::string PermissionUtil::GetPermissionString(
    ContentSettingsType content_type) {
  switch (content_type) {
    case ContentSettingsType::MISES_ETHEREUM:
      return "MisesEthereum";
    case ContentSettingsType::MISES_SOLANA:
      return "MisesSolana";
    default:
      return PermissionUtil_ChromiumImpl::GetPermissionString(content_type);
  }
}

// static
bool PermissionUtil::GetPermissionType(ContentSettingsType type,
                                       blink::PermissionType* out) {
  if (type == ContentSettingsType::MISES_ETHEREUM ||
      type == ContentSettingsType::MISES_SOLANA) {
    *out = PermissionType::WINDOW_MANAGEMENT;
    return true;
  }

  return PermissionUtil_ChromiumImpl::GetPermissionType(type, out);
}

// static
bool PermissionUtil::IsPermission(ContentSettingsType type) {
  switch (type) {
    case ContentSettingsType::MISES_ETHEREUM:
    case ContentSettingsType::MISES_SOLANA:
      return true;
    default:
      return PermissionUtil_ChromiumImpl::IsPermission(type);
  }
}

PermissionType PermissionUtil::ContentSettingTypeToPermissionType(
    ContentSettingsType permission) {
  switch (permission) {
    case ContentSettingsType::MISES_ETHEREUM:
      return PermissionType::MISES_ETHEREUM;
    case ContentSettingsType::MISES_SOLANA:
      return PermissionType::MISES_SOLANA;
    default:
      return PermissionUtil_ChromiumImpl::ContentSettingTypeToPermissionType(
          permission);
  }
}

GURL PermissionUtil::GetCanonicalOrigin(ContentSettingsType permission,
                                        const GURL& requesting_origin,
                                        const GURL& embedding_origin) {
  // Use requesting_origin which will have ethereum or solana address info.
  if (permission == ContentSettingsType::MISES_ETHEREUM ||
      permission == ContentSettingsType::MISES_SOLANA)
    return requesting_origin;

  return PermissionUtil_ChromiumImpl::GetCanonicalOrigin(
      permission, requesting_origin, embedding_origin);
}

}  // namespace permissions

