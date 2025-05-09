/* Copyright (c) 2022 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "mises/components/brave_wallet/browser/tx_service.h"

#include <utility>

#include "mises/components/brave_wallet/browser/brave_wallet_prefs.h"
#include "mises/components/brave_wallet/browser/eth_tx_manager.h"
#include "mises/components/brave_wallet/browser/fil_tx_manager.h"
#include "mises/components/brave_wallet/browser/solana_tx_manager.h"
#include "mises/components/brave_wallet/browser/tx_manager.h"
#include "url/origin.h"

namespace brave_wallet {

namespace {

mojom::CoinType GetCoinTypeFromTxDataUnion(
    const mojom::TxDataUnion& tx_data_union) {
  if (tx_data_union.is_solana_tx_data())
    return mojom::CoinType::SOL;

  if (tx_data_union.is_fil_tx_data())
    return mojom::CoinType::FIL;

  return mojom::CoinType::ETH;
}

size_t CalculatePendingTxCount(
    const std::vector<mojom::TransactionInfoPtr>& result) {
  size_t counter = 0u;
  for (const auto& tx : result) {
    if (tx->tx_status == mojom::TransactionStatus::Unapproved) {
      counter++;
    }
  }
  return counter;
}

}  // namespace

TxService::TxService(JsonRpcService* json_rpc_service,
                     KeyringService* keyring_service,
                     PrefService* prefs)
    : prefs_(prefs), weak_factory_(this) {
  tx_manager_map_[mojom::CoinType::ETH] = std::unique_ptr<TxManager>(
      new EthTxManager(this, json_rpc_service, keyring_service, prefs));
  tx_manager_map_[mojom::CoinType::SOL] = std::unique_ptr<TxManager>(
      new SolanaTxManager(this, json_rpc_service, keyring_service, prefs));
  tx_manager_map_[mojom::CoinType::FIL] = std::unique_ptr<TxManager>(
      new FilTxManager(this, json_rpc_service, keyring_service, prefs));
}

TxService::~TxService() = default;

TxManager* TxService::GetTxManager(mojom::CoinType coin_type) {
  auto* service = tx_manager_map_[coin_type].get();
  DCHECK(service);
  return service;
}

EthTxManager* TxService::GetEthTxManager() {
  return static_cast<EthTxManager*>(GetTxManager(mojom::CoinType::ETH));
}

SolanaTxManager* TxService::GetSolanaTxManager() {
  return static_cast<SolanaTxManager*>(GetTxManager(mojom::CoinType::SOL));
}

FilTxManager* TxService::GetFilTxManager() {
  return static_cast<FilTxManager*>(GetTxManager(mojom::CoinType::FIL));
}

mojo::PendingRemote<mojom::TxService> TxService::MakeRemote() {
  mojo::PendingRemote<mojom::TxService> remote;
  tx_service_receivers_.Add(this, remote.InitWithNewPipeAndPassReceiver());
  return remote;
}

void TxService::Bind(mojo::PendingReceiver<mojom::TxService> receiver) {
  tx_service_receivers_.Add(this, std::move(receiver));
}

mojo::PendingRemote<mojom::EthTxManagerProxy>
TxService::MakeEthTxManagerProxyRemote() {
  mojo::PendingRemote<mojom::EthTxManagerProxy> remote;
  eth_tx_manager_receivers_.Add(this, remote.InitWithNewPipeAndPassReceiver());
  return remote;
}

void TxService::BindEthTxManagerProxy(
    mojo::PendingReceiver<mojom::EthTxManagerProxy> receiver) {
  eth_tx_manager_receivers_.Add(this, std::move(receiver));
}

mojo::PendingRemote<mojom::SolanaTxManagerProxy>
TxService::MakeSolanaTxManagerProxyRemote() {
  mojo::PendingRemote<mojom::SolanaTxManagerProxy> remote;
  solana_tx_manager_receivers_.Add(this,
                                   remote.InitWithNewPipeAndPassReceiver());
  return remote;
}

mojo::PendingRemote<mojom::FilTxManagerProxy>
TxService::MakeFilTxManagerProxyRemote() {
  mojo::PendingRemote<mojom::FilTxManagerProxy> remote;
  fil_tx_manager_receivers_.Add(this, remote.InitWithNewPipeAndPassReceiver());
  return remote;
}

void TxService::BindSolanaTxManagerProxy(
    mojo::PendingReceiver<mojom::SolanaTxManagerProxy> receiver) {
  solana_tx_manager_receivers_.Add(this, std::move(receiver));
}

void TxService::BindFilTxManagerProxy(
    mojo::PendingReceiver<mojom::FilTxManagerProxy> receiver) {
  fil_tx_manager_receivers_.Add(this, std::move(receiver));
}

void TxService::AddUnapprovedTransaction(
    mojom::TxDataUnionPtr tx_data_union,
    const std::string& from,
    const std::optional<url::Origin>& origin,
    const std::optional<std::string>& group_id,
    AddUnapprovedTransactionCallback callback) {
  auto coin_type = GetCoinTypeFromTxDataUnion(*tx_data_union);

  GetTxManager(coin_type)->AddUnapprovedTransaction(
      std::move(tx_data_union), from, origin, group_id, std::move(callback));
}

void TxService::ApproveTransaction(mojom::CoinType coin_type,
                                   const std::string& tx_meta_id,
                                   ApproveTransactionCallback callback) {
  GetTxManager(coin_type)->ApproveTransaction(tx_meta_id, std::move(callback));
}

void TxService::RejectTransaction(mojom::CoinType coin_type,
                                  const std::string& tx_meta_id,
                                  RejectTransactionCallback callback) {
  GetTxManager(coin_type)->RejectTransaction(tx_meta_id, std::move(callback));
}

void TxService::GetTransactionInfo(mojom::CoinType coin_type,
                                   const std::string& tx_meta_id,
                                   GetTransactionInfoCallback callback) {
  GetTxManager(coin_type)->GetTransactionInfo(tx_meta_id, std::move(callback));
}

void TxService::GetAllTransactionInfo(mojom::CoinType coin_type,
                                      const std::string& from,
                                      GetAllTransactionInfoCallback callback) {
  GetTxManager(coin_type)->GetAllTransactionInfo(from, std::move(callback));
}

void TxService::GetAllTransactionInfo(mojom::CoinType coin_type,
                                      GetAllTransactionInfoCallback callback) {
  GetTxManager(coin_type)->GetAllTransactionInfo(std::nullopt,
                                                 std::move(callback));
}

void TxService::GetPendingTransactionsCount(
    GetPendingTransactionsCountCallback callback) {
  if (tx_manager_map_.empty()) {
    std::move(callback).Run(0u);
    return;
  }

  auto it = tx_manager_map_.begin();

  GetAllTransactionInfo(
      it->first, base::BindOnce(&TxService::OnGetAllTransactionInfo,
                                weak_factory_.GetWeakPtr(), std::move(callback),
                                0u, it->first));
}

void TxService::OnGetAllTransactionInfo(
    GetPendingTransactionsCountCallback callback,
    size_t counter,
    mojom::CoinType coin,
    std::vector<mojom::TransactionInfoPtr> result) {
  std::optional<mojom::CoinType> next_coin_to_check;
  counter += CalculatePendingTxCount(result);

  auto it = ++tx_manager_map_.find(coin);
  if (it != tx_manager_map_.end()) {
    next_coin_to_check = (it)->first;
  } else {
    std::move(callback).Run(counter);
    return;
  }

  DCHECK(next_coin_to_check);
  GetAllTransactionInfo(
      *next_coin_to_check,
      base::BindOnce(&TxService::OnGetAllTransactionInfo,
                     weak_factory_.GetWeakPtr(), std::move(callback), counter,
                     *next_coin_to_check));
}

void TxService::SpeedupOrCancelTransaction(
    mojom::CoinType coin_type,
    const std::string& tx_meta_id,
    bool cancel,
    SpeedupOrCancelTransactionCallback callback) {
  GetTxManager(coin_type)->SpeedupOrCancelTransaction(tx_meta_id, cancel,
                                                      std::move(callback));
}

void TxService::RetryTransaction(mojom::CoinType coin_type,
                                 const std::string& tx_meta_id,
                                 RetryTransactionCallback callback) {
  GetTxManager(coin_type)->RetryTransaction(tx_meta_id, std::move(callback));
}

void TxService::GetTransactionMessageToSign(
    mojom::CoinType coin_type,
    const std::string& tx_meta_id,
    GetTransactionMessageToSignCallback callback) {
  GetTxManager(coin_type)->GetTransactionMessageToSign(tx_meta_id,
                                                       std::move(callback));
}

void TxService::AddObserver(
    ::mojo::PendingRemote<mojom::TxServiceObserver> observer) {
  observers_.Add(std::move(observer));
}

void TxService::OnTransactionStatusChanged(mojom::TransactionInfoPtr tx_info) {
  for (const auto& observer : observers_)
    observer->OnTransactionStatusChanged(tx_info->Clone());
}

void TxService::OnNewUnapprovedTx(mojom::TransactionInfoPtr tx_info) {
  for (const auto& observer : observers_)
    observer->OnNewUnapprovedTx(tx_info->Clone());
}

void TxService::OnUnapprovedTxUpdated(mojom::TransactionInfoPtr tx_info) {
  for (const auto& observer : observers_)
    observer->OnUnapprovedTxUpdated(tx_info->Clone());
}

void TxService::Reset() {
  ClearTxServiceProfilePrefs(prefs_);
  for (auto const& service : tx_manager_map_)
    service.second->Reset();
  for (const auto& observer : observers_)
    observer->OnTxServiceReset();
}

void TxService::RejectAllTransactions(mojom::CoinType coin_type) {
  GetTxManager(coin_type)->GetAllTransactionInfo(
    std::nullopt,
    base::BindOnce(&TxService::ContinueRejectAllTransactions,
                     weak_factory_.GetWeakPtr(), coin_type));
}
void TxService::ContinueRejectAllTransactions(
    mojom::CoinType coin_type,
    std::vector<mojom::TransactionInfoPtr> result) {
  for (const auto& tx : result) {
    if (tx->tx_status == mojom::TransactionStatus::Unapproved) {
      GetTxManager(coin_type)->RejectTransaction(tx->id,
      base::BindOnce(&TxService::OnRejectTransaction,
                     weak_factory_.GetWeakPtr(), coin_type, tx->id));
    }
  }
}
void TxService::OnRejectTransaction(mojom::CoinType coin_type, const std::string& tx_meta_id, bool result) {

}

void TxService::MakeERC20TransferData(const std::string& to_address,
                                      const std::string& amount,
                                      MakeERC20TransferDataCallback callback) {
  GetEthTxManager()->MakeERC20TransferData(to_address, amount,
                                           std::move(callback));
}

void TxService::MakeERC20ApproveData(const std::string& spender_address,
                                     const std::string& amount,
                                     MakeERC20ApproveDataCallback callback) {
  GetEthTxManager()->MakeERC20ApproveData(spender_address, amount,
                                          std::move(callback));
}

void TxService::MakeERC721TransferFromData(
    const std::string& from,
    const std::string& to,
    const std::string& token_id,
    const std::string& contract_address,
    MakeERC721TransferFromDataCallback callback) {
  GetEthTxManager()->MakeERC721TransferFromData(
      from, to, token_id, contract_address, std::move(callback));
}

void TxService::MakeERC1155TransferFromData(
    const std::string& from,
    const std::string& to,
    const std::string& token_id,
    const std::string& value,
    const std::string& contract_address,
    MakeERC1155TransferFromDataCallback callback) {
  GetEthTxManager()->MakeERC1155TransferFromData(
      from, to, token_id, value, contract_address, std::move(callback));
}

void TxService::SetGasPriceAndLimitForUnapprovedTransaction(
    const std::string& tx_meta_id,
    const std::string& gas_price,
    const std::string& gas_limit,
    SetGasPriceAndLimitForUnapprovedTransactionCallback callback) {
  GetEthTxManager()->SetGasPriceAndLimitForUnapprovedTransaction(
      tx_meta_id, gas_price, gas_limit, std::move(callback));
}

void TxService::SetGasFeeAndLimitForUnapprovedTransaction(
    const std::string& tx_meta_id,
    const std::string& max_priority_fee_per_gas,
    const std::string& max_fee_per_gas,
    const std::string& gas_limit,
    SetGasFeeAndLimitForUnapprovedTransactionCallback callback) {
  GetEthTxManager()->SetGasFeeAndLimitForUnapprovedTransaction(
      tx_meta_id, max_priority_fee_per_gas, max_fee_per_gas, gas_limit,
      std::move(callback));
}

void TxService::SetDataForUnapprovedTransaction(
    const std::string& tx_meta_id,
    const std::vector<uint8_t>& data,
    SetDataForUnapprovedTransactionCallback callback) {
  GetEthTxManager()->SetDataForUnapprovedTransaction(tx_meta_id, data,
                                                     std::move(callback));
}

void TxService::SetNonceForUnapprovedTransaction(
    const std::string& tx_meta_id,
    const std::string& nonce,
    SetNonceForUnapprovedTransactionCallback callback) {
  GetEthTxManager()->SetNonceForUnapprovedTransaction(tx_meta_id, nonce,
                                                      std::move(callback));
}

void TxService::GetNonceForHardwareTransaction(
    const std::string& tx_meta_id,
    GetNonceForHardwareTransactionCallback callback) {
  GetEthTxManager()->GetNonceForHardwareTransaction(tx_meta_id,
                                                    std::move(callback));
}

void TxService::ProcessHardwareSignature(
    const std::string& tx_meta_id,
    const std::string& v,
    const std::string& r,
    const std::string& s,
    ProcessHardwareSignatureCallback callback) {
  GetEthTxManager()->ProcessHardwareSignature(tx_meta_id, v, r, s,
                                              std::move(callback));
}

void TxService::GetGasEstimation1559(GetGasEstimation1559Callback callback) {
  GetEthTxManager()->GetGasEstimation1559(std::move(callback));
}

void TxService::MakeSystemProgramTransferTxData(
    const std::string& from,
    const std::string& to,
    uint64_t lamports,
    MakeSystemProgramTransferTxDataCallback callback) {
  GetSolanaTxManager()->MakeSystemProgramTransferTxData(from, to, lamports,
                                                        std::move(callback));
}

void TxService::MakeTokenProgramTransferTxData(
    const std::string& spl_token_mint_address,
    const std::string& from_wallet_address,
    const std::string& to_wallet_address,
    uint64_t amount,
    MakeTokenProgramTransferTxDataCallback callback) {
  GetSolanaTxManager()->MakeTokenProgramTransferTxData(
      spl_token_mint_address, from_wallet_address, to_wallet_address, amount,
      std::move(callback));
}

void TxService::MakeTxDataFromBase64EncodedTransaction(
    const std::string& encoded_transaction,
    const mojom::TransactionType tx_type,
    mojom::SolanaSendTransactionOptionsPtr send_options,
    MakeTxDataFromBase64EncodedTransactionCallback callback) {
  GetSolanaTxManager()->MakeTxDataFromBase64EncodedTransaction(
      encoded_transaction, std::move(tx_type), std::move(send_options),
      std::move(callback));
}

void TxService::GetEstimatedTxFee(const std::string& tx_meta_id,
                                  GetEstimatedTxFeeCallback callback) {
  GetSolanaTxManager()->GetEstimatedTxFee(tx_meta_id, std::move(callback));
}

void TxService::ProcessSolanaHardwareSignature(
    const std::string& tx_meta_id,
    const std::vector<uint8_t>& signature,
    ProcessSolanaHardwareSignatureCallback callback) {
  GetSolanaTxManager()->ProcessSolanaHardwareSignature(tx_meta_id, signature,
                                                       std::move(callback));
}

void TxService::ProcessFilHardwareSignature(
    const std::string& tx_meta_id,
    const std::string& signed_message,
    ProcessFilHardwareSignatureCallback callback) {
  GetFilTxManager()->ProcessFilHardwareSignature(tx_meta_id, signed_message,
                                                 std::move(callback));
}

}  // namespace brave_wallet
