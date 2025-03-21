/* Copyright (c) 2022 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#ifndef BRAVE_COMPONENTS_BRAVE_WALLET_COMMON_SOLANA_UTILS_H_
#define BRAVE_COMPONENTS_BRAVE_WALLET_COMMON_SOLANA_UTILS_H_

#include <string>
#include <tuple>
#include <vector>

#include "base/containers/span.h"
#include "base/values.h"
#include <optional>

namespace brave_wallet {

// Encode uint16_t value into 1-3 bytes compact-u16.
// See
// https://docs.solana.com/developing/programming-model/transactions#compact-u16-format
void CompactU16Encode(uint16_t u16, std::vector<uint8_t>* compact_u16);

std::optional<std::tuple<uint16_t, size_t>> CompactU16Decode(
    const std::vector<uint8_t>& compact_u16,
    size_t start_index);

// A bridge function to call DecodeBase58 in bitcoin-core.
// It will return false if length of decoded byte array does not match len
// param.
bool Base58Decode(const std::string& str,
                  std::vector<uint8_t>* ret,
                  int len,
                  bool strict = true);
// A bridge function to call EncodeBase58 in bitcoin-core.
std::string Base58Encode(const std::vector<uint8_t>& bytes);
std::string Base58Encode(base::span<const uint8_t> bytes);

bool IsBase58EncodedSolanaPubkey(const std::string& key);

bool Uint8ArrayDecode(const std::string& str,
                      std::vector<uint8_t>* ret,
                      size_t len);

std::optional<uint8_t> GetUint8FromStringDict(const base::Value::Dict& dict,
                                               const std::string& key);

// A compact-array is serialized as the array length, followed by each array
// item. bytes_index will be increased by the bytes read (consumed) in this
// function.
std::optional<std::vector<uint8_t>> CompactArrayDecode(
    const std::vector<uint8_t>& bytes,
    size_t* bytes_index);

}  // namespace brave_wallet

#endif  // BRAVE_COMPONENTS_BRAVE_WALLET_COMMON_SOLANA_UTILS_H_
