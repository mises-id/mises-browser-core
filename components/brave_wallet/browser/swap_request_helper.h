/* Copyright (c) 2022 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#ifndef BRAVE_COMPONENTS_BRAVE_WALLET_BROWSER_SWAP_REQUEST_HELPER_H_
#define BRAVE_COMPONENTS_BRAVE_WALLET_BROWSER_SWAP_REQUEST_HELPER_H_

#include <string>
#include "mises/components/brave_wallet/common/brave_wallet.mojom.h"

namespace brave_wallet {

std::optional<std::string> EncodeJupiterTransactionParams(
    mojom::JupiterSwapParamsPtr params);

}  // namespace brave_wallet

#endif  // BRAVE_COMPONENTS_BRAVE_WALLET_BROWSER_SWAP_REQUEST_HELPER_H_
