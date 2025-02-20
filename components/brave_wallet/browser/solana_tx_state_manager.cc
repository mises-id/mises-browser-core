/* Copyright (c) 2022 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "mises/components/brave_wallet/browser/solana_tx_state_manager.h"

#include <utility>

#include "base/strings/strcat.h"
#include "base/values.h"
#include "mises/components/brave_wallet/browser/brave_wallet_constants.h"
#include "mises/components/brave_wallet/browser/brave_wallet_utils.h"
#include "mises/components/brave_wallet/browser/json_rpc_service.h"
#include "mises/components/brave_wallet/browser/solana_tx_meta.h"

namespace brave_wallet {

SolanaTxStateManager::SolanaTxStateManager(PrefService* prefs,
                                           JsonRpcService* json_rpc_service)
    : TxStateManager(prefs, json_rpc_service) {}

SolanaTxStateManager::~SolanaTxStateManager() = default;

std::unique_ptr<SolanaTxMeta> SolanaTxStateManager::ValueToSolanaTxMeta(
    const base::Value::Dict& value) {
  return std::unique_ptr<SolanaTxMeta>{
      static_cast<SolanaTxMeta*>(ValueToTxMeta(value).release())};
}

std::unique_ptr<TxMeta> SolanaTxStateManager::ValueToTxMeta(
    const base::Value::Dict& value) {
  std::unique_ptr<SolanaTxMeta> meta = std::make_unique<SolanaTxMeta>();

  if (!TxStateManager::ValueToTxMeta(value, meta.get()))
    return nullptr;

  const base::Value::Dict* tx_value = value.FindDict("tx");
  if (!tx_value)
    return nullptr;
  auto tx = SolanaTransaction::FromValue(*tx_value);
  if (!tx)
    return nullptr;
  meta->set_tx(std::move(tx));

  const base::Value::Dict* signature_status_value =
      value.FindDict("signature_status");
  if (!signature_status_value)
    return nullptr;
  std::optional<SolanaSignatureStatus> signature_status =
      SolanaSignatureStatus::FromValue(*signature_status_value);
  if (!signature_status)
    return nullptr;
  meta->set_signature_status(*signature_status);

  return meta;
}

std::string SolanaTxStateManager::GetTxPrefPathPrefix() {
  return base::StrCat(
      {kSolanaPrefKey, ".",
       GetNetworkId(prefs_, mojom::CoinType::SOL,
                    json_rpc_service_->GetChainId(mojom::CoinType::SOL))});
}

std::unique_ptr<SolanaTxMeta> SolanaTxStateManager::GetSolanaTx(
    const std::string& id) {
  return std::unique_ptr<SolanaTxMeta>{
      static_cast<SolanaTxMeta*>(TxStateManager::GetTx(id).release())};
}

}  // namespace brave_wallet
