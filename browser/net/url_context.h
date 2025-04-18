/* Copyright (c) 2019 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#ifndef BRAVE_BROWSER_NET_URL_CONTEXT_H_
#define BRAVE_BROWSER_NET_URL_CONTEXT_H_

#include <memory>
#include <set>
#include <string>

#include "base/memory/raw_ptr.h"
#include "content/public/browser/frame_tree_node_id.h"
#include "net/base/network_anonymization_key.h"
#include "net/base/network_isolation_key.h"
#include "net/http/http_request_headers.h"
#include "net/http/http_response_headers.h"
#include "net/url_request/referrer_policy.h"
#include <optional>
#include "third_party/blink/public/mojom/loader/resource_load_info.mojom-shared.h"
#include "url/gurl.h"

class MisesRequestHandler;

namespace content {
class BrowserContext;
}

namespace network {
struct ResourceRequest;
}

namespace mises {
struct MisesRequestInfo;
using ResponseCallback = base::RepeatingCallback<void()>;
}  // namespace brave

namespace brave_rewards {
int OnBeforeURLRequest(const mises::ResponseCallback& next_callback,
                       std::shared_ptr<mises::MisesRequestInfo> ctx);
}  // namespace brave_rewards

namespace mises {

enum MisesNetworkDelegateEventType {
  kOnBeforeRequest,
  kOnBeforeStartTransaction,
  kOnHeadersReceived,
  kOnCanGetCookies,
  kOnCanSetCookies,
  kUnknownEventType
};

enum BlockedBy { kNotBlocked, kAdBlocked, kOtherBlocked };

struct MisesRequestInfo {
  MisesRequestInfo();
  MisesRequestInfo(const MisesRequestInfo&) = delete;
  MisesRequestInfo& operator=(const MisesRequestInfo&) = delete;

  // For tests, should not be used directly.
  explicit MisesRequestInfo(const GURL& url);

  ~MisesRequestInfo();
  std::string method;
  GURL request_url;
  GURL tab_origin;
  GURL tab_url;
  GURL initiator_url;

  bool internal_redirect = false;
  GURL redirect_source;

  GURL referrer;
  net::ReferrerPolicy referrer_policy =
      net::ReferrerPolicy::CLEAR_ON_TRANSITION_FROM_SECURE_TO_INSECURE;
  std::optional<GURL> new_referrer;

  std::optional<int> pending_error;
  std::string new_url_spec;
  std::string failover_url_spec;
  int provider_error;
  // TODO(iefremov): rename to shields_up.
  bool allow_brave_shields = true;
  bool allow_ads = false;
  // Whether or not Shields "aggressive" mode was enabled where the request was
  // initiated.
  bool aggressive_blocking = false;
  bool allow_http_upgradable_resource = false;
  bool allow_referrers = false;
  bool is_webtorrent_disabled = false;
  content::FrameTreeNodeId frame_tree_node_id;
  uint64_t request_identifier = 0;
  size_t next_url_request_index = 0;

  raw_ptr<content::BrowserContext> browser_context = nullptr;
  raw_ptr<net::HttpRequestHeaders> headers = nullptr;
  // The following two sets are populated by |OnBeforeStartTransactionCallback|.
  // |set_headers| contains headers which values were added or modified.
  std::set<std::string> set_headers;
  std::set<std::string> removed_headers;
  raw_ptr<const net::HttpResponseHeaders> original_response_headers = nullptr;
  raw_ptr<scoped_refptr<net::HttpResponseHeaders>> override_response_headers = nullptr;

  raw_ptr<GURL> allowed_unsafe_redirect_url = nullptr;
  MisesNetworkDelegateEventType event_type = kUnknownEventType;
  BlockedBy blocked_by = kNotBlocked;
  std::string mock_data_url;
  GURL ipfs_gateway_url;
  bool ipfs_auto_fallback = false;

  bool ShouldMockRequest() const {
    return blocked_by == kAdBlocked && !mock_data_url.empty();
  }

  net::NetworkAnonymizationKey network_anonymization_key =
      net::NetworkAnonymizationKey();
  net::NetworkIsolationKey network_isolation_key =
      net::NetworkIsolationKey();

  // Default to invalid type for resource_type, so delegate helpers
  // can properly detect that the info couldn't be obtained.
  // TODO(iefremov): Replace with something like |WebRequestResourceType| to
  // distinguish WebSockets.
  static constexpr blink::mojom::ResourceType kInvalidResourceType =
      static_cast<blink::mojom::ResourceType>(-1);
  blink::mojom::ResourceType resource_type = kInvalidResourceType;

  std::string upload_data;

  static std::shared_ptr<mises::MisesRequestInfo> MakeCTX(
      const network::ResourceRequest& request,
      int render_process_id,
      content::FrameTreeNodeId frame_tree_node_id,
      uint64_t request_identifier,
      content::BrowserContext* browser_context,
      std::shared_ptr<mises::MisesRequestInfo> old_ctx);

 private:
  // Please don't add any more friends here if it can be avoided.
  // We should also remove the one below.
  friend class ::MisesRequestHandler;

  raw_ptr<GURL> new_url = nullptr;
};

// ResponseListener
using OnBeforeURLRequestCallback =
    base::RepeatingCallback<int(const ResponseCallback& next_callback,
                                std::shared_ptr<MisesRequestInfo> ctx)>;
using OnBeforeStartTransactionCallback =
    base::RepeatingCallback<int(net::HttpRequestHeaders* headers,
                                const ResponseCallback& next_callback,
                                std::shared_ptr<MisesRequestInfo> ctx)>;
using OnHeadersReceivedCallback = base::RepeatingCallback<int(
    raw_ptr<const net::HttpResponseHeaders> original_response_headers,
    raw_ptr<scoped_refptr<net::HttpResponseHeaders>> override_response_headers,
    raw_ptr<GURL> allowed_unsafe_redirect_url,
    const ResponseCallback& next_callback,
    std::shared_ptr<MisesRequestInfo> ctx)>;

}  // namespace brave

#endif  // BRAVE_BROWSER_NET_URL_CONTEXT_H_
