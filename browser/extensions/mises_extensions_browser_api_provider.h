/* Copyright (c) 2021 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#ifndef BRAVE_BROWSER_EXTENSIONS_BRAVE_EXTENSIONS_BROWSER_API_PROVIDER_H_
#define BRAVE_BROWSER_EXTENSIONS_BRAVE_EXTENSIONS_BROWSER_API_PROVIDER_H_

#include "extensions/browser/extensions_browser_api_provider.h"

namespace extensions {

class MisesExtensionsBrowserAPIProvider : public ExtensionsBrowserAPIProvider {
 public:
  MisesExtensionsBrowserAPIProvider();
  MisesExtensionsBrowserAPIProvider(const MisesExtensionsBrowserAPIProvider&) =
      delete;
  MisesExtensionsBrowserAPIProvider& operator=(
      const MisesExtensionsBrowserAPIProvider&) = delete;
  ~MisesExtensionsBrowserAPIProvider() override;

  void RegisterExtensionFunctions(ExtensionFunctionRegistry* registry) override;
};

}  // namespace extensions

#endif  // BRAVE_BROWSER_EXTENSIONS_BRAVE_EXTENSIONS_BROWSER_API_PROVIDER_H_
