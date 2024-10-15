/* Copyright (c) 2021 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "components/permissions/request_type.h"

#include "build/build_config.h"

#if BUILDFLAG(IS_ANDROID)
#include "components/resources/android/theme_resources.h"
#else
#include "components/vector_icons/vector_icons.h"
#include "ui/gfx/vector_icon_types.h"
#endif

#if BUILDFLAG(IS_ANDROID)
namespace {
constexpr auto kAndroidInfobarPermissionCookie =
    IDR_ANDROID_INFOBAR_PERMISSION_COOKIE;
}  // namespace
#else
namespace vector_icons {
constexpr auto& kMicIconValue = vector_icons::kMicIcon;
}  // namespace vector_icons
#endif

// Add Brave cases into GetIconIdAndroid.
// kWidevine is not expected to happen here as Widevine is not enabled in
// Android, we add this case here just to avoid build error due to unhandled
// cases in the switch.
//
// TODO(jocelyn): Might need to update icon when we have ethereum.enable UI
// support in Android.
#define IDR_ANDROID_INFOBAR_PERMISSION_COOKIE     \
  kAndroidInfobarPermissionCookie;                \
  case RequestType::kWidevine:                    \
  case RequestType::kMisesEthereum:               \
  case RequestType::kMisesSolana:                 \
    return IDR_ANDROID_INFOBAR_PERMISSION_COOKIE

// Add Brave cases into GetIconIdDesktop.
#define kMicIcon                                  \
  kMicIconValue;                                  \
  case RequestType::kWidevine:                    \
  case RequestType::kMisesEthereum:               \
  case RequestType::kMisesSolana:                 \
    return vector_icons::kExtensionIcon

#define MISES_PERMISSION_KEY_FOR_REQUEST_TYPE                  \
  case permissions::RequestType::kWidevine:                    \
    return "widevine";                                         \
  case permissions::RequestType::kMisesEthereum:               \
    return "mises_ethereum";                                   \
  case permissions::RequestType::kMisesSolana:                 \
    return "mises_solana";                                     

#define ContentSettingsTypeToRequestType \
  ContentSettingsTypeToRequestType_ChromiumImpl

#define RequestTypeToContentSettingsType \
  RequestTypeToContentSettingsType_ChromiumImpl

#define IsRequestablePermissionType IsRequestablePermissionType_ChromiumImpl

#include "src/components/permissions/request_type.cc"

#undef MISES_PERMISSION_KEY_FOR_REQUEST_TYPE
#undef IDR_ANDROID_INFOBAR_PERMISSION_COOKIE
#undef kMicIcon
#undef ContentSettingsTypeToRequestType
#undef RequestTypeToContentSettingsType
#undef IsRequestablePermissionType

namespace permissions {

RequestType ContentSettingsTypeToRequestType(
    ContentSettingsType content_settings_type) {
  switch (content_settings_type) {
    case ContentSettingsType::MISES_ETHEREUM:
      return RequestType::kMisesEthereum;
    case ContentSettingsType::MISES_SOLANA:
      return RequestType::kMisesSolana;
   // case ContentSettingsType::MISES_GOOGLE_SIGN_IN:
   //   return RequestType::kMisesGoogleSignInPermission;
    default:
      return ContentSettingsTypeToRequestType_ChromiumImpl(
          content_settings_type);
  }
}

std::optional<ContentSettingsType> RequestTypeToContentSettingsType(
    RequestType request_type) {
  switch (request_type) {
   // case RequestType::kMisesGoogleSignInPermission:
   //   return ContentSettingsType::MISES_GOOGLE_SIGN_IN;
    case RequestType::kMisesEthereum:
      return ContentSettingsType::MISES_ETHEREUM;
    case RequestType::kMisesSolana:
      return ContentSettingsType::MISES_SOLANA;
    default:
      return RequestTypeToContentSettingsType_ChromiumImpl(request_type);
  }
}

bool IsRequestablePermissionType(ContentSettingsType content_settings_type) {
  switch (content_settings_type) {
  //  case ContentSettingsType::MISES_GOOGLE_SIGN_IN:
    case ContentSettingsType::MISES_ETHEREUM:
    case ContentSettingsType::MISES_SOLANA:
      return true;
    default:
      return IsRequestablePermissionType_ChromiumImpl(content_settings_type);
  }
}

}  // namespace permissions

#if BUILDFLAG(IS_ANDROID)
namespace permissions {
IconId GetBlockedIconId(RequestType type) {
  return permissions::GetIconId(type);
}
}
#endif