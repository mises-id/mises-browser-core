/* Copyright (c) 2022 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "mises/components/brave_wallet/browser/solana_tx_meta.h"

#include <string>
#include <vector>

#include "base/values.h"
#include "mises/components/brave_wallet/browser/brave_wallet_utils.h"

namespace brave_wallet {

SolanaTxMeta::SolanaTxMeta() = default;

SolanaTxMeta::SolanaTxMeta(std::unique_ptr<SolanaTransaction> tx)
    : tx_(std::move(tx)) {}

SolanaTxMeta::~SolanaTxMeta() = default;

bool SolanaTxMeta::operator==(const SolanaTxMeta& meta) const {
  return TxMeta::operator==(meta) &&
         signature_status_ == meta.signature_status_ && *tx_ == *meta.tx_;
}

base::Value::Dict SolanaTxMeta::ToValue() const {
  base::Value::Dict dict = TxMeta::ToValue();
  dict.Set("tx", tx_->ToValue());
  dict.Set("signature_status", signature_status_.ToValue());
  return dict;
}

mojom::TransactionInfoPtr SolanaTxMeta::ToTransactionInfo() const {
  return mojom::TransactionInfo::New(
      id_, from_, tx_hash_,
      mojom::TxDataUnion::NewSolanaTxData(tx_->ToSolanaTxData()), status_,
      tx_->tx_type(), std::vector<std::string>() /* tx_params */,
      std::vector<std::string>() /* tx_args */,
      base::Milliseconds(created_time_.InMillisecondsSinceUnixEpoch()),
      base::Milliseconds(submitted_time_.InMillisecondsSinceUnixEpoch()),
      base::Milliseconds(confirmed_time_.InMillisecondsSinceUnixEpoch()),
      origin_.has_value() ? MakeOriginInfo(*origin_) : nullptr, group_id_,
      chain_id_);
}

}  // namespace brave_wallet
