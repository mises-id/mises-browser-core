/* Copyright (c) 2019 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "chrome/browser/extensions/component_extensions_allowlist/allowlist.h"

#define IsComponentExtensionAllowlisted IsComponentExtensionAllowlisted_ChromiumImpl  // NOLINT
#include "src/chrome/browser/extensions/component_extensions_allowlist/allowlist.cc"
#undef IsComponentExtensionAllowlisted

#include "mises/components/mises_extension/grit/mises_wallet.h"
#include "components/grit/mises_components_resources.h"
#include "extensions/common/constants.h"


namespace extensions {

  bool IsComponentExtensionAllowlisted(const std::string& extension_id) {
    const char* const kAllowed[] = {
      metamask_extension_id,
      mises_extension_id,
    };

    for (size_t i = 0; i < std::size(kAllowed); ++i) {
      if (extension_id == kAllowed[i])
        return true;
    }

    return IsComponentExtensionAllowlisted_ChromiumImpl(extension_id);
  }

  bool IsComponentExtensionAllowlisted(int manifest_resource_id) {
    switch (manifest_resource_id) {
      // Please keep the list in alphabetical order.
      case IDR_MISES_WALLET_MANIFEST_JSON:
      //case IDR_MISES_WEB3SAFE_MANIFEST_JSON:
        return true;
    }

    return IsComponentExtensionAllowlisted_ChromiumImpl(manifest_resource_id);
  }

}  // namespace extensions
