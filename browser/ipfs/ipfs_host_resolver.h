/* Copyright (c) 2021 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#ifndef BRAVE_BROWSER_IPFS_IPFS_HOST_RESOLVER_H_
#define BRAVE_BROWSER_IPFS_IPFS_HOST_RESOLVER_H_

#include <string>
#include <utility>
#include <vector>

#include "base/memory/raw_ptr.h"
#include "base/functional/callback_forward.h"
#include "mojo/public/cpp/bindings/receiver.h"
#include "net/base/host_port_pair.h"
#include "net/base/network_anonymization_key.h"
#include "net/base/network_isolation_key.h"
#include "net/dns/public/dns_query_type.h"
#include "services/network/public/cpp/resolve_host_client_base.h"
#include "services/network/public/mojom/host_resolver.mojom.h"
#include "services/network/public/mojom/network_context.mojom.h"

namespace ipfs {

// Resolves DNS TXT record for hosts. If prefix passed then
// automatically adds it to the host.
class IPFSHostResolver : public network::ResolveHostClientBase {
 public:
  explicit IPFSHostResolver(network::mojom::NetworkContext* network_context,
                            const std::string& prefix = std::string());
  ~IPFSHostResolver() override;

  using HostTextResultsCallback =
      base::OnceCallback<void(const std::string& host,
                              const std::optional<std::string>& dnslink)>;

  virtual void Resolve(const net::HostPortPair& host,
                       const net::NetworkAnonymizationKey& anonymization_key,
                       net::DnsQueryType dns_query_type,
                       HostTextResultsCallback callback);

  std::string host() const { return resolving_host_; }
  std::optional<std::string> dnslink() const { return dnslink_; }

 private:
  // network::mojom::ResolveHostClient implementation:
  void OnComplete(int result,
                  const net::ResolveErrorInfo& resolve_error_info,
                  const std::optional<net::AddressList>& resolved_addresses,
                  const std::optional<net::HostResolverEndpointResults>&
                     endpoint_results_with_metadata
                   ) override;
  void OnTextResults(const std::vector<std::string>& text_results) override;

  std::string resolving_host_;
  std::string prefix_;
  std::optional<std::string> dnslink_;

  raw_ptr<network::mojom::NetworkContext> network_context_ = nullptr;
  HostTextResultsCallback resolved_callback_;

  mojo::Receiver<network::mojom::ResolveHostClient> receiver_{this};
};

}  // namespace ipfs

#endif  // BRAVE_BROWSER_IPFS_IPFS_HOST_RESOLVER_H_
