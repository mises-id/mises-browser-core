/* Copyright (c) 2021 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "mises/components/brave_wallet/browser/fil_requests.h"

#include <utility>

#include "base/json/json_reader.h"
#include "base/json/json_writer.h"
#include "mises/components/brave_wallet/browser/json_rpc_requests_helper.h"
#include "mises/components/json/rs/src/lib.rs.h"

namespace brave_wallet {

namespace fil {

std::string getBalance(const std::string& address) {
  return GetJsonRpcString("Filecoin.WalletBalance", address);
}

std::string getTransactionCount(const std::string& address) {
  return GetJsonRpcString("Filecoin.MpoolGetNonce", address);
}

std::string getEstimateGas(const std::string& from_address,
                           const std::string& to_address,
                           const std::string& gas_premium,
                           const std::string& gas_fee_cap,
                           int64_t gas_limit,
                           uint64_t nonce,
                           const std::string& max_fee,
                           const std::string& value) {
  base::Value::List params;

  base::Value::Dict transaction;
  transaction.Set("To", to_address);
  transaction.Set("From", from_address);
  transaction.Set("Value", value);
  transaction.Set("GasPremium", gas_premium.empty() ? "0" : gas_premium);
  transaction.Set("GasFeeCap", gas_fee_cap.empty() ? "0" : gas_fee_cap);
  transaction.Set("Method", 0);
  transaction.Set("Version", 0);
  transaction.Set("Params", "");
  transaction.Set("GasLimit", std::to_string(gas_limit));
  transaction.Set("Nonce", std::to_string(nonce));
  params.Append(std::move(transaction));

  base::Value::Dict fee;
  fee.Set("MaxFee", max_fee.empty() ? "0" : max_fee);
  params.Append(std::move(fee));

  base::Value::List cids;
  params.Append(std::move(cids));

  // TODO(cdesouza): This dictionary should be composed by GetJsonRpcDictionary.
  base::Value::Dict dict;
  dict.Set("jsonrpc", "2.0");
  dict.Set("method", "Filecoin.GasEstimateMessageGas");
  dict.Set("params", std::move(params));
  dict.Set("id", 1);
  std::string json;
  base::JSONWriter::Write(dict, &json);
  json = std::string(json::convert_string_value_to_int64("/params/0/GasLimit",
                                                         json.c_str(), false)
                         .c_str());
  return std::string(json::convert_string_value_to_uint64("/params/0/Nonce",
                                                          json.c_str(), false)
                         .c_str());
}

std::string getChainHead() {
  return GetJsonRpcString("Filecoin.ChainHead");
}

std::string getStateSearchMsgLimited(const std::string& cid, uint64_t period) {
  base::Value::Dict cid_value;
  cid_value.Set("/", cid);
  auto result =
      GetJsonRpcString("Filecoin.StateSearchMsgLimited", std::move(cid_value),
                       base::Value(std::to_string(period)));
  result = std::string(
      json::convert_string_value_to_uint64("/params/1", result.c_str(), false)
          .c_str());
  return result;
}

std::optional<std::string> getSendTransaction(const std::string& signed_tx) {
  std::optional<base::Value> parsed_tx = base::JSONReader::Read(signed_tx);
  if (!parsed_tx || !parsed_tx->is_dict()) {
    return std::nullopt;
  }
  base::Value::List params;
  params.Append(std::move(*parsed_tx));

  // TODO(cdesouza): This dictionary should be composed by GetJsonRpcDictionary.
  base::Value::Dict dict;
  dict.Set("jsonrpc", "2.0");
  dict.Set("method", "Filecoin.MpoolPush");
  dict.Set("params", std::move(params));
  dict.Set("id", 1);

  return GetJSON(dict);
}

}  // namespace fil

}  // namespace brave_wallet
