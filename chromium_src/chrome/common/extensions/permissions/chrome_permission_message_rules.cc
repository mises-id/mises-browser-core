/* Copyright (c) 2021 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at https://mozilla.org/MPL/2.0/. */

#include "chrome/common/extensions/permissions/chrome_permission_message_rules.h"
#include "mises/grit/mises_generated_resources.h"

#define GetAllRules GetAllRules_ChromiumImpl
#include "src/chrome/common/extensions/permissions/chrome_permission_message_rules.cc"
#undef GetAllRules

namespace extensions {

// static
std::vector<ChromePermissionMessageRule>
ChromePermissionMessageRule::GetAllRules() {
  auto rules = ChromePermissionMessageRule::GetAllRules_ChromiumImpl();
  rules.push_back(
      {IDS_EXTENSION_PROMPT_WARNING_IPFS, {APIPermissionID::kIpfs}, {}}
  );
  rules.push_back(
      {IDS_EXTENSION_PROMPT_WARNING_MISES, {APIPermissionID::kMisesPrivate}, {}}
  );
  return rules;
}

}  // namespace extensions
