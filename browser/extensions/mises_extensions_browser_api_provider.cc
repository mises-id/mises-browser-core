/* Copyright (c) 2019 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "mises/browser/extensions/mises_extensions_browser_api_provider.h"

#include "mises/common/extensions/api/generated_api_registration.h"
#include "extensions/browser/extension_function_registry.h"

namespace extensions {

MisesExtensionsBrowserAPIProvider::MisesExtensionsBrowserAPIProvider() =
    default;
MisesExtensionsBrowserAPIProvider::~MisesExtensionsBrowserAPIProvider() =
    default;

void MisesExtensionsBrowserAPIProvider::RegisterExtensionFunctions(
    ExtensionFunctionRegistry* registry) {
  // Generated APIs from Brave.
  api::MisesGeneratedFunctionRegistry::RegisterAll(registry);
}

}  // namespace extensions
