/* Copyright (c) 2022 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "mises/components/brave_wallet/browser/solana_response_parser.h"

#include <limits>
#include <utility>

#include "base/base64.h"
#include "base/json/json_writer.h"
#include "base/strings/string_number_conversions.h"
#include "base/values.h"
#include "mises/components/brave_wallet/browser/json_rpc_response_parser.h"
#include "mises/components/brave_wallet/common/brave_wallet_types.h"
#include "mises/components/json/rs/src/lib.rs.h"

namespace brave_wallet {

namespace {

bool GetUint64FromDictValue(const base::Value::Dict& dict_value,
                            const std::string& key,
                            bool nullable,
                            uint64_t* ret) {
  if (!ret) {
    return false;
  }

  const base::Value* value = dict_value.Find(key);
  if (!value)
    return false;

  if (nullable && value->is_none()) {
    *ret = 0;
    return true;
  }

  auto* string_value = value->GetIfString();
  if (!string_value || string_value->empty())
    return false;

  return base::StringToUint64(*string_value, ret);
}

}  // namespace

namespace solana {

bool ParseGetBalance(const base::Value& json_value, uint64_t* balance) {
  DCHECK(balance);

  auto result = ParseResultDict(json_value);
  if (!result || !result)
    return false;

  return GetUint64FromDictValue(*result, "value", false, balance);
}

bool ParseGetTokenAccountBalance(const base::Value& json_value,
                                 std::string* amount,
                                 uint8_t* decimals,
                                 std::string* ui_amount_string) {
  DCHECK(amount && decimals && ui_amount_string);

  auto result = ParseResultDict(json_value);
  if (!result)
    return false;

  auto* value = result->FindDict("value");
  if (!value)
    return false;

  auto* amount_ptr = value->FindString("amount");
  if (!amount_ptr)
    return false;
  *amount = *amount_ptr;

  // uint8
  auto decimals_opt = value->FindInt("decimals");
  if (!decimals_opt ||
      decimals_opt.value() > std::numeric_limits<uint8_t>::max() ||
      decimals_opt.value() < 0)
    return false;
  *decimals = decimals_opt.value();

  auto* ui_amount_string_ptr = value->FindString("uiAmountString");
  if (!ui_amount_string_ptr)
    return false;
  *ui_amount_string = *ui_amount_string_ptr;

  return true;
}

bool ParseSendTransaction(const base::Value& json_value, std::string* tx_id) {
  auto string_result = ParseSingleStringResult(json_value);
  if (!string_result)
    return false;
  *tx_id = std::move(*string_result);
  return true;
}

bool ParseGetLatestBlockhash(const base::Value& json_value,
                             std::string* hash,
                             uint64_t* last_valid_block_height) {
  DCHECK(hash && last_valid_block_height);

  auto result = ParseResultDict(json_value);
  if (!result)
    return false;

  auto* value = result->FindDict("value");
  if (!value)
    return false;

  auto* hash_ptr = value->FindString("blockhash");
  if (!hash_ptr || hash_ptr->empty())
    return false;
  *hash = *hash_ptr;

  return GetUint64FromDictValue(*value, "lastValidBlockHeight", false,
                                last_valid_block_height);
}

bool ParseGetSignatureStatuses(
    const base::Value& json_value,
    std::vector<std::optional<SolanaSignatureStatus>>* statuses) {
  DCHECK(statuses);
  statuses->clear();

  auto result = ParseResultDict(json_value);
  if (!result)
    return false;

  const auto* value = result->FindList("value");
  if (!value)
    return false;

  for (const auto& item : *value) {
    const auto* status_value = item.GetIfDict();
    if (!status_value) {
      statuses->push_back(std::nullopt);
      continue;
    }

    SolanaSignatureStatus status;
    if (!GetUint64FromDictValue(*status_value, "slot", false, &status.slot) ||
        !GetUint64FromDictValue(*status_value, "confirmations", true,
                                &status.confirmations)) {
      statuses->push_back(std::nullopt);
      continue;
    }

    const base::Value* err_value = status_value->Find("err");
    if (!err_value || (!err_value->is_dict() && !err_value->is_none())) {
      statuses->push_back(std::nullopt);
      continue;
    }
    if (err_value->is_none()) {
      status.err = "";
    } else {
      base::JSONWriter::Write(*err_value, &status.err);
    }

    const base::Value* confirmation_status_value =
        status_value->Find("confirmationStatus");
    if (!confirmation_status_value ||
        (!confirmation_status_value->is_string() &&
         !confirmation_status_value->is_none())) {
      statuses->push_back(std::nullopt);
    } else if (confirmation_status_value->is_none()) {
      status.confirmation_status = "";
    } else {  // is_string
      const std::string* confirmation_status =
          confirmation_status_value->GetIfString();
      DCHECK(confirmation_status);
      status.confirmation_status = *confirmation_status;
    }

    statuses->push_back(status);
  }

  return true;
}

bool ParseGetAccountInfo(const base::Value& json_value,
                         std::optional<SolanaAccountInfo>* account_info_out) {
  DCHECK(account_info_out);

  auto response = json_rpc_responses::RPCResponse::FromValue(json_value);
  if (!response)
    return false;

  if (!response->result || !response->result->is_dict())
    return false;

  const base::Value* value = response->result->GetDict().Find("value");
  if (!value)
    return false;

  if (value->is_none()) {
    *account_info_out = std::nullopt;
    return true;
  }

  if (value->is_dict()) {
    return ParseGetAccountInfoPayload(value->GetDict(), account_info_out);
  }

  return false;
}

bool ParseGetAccountInfoPayload(
    const base::Value::Dict& value_dict,
    std::optional<SolanaAccountInfo>* account_info_out) {
  SolanaAccountInfo account_info;
  if (!GetUint64FromDictValue(value_dict, "lamports", false,
                              &account_info.lamports)) {
    return false;
  }

  auto* owner = value_dict.FindString("owner");
  if (!owner)
    return false;
  account_info.owner = *owner;

  auto* data = value_dict.FindList("data");
  if (!data)
    return false;
  if (data->size() != 2u || !(*data)[0].is_string() ||
      !(*data)[1].is_string() || (*data)[1].GetString() != "base64")
    return false;
  auto data_string = (*data)[0].GetString();
  if (!base::Base64Decode(data_string))
    return false;
  account_info.data = data_string;

  auto executable = value_dict.FindBool("executable");
  if (!executable)
    return false;
  account_info.executable = *executable;

  if (!GetUint64FromDictValue(value_dict, "rentEpoch", false,
                              &account_info.rent_epoch)) {
    return false;
  }
  *account_info_out = account_info;

  return true;
}

bool ParseGetFeeForMessage(const base::Value& json_value, uint64_t* fee) {
  DCHECK(fee);

  auto result = ParseResultDict(json_value);
  if (!result)
    return false;

  return GetUint64FromDictValue(*result, "value", true, fee);
}

bool ParseGetBlockHeight(const base::Value& json_value,
                         uint64_t* block_height) {
  DCHECK(block_height);

  auto block_height_string = ParseSingleStringResult(json_value);
  if (!block_height_string)
    return false;

  if (block_height_string->empty())
    return false;

  return base::StringToUint64(*block_height_string, block_height);
}

bool ParseGetTokenAccountsByOwner(const base::Value& json_value,
                                  std::vector<SolanaAccountInfo>* accounts) {
  DCHECK(accounts);

  auto result = ParseResultDict(json_value);
  if (!result)
    return false;

  const auto* account_dicts_list = result->FindList("value");
  if (!account_dicts_list)
    return false;

  // For each account dict, get the "account" key and parse the value as an
  // SolanaAccountInfo
  for (const auto& account_dict : *account_dicts_list) {
    const auto* account_dict_value = account_dict.GetIfDict();
    if (!account_dict_value)
      return false;

    const auto* account_value = account_dict_value->Find("account");
    if (!account_value)
      return false;

    std::optional<SolanaAccountInfo> account_info;
    if (!ParseGetAccountInfoPayload(account_value->GetDict(), &account_info))
      return false;

    if (account_info.has_value()) {
      accounts->push_back(std::move(*account_info));
    }
  }

  return true;
}

base::OnceCallback<std::optional<std::string>(const std::string& raw_response)>
ConverterForGetAccountInfo() {
  return base::BindOnce(&ConvertMultiUint64ToString,
                        std::vector<std::string>({"/result/value/lamports",
                                                  "/result/value/rentEpoch"}));
}

base::OnceCallback<std::optional<std::string>(const std::string& raw_response)>
ConverterForGetProrgamAccounts() {
  return base::BindOnce(
      &ConvertMultiUint64ToString,
      std::vector<std::string>(
          // Expecting 0 or 1 accounts here, so converting only at index 0.
          {"/result/0/account/lamports", "/result/0/account/rentEpoch"}));
}

}  // namespace solana

}  // namespace brave_wallet
