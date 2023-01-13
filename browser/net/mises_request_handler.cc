/* Copyright (c) 2019 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "mises/browser/net/brave_request_handler.h"

#include <algorithm>
#include <utility>

#include "base/containers/contains.h"
#include "base/feature_list.h"
#include "mises/browser/net/decentralized_dns_network_delegate_helper.h"
#include "mises/components/constants/pref_names.h"
#include "mises/components/ipfs/buildflags/buildflags.h"
#include "chrome/browser/browser_process.h"
#include "content/public/browser/browser_task_traits.h"
#include "content/public/browser/browser_thread.h"
#include "content/public/common/url_constants.h"
#include "extensions/buildflags/buildflags.h"
#include "extensions/common/constants.h"
#include "net/base/net_errors.h"


#if BUILDFLAG(ENABLE_IPFS)
#include "mises/browser/net/ipfs_redirect_network_delegate_helper.h"
#include "mises/components/ipfs/features.h"
#endif

static bool IsInternalScheme(std::shared_ptr<mises::MisesRequestInfo> ctx) {
  DCHECK(ctx);
#if BUILDFLAG(ENABLE_EXTENSIONS)
  if (ctx->request_url.SchemeIs(extensions::kExtensionScheme))
    return true;
#endif
  return ctx->request_url.SchemeIs(content::kChromeUIScheme);
}

MisesRequestHandler::MisesRequestHandler() {
  DCHECK_CURRENTLY_ON(content::BrowserThread::UI);
  SetupCallbacks();
}

MisesRequestHandler::~MisesRequestHandler() = default;

void MisesRequestHandler::SetupCallbacks() {

  callback = base::BindRepeating(
      decentralized_dns::OnBeforeURLRequest_DecentralizedDnsPreRedirectWork);
  before_url_request_callbacks_.push_back(callback);

#if BUILDFLAG(ENABLE_IPFS)
  if (base::FeatureList::IsEnabled(ipfs::features::kIpfsFeature)) {
    callback = base::BindRepeating(ipfs::OnBeforeURLRequest_IPFSRedirectWork);
    before_url_request_callbacks_.push_back(callback);
  }
#endif

}

bool MisesRequestHandler::IsRequestIdentifierValid(
    uint64_t request_identifier) {
  return base::Contains(callbacks_, request_identifier);
}

int MisesRequestHandler::OnBeforeURLRequest(
    std::shared_ptr<mises::MisesRequestInfo> ctx,
    net::CompletionOnceCallback callback,
    GURL* new_url) {
  if (before_url_request_callbacks_.empty() || IsInternalScheme(ctx)) {
    return net::OK;
  }
  ctx->new_url = new_url;
  ctx->event_type = mises::kOnBeforeRequest;
  callbacks_[ctx->request_identifier] = std::move(callback);
  RunNextCallback(ctx);
  return net::ERR_IO_PENDING;
}

int MisesRequestHandler::OnBeforeStartTransaction(
    std::shared_ptr<mises::MisesRequestInfo> ctx,
    net::CompletionOnceCallback callback,
    net::HttpRequestHeaders* headers) {
  if (before_start_transaction_callbacks_.empty() || IsInternalScheme(ctx)) {
    return net::OK;
  }
  ctx->event_type = mises::kOnBeforeStartTransaction;
  ctx->headers = headers;
  callbacks_[ctx->request_identifier] = std::move(callback);
  RunNextCallback(ctx);
  return net::ERR_IO_PENDING;
}

int MisesRequestHandler::OnHeadersReceived(
    std::shared_ptr<mises::MisesRequestInfo> ctx,
    net::CompletionOnceCallback callback,
    const net::HttpResponseHeaders* original_response_headers,
    scoped_refptr<net::HttpResponseHeaders>* override_response_headers,
    GURL* allowed_unsafe_redirect_url) {
  if (!ctx->tab_origin.is_empty()) {
    brave::RemoveTrackableSecurityHeadersForThirdParty(
        ctx->request_url, url::Origin::Create(ctx->tab_origin),
        original_response_headers, override_response_headers);
  }

  if (headers_received_callbacks_.empty() &&
      !ctx->request_url.SchemeIs(content::kChromeUIScheme)) {
    // Extension scheme not excluded since brave_webtorrent needs it.
    return net::OK;
  }

  callbacks_[ctx->request_identifier] = std::move(callback);
  ctx->event_type = mises::kOnHeadersReceived;
  ctx->original_response_headers = original_response_headers;
  ctx->override_response_headers = override_response_headers;
  ctx->allowed_unsafe_redirect_url = allowed_unsafe_redirect_url;

  RunNextCallback(ctx);
  return net::ERR_IO_PENDING;
}

void MisesRequestHandler::OnURLRequestDestroyed(
    std::shared_ptr<mises::MisesRequestInfo> ctx) {
  if (base::Contains(callbacks_, ctx->request_identifier)) {
    callbacks_.erase(ctx->request_identifier);
  }
}

void MisesRequestHandler::RunCallbackForRequestIdentifier(
    uint64_t request_identifier,
    int rv) {
  std::map<uint64_t, net::CompletionOnceCallback>::iterator it =
      callbacks_.find(request_identifier);
  // We intentionally do the async call to maintain the proper flow
  // of URLLoader callbacks.
  content::GetUIThreadTaskRunner({})->PostTask(
      FROM_HERE, base::BindOnce(std::move(it->second), rv));
}

// TODO(iefremov): Merge all callback containers into one and run only one loop
// instead of many (issues/5574).
void MisesRequestHandler::RunNextCallback(
    std::shared_ptr<mises::MisesRequestInfo> ctx) {
  DCHECK_CURRENTLY_ON(content::BrowserThread::UI);

  if (!base::Contains(callbacks_, ctx->request_identifier)) {
    return;
  }

  if (ctx->pending_error.has_value()) {
    RunCallbackForRequestIdentifier(ctx->request_identifier,
                                    ctx->pending_error.value());
    return;
  }

  // Continue processing callbacks until we hit one that returns PENDING
  int rv = net::OK;

  if (ctx->event_type == mises::kOnBeforeRequest) {
    while (before_url_request_callbacks_.size() !=
           ctx->next_url_request_index) {
      brave::OnBeforeURLRequestCallback callback =
          before_url_request_callbacks_[ctx->next_url_request_index++];
      brave::ResponseCallback next_callback =
          base::BindRepeating(&MisesRequestHandler::RunNextCallback,
                              weak_factory_.GetWeakPtr(), ctx);
      rv = callback.Run(next_callback, ctx);
      if (rv == net::ERR_IO_PENDING) {
        return;
      }
      if (rv != net::OK) {
        break;
      }
    }
  } else if (ctx->event_type == mises::kOnBeforeStartTransaction) {
    while (before_start_transaction_callbacks_.size() !=
           ctx->next_url_request_index) {
      brave::OnBeforeStartTransactionCallback callback =
          before_start_transaction_callbacks_[ctx->next_url_request_index++];
      brave::ResponseCallback next_callback =
          base::BindRepeating(&MisesRequestHandler::RunNextCallback,
                              weak_factory_.GetWeakPtr(), ctx);
      rv = callback.Run(ctx->headers, next_callback, ctx);
      if (rv == net::ERR_IO_PENDING) {
        return;
      }
      if (rv != net::OK) {
        break;
      }
    }
  } else if (ctx->event_type == mises::kOnHeadersReceived) {
    while (headers_received_callbacks_.size() != ctx->next_url_request_index) {
      brave::OnHeadersReceivedCallback callback =
          headers_received_callbacks_[ctx->next_url_request_index++];
      brave::ResponseCallback next_callback =
          base::BindRepeating(&MisesRequestHandler::RunNextCallback,
                              weak_factory_.GetWeakPtr(), ctx);
      rv = callback.Run(ctx->original_response_headers,
                        ctx->override_response_headers,
                        ctx->allowed_unsafe_redirect_url, next_callback, ctx);
      if (rv == net::ERR_IO_PENDING) {
        return;
      }
      if (rv != net::OK) {
        break;
      }
    }
  }

  if (rv != net::OK) {
    RunCallbackForRequestIdentifier(ctx->request_identifier, rv);
    return;
  }

  if (ctx->event_type == mises::kOnBeforeRequest) {
    if (!ctx->new_url_spec.empty() &&
        (ctx->new_url_spec != ctx->request_url.spec()) &&
        IsRequestIdentifierValid(ctx->request_identifier)) {
      *ctx->new_url = GURL(ctx->new_url_spec);
    }
    if (ctx->blocked_by == mises::kAdBlocked ||
        ctx->blocked_by == mises::kOtherBlocked) {
      if (!ctx->ShouldMockRequest()) {
        RunCallbackForRequestIdentifier(ctx->request_identifier,
                                        net::ERR_BLOCKED_BY_CLIENT);
        return;
      }
    }
  }
  RunCallbackForRequestIdentifier(ctx->request_identifier, rv);
}
