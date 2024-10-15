/* Copyright (c) 2021 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#ifndef BRAVE_COMPONENTS_BRAVE_WALLET_BROWSER_WALLET_DATA_FILES_INSTALLER_H_
#define BRAVE_COMPONENTS_BRAVE_WALLET_BROWSER_WALLET_DATA_FILES_INSTALLER_H_

#include "base/version.h"
#include <optional>

namespace component_updater {
class ComponentUpdateService;
}

namespace brave_wallet {

void RegisterWalletDataFilesComponent(
    component_updater::ComponentUpdateService* cus);
std::optional<base::Version> GetLastInstalledWalletVersion();
void SetLastInstalledWalletVersionForTest(const base::Version& version);

}  // namespace brave_wallet

#endif  // BRAVE_COMPONENTS_BRAVE_WALLET_BROWSER_WALLET_DATA_FILES_INSTALLER_H_
