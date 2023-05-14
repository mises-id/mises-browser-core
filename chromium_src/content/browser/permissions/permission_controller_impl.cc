/* Copyright (c) 2022 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "content/browser/permissions/permission_controller_impl.h"
#include "content/browser/permissions/permission_util.h"
#include "third_party/blink/public/common/permissions/permission_utils.h"

#define NUM                                             \
  MISES_ETHEREUM:                  \
  case PermissionType::MISES_SOLANA:                    \
  case PermissionType::NUM

#include "src/content/browser/permissions/permission_controller_impl.cc"
#undef NUM

