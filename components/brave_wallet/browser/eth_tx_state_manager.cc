/* Copyright (c) 2021 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "mises/components/brave_wallet/browser/eth_tx_state_manager.h"

#include <utility>

#include "base/logging.h"
#include "base/strings/strcat.h"
#include "base/values.h"
#include "mises/components/brave_wallet/browser/brave_wallet_constants.h"
#include "mises/components/brave_wallet/browser/brave_wallet_utils.h"
#include "mises/components/brave_wallet/browser/eip1559_transaction.h"
#include "mises/components/brave_wallet/browser/eip2930_transaction.h"
#include "mises/components/brave_wallet/browser/eth_tx_meta.h"
#include "mises/components/brave_wallet/browser/json_rpc_service.h"
#include "mises/components/brave_wallet/browser/tx_meta.h"
#include "mises/components/brave_wallet/common/eth_address.h"

namespace brave_wallet {

EthTxStateManager::EthTxStateManager(PrefService* prefs,
                                     JsonRpcService* json_rpc_service)
    : TxStateManager(prefs, json_rpc_service) {}

EthTxStateManager::~EthTxStateManager() = default;

std::vector<std::unique_ptr<TxMeta>> EthTxStateManager::GetTransactionsByStatus(
    std::optional<mojom::TransactionStatus> status,
    std::optional<EthAddress> from) {
  std::vector<std::unique_ptr<TxMeta>> result;
  std::optional<std::string> from_string =
      from.has_value() ? std::optional<std::string>(from->ToChecksumAddress())
                       : std::nullopt;
  return TxStateManager::GetTransactionsByStatus(status, from_string);
}

std::unique_ptr<EthTxMeta> EthTxStateManager::GetEthTx(const std::string& id) {
  return std::unique_ptr<EthTxMeta>{
      static_cast<EthTxMeta*>(TxStateManager::GetTx(id).release())};
}

std::unique_ptr<EthTxMeta> EthTxStateManager::ValueToEthTxMeta(
    const base::Value::Dict& value) {
  return std::unique_ptr<EthTxMeta>{
      static_cast<EthTxMeta*>(ValueToTxMeta(value).release())};
}

std::unique_ptr<TxMeta> EthTxStateManager::ValueToTxMeta(
    const base::Value::Dict& value) {
  std::unique_ptr<EthTxMeta> meta = std::make_unique<EthTxMeta>();

  if (!TxStateManager::ValueToTxMeta(value, meta.get()))
    return nullptr;

  const base::Value::Dict* tx_receipt = value.FindDict("tx_receipt");
  if (!tx_receipt)
    return nullptr;
  std::optional<TransactionReceipt> tx_receipt_from_value =
      ValueToTransactionReceipt(*tx_receipt);
  if (!tx_receipt_from_value)
    return nullptr;
  meta->set_tx_receipt(*tx_receipt_from_value);

  const base::Value::Dict* tx = value.FindDict("tx");
  if (!tx)
    return nullptr;

  std::optional<bool> sign_only = value.FindBool("sign_only");
  if (sign_only)
    meta->set_sign_only(*sign_only);

  std::optional<int> type = tx->FindInt("type");
  if (!type)
    return nullptr;

  switch (static_cast<uint8_t>(*type)) {
    case 0: {
      std::optional<EthTransaction> tx_from_value =
          EthTransaction::FromValue(*tx);
      if (!tx_from_value)
        return nullptr;
      meta->set_tx(std::make_unique<EthTransaction>(*tx_from_value));
      break;
    }
    case 1: {
      std::optional<Eip2930Transaction> tx_from_value =
          Eip2930Transaction::FromValue(*tx);
      if (!tx_from_value)
        return nullptr;
      meta->set_tx(std::make_unique<Eip2930Transaction>(*tx_from_value));
      break;
    }
    case 2: {
      std::optional<Eip1559Transaction> tx_from_value =
          Eip1559Transaction::FromValue(*tx);
      if (!tx_from_value)
        return nullptr;
      meta->set_tx(std::make_unique<Eip1559Transaction>(*tx_from_value));
      break;
    }
    default:
      LOG(ERROR) << "tx type is not supported";
      break;
  }

  return meta;
}

std::string EthTxStateManager::GetTxPrefPathPrefix() {
  return base::StrCat(
      {kEthereumPrefKey, ".",
       GetNetworkId(prefs_, mojom::CoinType::ETH,
                    json_rpc_service_->GetChainId(mojom::CoinType::ETH))});
}

}  // namespace brave_wallet
