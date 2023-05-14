/* Copyright (c) 2022 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "third_party/blink/public/mojom/permissions_policy/permissions_policy_feature.mojom.h"

#define PERMISSION_UTIL_GET_PERMISSION_STRING           \
  case PermissionType::MISES_ETHEREUM:                  \
    return "MisesEthereum";                             \
  case PermissionType::MISES_SOLANA:                    \
    return "MisesSolana";

#define kDisplayCapture                                 \
  kDisplayCapture;                                      \
  case PermissionType::MISES_ETHEREUM:                  \
    return mojom::PermissionsPolicyFeature::kEthereum;  \
  case PermissionType::MISES_SOLANA:                    \
    return mojom::PermissionsPolicyFeature::kSolana;    

#include "src/third_party/blink/common/permissions/permission_utils.cc"

#undef kDisplayCapture
#undef PERMISSION_UTIL_GET_PERMISSION_STRING

