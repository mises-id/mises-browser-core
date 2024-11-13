/* Copyright (c) 2021 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#ifndef MISES_NET_DECENTRALIZED_DNS_UTILS_H_
#define MISES_NET_DECENTRALIZED_DNS_UTILS_H_

#include <string_view>
#include "net/base/net_export.h"
namespace decentralized_dns {


NET_EXPORT bool IsIpfsLocalTLD(const std::string_view& host, size_t* suffix_length = nullptr);

NET_EXPORT bool IsUnstoppableDomainsTLD(const std::string_view& host, size_t* suffix_length = nullptr);

NET_EXPORT bool IsBitTLD(const std::string_view& host, size_t* suffix_length = nullptr);
NET_EXPORT bool IsFreeNameTLD(const std::string_view& host, size_t* suffix_length = nullptr);

NET_EXPORT bool IsENSTLD(const std::string_view& host, size_t* suffix_length = nullptr);
NET_EXPORT bool IsSnsTLD(const std::string_view& host, size_t* suffix_length = nullptr);

NET_EXPORT bool IsDNSForEthDomain(const std::string_view& host, size_t* suffix_length = nullptr);

}  // namespace decentralized_dns

#endif  // BRAVE_COMPONENTS_DECENTRALIZED_DNS_CORE_UTILS_H_
