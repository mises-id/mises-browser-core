/* Copyright (c) 2019 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "chrome/browser/policy/configuration_policy_handler_list_factory.h"

#include "mises/components/constants/pref_names.h"
#include "mises/components/ipfs/buildflags/buildflags.h"
#include "build/build_config.h"
#include "components/policy/core/browser/configuration_policy_handler.h"
#include "components/policy/policy_constants.h"


#if BUILDFLAG(ENABLE_IPFS)
#include "mises/components/ipfs/pref_names.h"
#endif

namespace {

const policy::PolicyToPreferenceMapEntry kBraveSimplePolicyMap[] = {

#if BUILDFLAG(ENABLE_IPFS)
    {policy::key::kIPFSEnabled, kIPFSEnabled, base::Value::Type::BOOLEAN},
#endif
};

}  // namespace

#define BuildHandlerList BuildHandlerList_ChromiumImpl
#include "src/chrome/browser/policy/configuration_policy_handler_list_factory.cc"
#undef BuildHandlerList

namespace policy {

std::unique_ptr<ConfigurationPolicyHandlerList> BuildHandlerList(
    const Schema& chrome_schema) {
  std::unique_ptr<ConfigurationPolicyHandlerList> handlers =
      BuildHandlerList_ChromiumImpl(chrome_schema);

  for (const auto& entry : kBraveSimplePolicyMap) {
    handlers->AddHandler(std::make_unique<SimplePolicyHandler>(
        entry.policy_name, entry.preference_path, entry.value_type));
  }

  return handlers;
}

}  // namespace policy
