/* Copyright (c) 2023 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at https://mozilla.org/MPL/2.0/. */

#include <optional>

#include "components/permissions/permission_context_base.h"
#include "components/permissions/permission_request_data.h"

namespace permissions {

std::optional<RequestType> ContentSettingsTypeToRequestTypeIfExists_MisesImpl(
    ContentSettingsType content_settings_type) {
  switch (content_settings_type) {
    case ContentSettingsType::MISES_ETHEREUM:
      return RequestType::kMisesEthereum;
    case ContentSettingsType::MISES_SOLANA:
      return RequestType::kMisesSolana;
    default:
      return ContentSettingsTypeToRequestTypeIfExists(content_settings_type);
  }
}

}  // namespace permissions

#define PermissionContextBase PermissionContextBase_ChromiumImpl

#define ContentSettingsTypeToRequestTypeIfExists \
  ContentSettingsTypeToRequestTypeIfExists_MisesImpl

#include "src/components/permissions/permission_request_data.cc"

#undef ContentSettingsTypeToRequestTypeIfExists
#undef PermissionContextBase
