/* Copyright (c) 2021 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "mises/components/brave_wallet/browser/swap_response_parser.h"

#include <utility>
#include <vector>

#include "base/containers/contains.h"
#include "base/strings/string_number_conversions.h"
#include "base/strings/stringprintf.h"
#include "mises/components/brave_wallet/browser/brave_wallet_constants.h"
#include "mises/components/brave_wallet/browser/json_rpc_requests_helper.h"
#include "mises/components/brave_wallet/browser/json_rpc_response_parser.h"
#include "mises/components/brave_wallet/browser/swap_responses.h"
#include "mises/components/json/rs/src/lib.rs.h"

namespace {

constexpr int kSwapValidationErrorCode = 100;
constexpr char kInsufficientAssetLiquidity[] = "INSUFFICIENT_ASSET_LIQUIDITY";
constexpr char kJupiterNoRoutesMessage[] =
    "No routes found for the input and output mints";

std::optional<double> ParsePriceImpactPct(const base::Value& value) {
  // null value is considered as 0 price impact.
  if (value.is_none()) {
    return 0.0;
  }

  double result;
  if (value.is_string()) {
    if (!base::StringToDouble(value.GetString(), &result)) {
      return std::nullopt;
    }

    return result;
  }

  return std::nullopt;
}

}  // namespace

namespace brave_wallet {

mojom::SwapResponsePtr ParseSwapResponse(const base::Value& json_value,
                                         bool expect_transaction_data) {
  // {
  //   "price":"1916.27547998814058355",
  //   "guaranteedPrice":"1935.438234788021989386",
  //   "to":"0xdef1c0ded9bec7f1a1670819833240f027b25eff",
  //   "data":"...",
  //   "value":"0",
  //   "gas":"719000",
  //   "estimatedGas":"719000",
  //   "gasPrice":"26000000000",
  //   "protocolFee":"0",
  //   "minimumProtocolFee":"0",
  //   "buyTokenAddress":"0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
  //   "sellTokenAddress":"0x6b175474e89094c44da98b954eedeac495271d0f",
  //   "buyAmount":"1000000000000000000000",
  //   "sellAmount":"1916275479988140583549706",
  //   "sources":[...],
  //   "allowanceTarget":"0xdef1c0ded9bec7f1a1670819833240f027b25eff",
  //   "sellTokenToEthRate":"1900.44962824532464391",
  //   "buyTokenToEthRate":"1",
  //   "estimatedPriceImpact": "0.7232",
  //   "sources": [
  //     {
  //       "name": "0x",
  //       "proportion": "0",
  //     },
  //     {
  //       "name": "Uniswap_V2",
  //       "proportion": "1",
  //     },
  //     {
  //       "name": "Curve",
  //       "proportion": "0",
  //     }
  //   ]
  // }

  auto swap_response_value =
      swap_responses::SwapResponse0x::FromValue(json_value);
  if (!swap_response_value)
    return nullptr;

  auto swap_response = mojom::SwapResponse::New();
  swap_response->price = swap_response_value->price;

  if (expect_transaction_data) {
    if (!swap_response_value->guaranteed_price)
      return nullptr;
    swap_response->guaranteed_price = *swap_response_value->guaranteed_price;

    if (!swap_response_value->to)
      return nullptr;
    swap_response->to = *swap_response_value->to;

    if (!swap_response_value->data)
      return nullptr;
    swap_response->data = *swap_response_value->data;
  }

  swap_response->value = swap_response_value->value;
  swap_response->gas = swap_response_value->gas;
  swap_response->estimated_gas = swap_response_value->estimated_gas;
  swap_response->gas_price = swap_response_value->gas_price;
  swap_response->protocol_fee = swap_response_value->protocol_fee;
  swap_response->minimum_protocol_fee =
      swap_response_value->minimum_protocol_fee;
  swap_response->buy_token_address = swap_response_value->buy_token_address;
  swap_response->sell_token_address = swap_response_value->sell_token_address;
  swap_response->buy_amount = swap_response_value->buy_amount;
  swap_response->sell_amount = swap_response_value->sell_amount;
  swap_response->allowance_target = swap_response_value->allowance_target;
  swap_response->sell_token_to_eth_rate =
      swap_response_value->sell_token_to_eth_rate;
  swap_response->buy_token_to_eth_rate =
      swap_response_value->buy_token_to_eth_rate;
  swap_response->estimated_price_impact =
      swap_response_value->estimated_price_impact;

  for (const auto& source_value : swap_response_value->sources) {
    swap_response->sources.push_back(
        mojom::ZeroExSource::New(source_value.name, source_value.proportion));
  }

  return swap_response;
}

mojom::SwapErrorResponsePtr ParseSwapErrorResponse(
    const base::Value& json_value) {
  // https://github.com/0xProject/0x-monorepo/blob/development/packages/json-schemas/schemas/relayer_api_error_response_schema.json
  //
  // {
  // 	"code": 100,
  // 	"reason": "Validation Failed",
  // 	"validationErrors": [{
  // 			"field": "sellAmount",
  // 			"code": 1001,
  // 			"reason": "should match pattern \"^\\d+$\""
  // 		},
  // 		{
  // 			"field": "sellAmount",
  // 			"code": 1001,
  // 			"reason": "should be integer"
  // 		},
  // 		{
  // 			"field": "sellAmount",
  // 			"code": 1001,
  // 			"reason": "should match some schema in anyOf"
  // 		}
  // 	]
  // }

  auto swap_error_response_value =
      swap_responses::SwapErrorResponse0x::FromValue(json_value);
  if (!swap_error_response_value) {
    return nullptr;
  }

  auto result = mojom::SwapErrorResponse::New();
  result->code = swap_error_response_value->code;
  result->reason = swap_error_response_value->reason;

  if (swap_error_response_value->validation_errors) {
    for (auto& error_item : *swap_error_response_value->validation_errors) {
      result->validation_errors.emplace_back(mojom::SwapErrorResponseItem::New(
          error_item.field, error_item.code, error_item.reason));
    }
  }
  result->is_insufficient_liquidity = false;
  if (result->code == kSwapValidationErrorCode) {
    for (auto& item : result->validation_errors) {
      if (item->reason == kInsufficientAssetLiquidity) {
        result->is_insufficient_liquidity = true;
      }
    }
  }

  return result;
}

mojom::JupiterQuotePtr ParseJupiterQuote(const base::Value& json_value) {
  //    {
  //      "data": [
  //        {
  //          "inAmount": "10000",
  //          "outAmount": "261273",
  //          "amount": "10000",
  //          "otherAmountThreshold": "258660",
  //          "outAmountWithSlippage": "258660",
  //          "swapMode": "ExactIn",
  //          "priceImpactPct": "0.008955716118219659",
  //          "marketInfos": [
  //            {
  //              "id": "2yNwARmTmc3NzYMETCZQjAE5GGCPgviH6hiBsxaeikTK",
  //              "label": "Orca",
  //              "inputMint": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  //              "outputMint": "MNDEFzGvMt87ueuHvVU9VcTqsAP5b3fTGPsHuuPA5ey",
  //              "notEnoughLiquidity": false,
  //              "inAmount": "10000",
  //              "outAmount": "117001203",
  //              "priceImpactPct": "0.0000001196568750220778",
  //              "lpFee": {
  //                "amount": "30",
  //                "mint": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  //                "pct": "0.003"
  //              },
  //              "platformFee": {
  //                "amount": "0",
  //                "mint": "MNDEFzGvMt87ueuHvVU9VcTqsAP5b3fTGPsHuuPA5ey",
  //                "pct": "0"
  //              }
  //            }
  //          ]
  //        }
  //      ],
  //      "timeTaken": "0.044471802000089156"
  //    }

  auto quote_value =
      swap_responses::JupiterQuoteResponse::FromValue(json_value);
  if (!quote_value)
    return nullptr;

  auto swap_quote = mojom::JupiterQuote::New();
  for (const auto& route_value : quote_value->data) {
    mojom::JupiterRoute route;
    if (!base::StringToUint64(route_value.in_amount, &route.in_amount))
      return nullptr;
    if (!base::StringToUint64(route_value.out_amount, &route.out_amount))
      return nullptr;
    if (!base::StringToUint64(route_value.amount, &route.amount))
      return nullptr;
    if (!base::StringToUint64(route_value.other_amount_threshold,
                              &route.other_amount_threshold))
      return nullptr;
    route.swap_mode = route_value.swap_mode;

    const auto& route_price_impact_pct =
        ParsePriceImpactPct(route_value.price_impact_pct);
    if (!route_price_impact_pct) {
      return nullptr;
    }
    route.price_impact_pct = *route_price_impact_pct;

    for (const auto& market_info_value : route_value.market_infos) {
      mojom::JupiterMarketInfo market_info;

      market_info.id = market_info_value.id;
      market_info.label = market_info_value.label;
      market_info.input_mint = market_info_value.input_mint;
      market_info.output_mint = market_info_value.output_mint;
      market_info.not_enough_liquidity = market_info_value.not_enough_liquidity;

      if (!base::StringToUint64(market_info_value.in_amount,
                                &market_info.in_amount))
        return nullptr;
      if (!base::StringToUint64(market_info_value.out_amount,
                                &market_info.out_amount))
        return nullptr;

      const auto& market_info_price_impact_pct =
          ParsePriceImpactPct(market_info_value.price_impact_pct);
      if (!market_info_price_impact_pct) {
        return nullptr;
      }
      market_info.price_impact_pct = *market_info_price_impact_pct;

      // Parse lpFee->amount field as a JSON integer field, since the
      // values are typically very small, and intermediate conversion to string
      // is expensive due to its deep nesting.
      mojom::JupiterFee lp_fee;
      if (!base::StringToUint64(market_info_value.lp_fee.amount,
                                &lp_fee.amount))
        return nullptr;
      lp_fee.mint = market_info_value.lp_fee.mint;
      if (!base::StringToDouble(market_info_value.lp_fee.pct, &lp_fee.pct))
        return nullptr;
      market_info.lp_fee = lp_fee.Clone();

      // Parse platformFee->amount field as a JSON integer field, since the
      // values are typically very small, and intermediate conversion to string
      // is expensive due to its deep nesting.
      mojom::JupiterFee platform_fee;
      if (!base::StringToUint64(market_info_value.platform_fee.amount,
                                &platform_fee.amount))
        return nullptr;
      platform_fee.mint = market_info_value.platform_fee.mint;
      if (!base::StringToDouble(market_info_value.platform_fee.pct,
                                &platform_fee.pct))
        return nullptr;
      market_info.platform_fee = platform_fee.Clone();
      route.market_infos.push_back(market_info.Clone());
    }

    swap_quote->routes.push_back(route.Clone());
  }

  return swap_quote;
}

mojom::JupiterSwapTransactionsPtr ParseJupiterSwapTransactions(
    const base::Value& json_value) {
  auto value = swap_responses::JupiterSwapTransactions::FromValue(json_value);
  if (!value)
    return nullptr;

  auto swap_transactions = mojom::JupiterSwapTransactions::New();

  swap_transactions->setup_transaction = "";
  if (value->setup_transaction)
    swap_transactions->setup_transaction = *value->setup_transaction;
  swap_transactions->swap_transaction = value->swap_transaction;

  swap_transactions->cleanup_transaction = "";
  if (value->cleanup_transaction)
    swap_transactions->cleanup_transaction = *value->cleanup_transaction;

  return swap_transactions;
}

mojom::JupiterErrorResponsePtr ParseJupiterErrorResponse(
    const base::Value& json_value) {
  auto jupiter_error_response_value =
      swap_responses::JupiterErrorResponse::FromValue(json_value);
  if (!jupiter_error_response_value) {
    return nullptr;
  }

  auto result = mojom::JupiterErrorResponse::New();
  result->status_code = jupiter_error_response_value->status_code;
  result->error = jupiter_error_response_value->error;
  result->message = jupiter_error_response_value->message;

  result->is_insufficient_liquidity =
      base::Contains(result->message, kJupiterNoRoutesMessage);

  return result;
}

// Function to convert all numbers in JSON string to strings.
//
// For sample JSON response, refer to ParseJupiterQuote.
std::optional<std::string> ConvertAllNumbersToString(const std::string& json) {
  auto converted_json = std::string(json::convert_all_numbers_to_string(json, ""));
  if (converted_json.empty())
    return std::nullopt;

  return converted_json;
}

}  // namespace brave_wallet
