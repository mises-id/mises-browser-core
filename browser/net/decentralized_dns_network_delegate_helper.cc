/* Copyright (c) 2021 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "mises/browser/net/decentralized_dns_network_delegate_helper.h"

#include <utility>
#include <vector>

#include "mises/browser/brave_wallet/json_rpc_service_factory.h"
#include "mises/components/brave_wallet/browser/json_rpc_service.h"
#include "mises/components/brave_wallet/common/brave_wallet.mojom.h"

#include "mises/components/decentralized_dns/core/constants.h"
#include "mises/components/decentralized_dns/core/utils.h"
#include "mises/components/ipfs/ipfs_utils.h"
#include "chrome/browser/browser_process.h"
#include "content/public/browser/browser_context.h"
#include "net/base/net_errors.h"

namespace decentralized_dns {

bool ShouldHandleUrl(const GURL& url) {
  bool should_handle_ud = IsUnstoppableDomainsTLD(url.host_piece()) &&
      IsUnstoppableDomainsResolveMethodEnabled(
          g_browser_process->local_state());
  bool should_handle_bit = IsBitTLD(url.host_piece());
  bool should_handle_ens = IsENSTLD(url.host_piece()) &&
      IsENSResolveMethodEnabled(g_browser_process->local_state());
  bool should_handle_sns = IsSnsTLD(url.host_piece());
  bool should_handle_fn = IsFreeNameTLD(url.host_piece());
  return should_handle_ud || should_handle_bit || should_handle_ens || should_handle_sns || should_handle_fn;
}

int OnBeforeURLRequest_DecentralizedDnsPreRedirectWork(
    const mises::ResponseCallback& next_callback,
    std::shared_ptr<mises::MisesRequestInfo> ctx) {
  DCHECK(!next_callback.is_null());

  if (!ctx->browser_context || ctx->browser_context->IsOffTheRecord() ||
      !g_browser_process) {
    return net::OK;
  }

  auto* json_rpc_service =
      brave_wallet::JsonRpcServiceFactory::GetServiceForContext(
          ctx->browser_context);
  if (!json_rpc_service)
    return net::OK;

  if (IsUnstoppableDomainsTLD(ctx->request_url.host_piece()) &&
      IsUnstoppableDomainsResolveMethodEnabled(
          g_browser_process->local_state())) {
    json_rpc_service->UnstoppableDomainsResolveDns(
        ctx->request_url.host(),
        base::BindOnce(&OnBeforeURLRequest_UnstoppableDomainsRedirectWork,
                       next_callback, ctx));

    return net::ERR_IO_PENDING;
  }

  if (IsBitTLD(ctx->request_url.host_piece())) {
    json_rpc_service->BitResolveDns(
        ctx->request_url.host(),
        base::BindOnce(&OnBeforeURLRequest_BitRedirectWork,
                       next_callback, ctx));

    return net::ERR_IO_PENDING;
  }

  if (IsENSTLD(ctx->request_url.host_piece()) &&
      IsENSResolveMethodEnabled(g_browser_process->local_state())) {
    json_rpc_service->EnsGetContentHash(
        ctx->request_url.host(),
        base::BindOnce(&OnBeforeURLRequest_EnsRedirectWork, next_callback,
                       ctx));

    return net::ERR_IO_PENDING;
  }

    if (IsSnsTLD(ctx->request_url.host_piece()) &&
      IsSnsResolveMethodEnabled(g_browser_process->local_state())) {
    json_rpc_service->SnsResolveHost(
        ctx->request_url.host(),
        base::BindOnce(&OnBeforeURLRequest_SnsRedirectWork, next_callback,
                       ctx));

    return net::ERR_IO_PENDING;
  }

  if (IsFreeNameTLD(ctx->request_url.host_piece())) {
    json_rpc_service->FreeNameResolveDns(
        ctx->request_url.host(),
        base::BindOnce(&OnBeforeURLRequest_FreeNameRedirectWork,
                       next_callback, ctx));

    return net::ERR_IO_PENDING;
  }

  return net::OK;
}

void OnBeforeURLRequest_EnsRedirectWork(
    const mises::ResponseCallback& next_callback,
    std::shared_ptr<mises::MisesRequestInfo> ctx,
    const std::vector<uint8_t>& content_hash,
    bool require_offchain_consent,
    brave_wallet::mojom::ProviderError error,
    const std::string& error_message) {
  DCHECK(!next_callback.is_null());

  if (error != brave_wallet::mojom::ProviderError::kSuccess) {
    ctx->provider_error = (int)error;
    if (error != brave_wallet::mojom::ProviderError::kInternalError) {
      ctx->failover_url_spec = "https://app.ens.domains/name/" + ctx->request_url.host();
    }
    next_callback.Run();
    return;
  }

  if (require_offchain_consent) {
    ctx->pending_error = net::ERR_ENS_OFFCHAIN_LOOKUP_NOT_SELECTED;
    next_callback.Run();
    return;
  }

  GURL ipfs_uri = ipfs::ContentHashToCIDv1URL(content_hash);
  if (ipfs_uri.is_valid()) {
    ctx->new_url_spec = ipfs_uri.spec() + ctx->request_url.PathForRequest();
  }

  next_callback.Run();
}

void OnBeforeURLRequest_SnsRedirectWork(
    const mises::ResponseCallback& next_callback,
    std::shared_ptr<mises::MisesRequestInfo> ctx,
    const std::optional<GURL>& url,
    brave_wallet::mojom::SolanaProviderError error,
    const std::string& error_message) {
  if (error == brave_wallet::mojom::SolanaProviderError::kSuccess && url &&
      url->is_valid()) {
    ctx->new_url_spec = url->spec();
  }

  if (!next_callback.is_null()) {
    next_callback.Run();
  }
}

void OnBeforeURLRequest_UnstoppableDomainsRedirectWork(
    const mises::ResponseCallback& next_callback,
    std::shared_ptr<mises::MisesRequestInfo> ctx,
    const std::optional<GURL>& url,
    brave_wallet::mojom::ProviderError error,
    const std::string& error_message) {
  if (error == brave_wallet::mojom::ProviderError::kSuccess && url &&
      url->is_valid()) {
    ctx->new_url_spec = url->spec() + ctx->request_url.PathForRequest();
  }

  if (!next_callback.is_null())
    next_callback.Run();
}


void OnBeforeURLRequest_BitRedirectWork(
    const mises::ResponseCallback& next_callback,
    std::shared_ptr<mises::MisesRequestInfo> ctx,
    const GURL& url,
    brave_wallet::mojom::ProviderError error,
    const std::string& error_message) {
  if (error == brave_wallet::mojom::ProviderError::kSuccess && url.is_valid()) {
    ctx->new_url_spec = url.spec() + ctx->request_url.PathForRequest();
  } else {
    ctx->provider_error = (int)error;
    ctx->failover_url_spec = "https://" + ctx->request_url.host() + ".cc";
  }

  if (!next_callback.is_null())
    next_callback.Run();
}


void OnBeforeURLRequest_FreeNameRedirectWork(
    const mises::ResponseCallback& next_callback,
    std::shared_ptr<mises::MisesRequestInfo> ctx,
    const GURL& url,
    brave_wallet::mojom::ProviderError error,
    const std::string& error_message) {
  if (error == brave_wallet::mojom::ProviderError::kSuccess && url.is_valid()) {
    if (base::StartsWith(url.spec(), "http")) {
      ctx->failover_url_spec = url.spec() + ctx->request_url.PathForRequest();
    } else {
      ctx->new_url_spec = url.spec() + ctx->request_url.PathForRequest();
    }
    
  } else {
    ctx->provider_error = (int)error;
    ctx->failover_url_spec = "https://www.freename.io/results?search=\"" + ctx->request_url.host() + "\"";
  }

  if (!next_callback.is_null())
    next_callback.Run();
}

}  // namespace decentralized_dns
