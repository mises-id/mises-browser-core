/* Copyright (c) 2022 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#ifndef BRAVE_COMPONENTS_BRAVE_WALLET_BROWSER_BIT_DOMAINS_MULTICHAIN_CALLS_H_
#define BRAVE_COMPONENTS_BRAVE_WALLET_BROWSER_BIT_DOMAINS_MULTICHAIN_CALLS_H_

#include <string>
#include <tuple>
#include <vector>

#include "base/functional/callback.h"
#include "base/containers/flat_map.h"
#include "mises/components/brave_wallet/common/brave_wallet.mojom.h"
#include "third_party/abseil-cpp/absl/types/optional.h"

namespace brave_wallet::bit {

// (domain, coin, symbol, chain_id)
using WalletAddressKey =
    std::tuple<std::string, mojom::CoinType, std::string, std::string>;

template <class ResultType>
class ResolveCall {
 public:
  using CallbackType = base::OnceCallback<
      void(const ResultType&, mojom::ProviderError, const std::string&)>;

  struct Response {
    absl::optional<ResultType> result;
    absl::optional<mojom::ProviderError> error;
    absl::optional<std::string> error_message;
  };

  ResolveCall() = default;
  ~ResolveCall() = default;
  ResolveCall(const ResolveCall&) = delete;
  ResolveCall& operator=(const ResolveCall&) = delete;
  ResolveCall(ResolveCall&&) = default;
  ResolveCall& operator=(ResolveCall&&) = default;

  bool SetNoResult(const std::string& chain_id);
  bool SetResult(const std::string& chain_id, ResultType result);
  bool SetError(const std::string& chain_id,
                mojom::ProviderError error,
                std::string error_message);
  void AddCallback(CallbackType cb);

 private:
  Response* GetEffectiveResponse();
  bool MaybeResolveCallbacks();

  // chain_id -> response.
  base::flat_map<std::string, Response> responses_;
  std::vector<CallbackType> callbacks_;
};

template <class KeyType, class ResultType>
class ResolveCalls {
 public:
  using CallbackType = typename ResolveCall<ResultType>::CallbackType;

  ResolveCalls() = default;
  ~ResolveCalls() = default;

  std::vector<std::string> GetChains() const;

  bool HasCall(const KeyType& key);
  void AddCallback(const KeyType& key, CallbackType callback);
  void SetNoResult(const KeyType& key, const std::string& chain_id);
  void SetResult(const KeyType& key,
                 const std::string& chain_id,
                 ResultType result);
  void SetError(const KeyType& key,
                const std::string& chain_id,
                mojom::ProviderError error,
                std::string error_message);

 private:
  // domain -> call
  base::flat_map<KeyType, ResolveCall<ResultType>> calls_;
};

}  // namespace brave_wallet::unstoppable_domains

#endif  // BRAVE_COMPONENTS_BRAVE_WALLET_BROWSER_UNSTOPPABLE_DOMAINS_MULTICHAIN_CALLS_H_
