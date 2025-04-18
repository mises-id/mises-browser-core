// Copyright (c) 2023 The Brave Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this file,
// You can obtain one at https://mozilla.org/MPL/2.0/.

#include "mises/components/brave_wallet/browser/brave_wallet_ipfs_service.h"

#include <string>
#include <utility>

#include "mises/components/ipfs/ipfs_utils.h"

namespace brave_wallet {

BraveWalletIpfsService::BraveWalletIpfsService(PrefService* pref_service)
    : pref_service_(pref_service) {}

BraveWalletIpfsService::~BraveWalletIpfsService() = default;

mojo::PendingRemote<mojom::IpfsService> BraveWalletIpfsService::MakeRemote() {
  mojo::PendingRemote<mojom::IpfsService> remote;
  receivers_.Add(this, remote.InitWithNewPipeAndPassReceiver());
  return remote;
}

void BraveWalletIpfsService::Bind(
    mojo::PendingReceiver<mojom::IpfsService> receiver) {
  receivers_.Add(this, std::move(receiver));
}

void BraveWalletIpfsService::TranslateToNFTGatewayURL(
    const std::string& url,
    TranslateToNFTGatewayURLCallback callback) {
  GURL new_url;
  if (ipfs::TranslateIPFSURI(GURL(url), &new_url,
                             ipfs::GetDefaultNFTIPFSGateway(pref_service_),
                             false)) {
    std::move(callback).Run(new_url.spec());
  } else {
    std::move(callback).Run(std::nullopt);
  }
}

void BraveWalletIpfsService::ExtractIPFSUrlFromGatewayLikeUrl(
    const std::string& url,
    ExtractIPFSUrlFromGatewayLikeUrlCallback callback) {
  auto result = ipfs::ExtractSourceFromGateway(GURL(url));
  if (result.has_value()) {
    std::move(callback).Run(result.value().spec());
  } else {
    std::move(callback).Run(std::nullopt);
  }
}

}  // namespace brave_wallet
