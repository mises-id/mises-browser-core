/* Copyright (c) 2022 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "mises/components/brave_wallet/browser/fil_tx_meta.h"

#include <string>
#include <vector>

#include "base/strings/string_number_conversions.h"
#include "base/values.h"
#include "mises/components/brave_wallet/browser/brave_wallet_utils.h"
#include "mises/components/brave_wallet/browser/fil_transaction.h"
#include "mises/components/brave_wallet/browser/tx_meta.h"
#include "mises/components/brave_wallet/common/fil_address.h"

namespace brave_wallet {

FilTxMeta::FilTxMeta() : tx_(std::make_unique<FilTransaction>()) {}
FilTxMeta::FilTxMeta(std::unique_ptr<FilTransaction> tx) : tx_(std::move(tx)) {}

FilTxMeta::~FilTxMeta() = default;

bool FilTxMeta::operator==(const FilTxMeta& meta) const {
  return TxMeta::operator==(meta) && *tx_ == *meta.tx_;
}

base::Value::Dict FilTxMeta::ToValue() const {
  base::Value::Dict dict = TxMeta::ToValue();
  dict.Set("tx", tx_->ToValue());
  return dict;
}

mojom::TransactionInfoPtr FilTxMeta::ToTransactionInfo() const {
  return mojom::TransactionInfo::New(
      id_, from_, tx_hash_,
      mojom::TxDataUnion::NewFilTxData(tx_->ToFilTxData()), status_,
      mojom::TransactionType::Other, std::vector<std::string>() /* tx_params */,
      std::vector<std::string>() /* tx_args */,
      base::Milliseconds(created_time_.InMillisecondsSinceUnixEpoch()),
      base::Milliseconds(submitted_time_.InMillisecondsSinceUnixEpoch()),
      base::Milliseconds(confirmed_time_.InMillisecondsSinceUnixEpoch()),
      origin_.has_value() ? MakeOriginInfo(*origin_) : nullptr, group_id_,
      chain_id_);
}

}  // namespace brave_wallet
