/* Copyright (c) 2019 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "mises/browser/net/url_context.h"

#include <memory>
#include <string>

#include "mises/components/ipfs/buildflags/buildflags.h"
#include "chrome/browser/content_settings/host_content_settings_map_factory.h"
#include "chrome/browser/profiles/profile.h"
#include "content/public/browser/web_contents.h"
#include "content/public/browser/browser_thread.h"
#include "content/public/browser/render_frame_host.h"
#include "net/base/isolation_info.h"
#include "services/network/public/cpp/resource_request.h"
#include "url/origin.h"

#if BUILDFLAG(ENABLE_IPFS)
#include "mises/components/ipfs/ipfs_constants.h"
#include "mises/components/ipfs/ipfs_utils.h"
#include "mises/components/ipfs/pref_names.h"
#include "chrome/common/channel_info.h"
#include "components/prefs/pref_service.h"
#include "components/user_prefs/user_prefs.h"
#endif

namespace mises {

namespace {

std::string GetUploadData(const network::ResourceRequest& request) {
  std::string upload_data;
  if (!request.request_body) {
    return {};
  }
  const auto* elements = request.request_body->elements();
  for (const network::DataElement& element : *elements) {
    if (element.type() == network::mojom::DataElementDataView::Tag::kBytes) {
      const auto& bytes = element.As<network::DataElementBytes>().bytes();
      upload_data.append(bytes.begin(), bytes.end());
    }
  }

  return upload_data;
}

}  // namespace

MisesRequestInfo::MisesRequestInfo() = default;

MisesRequestInfo::MisesRequestInfo(const GURL& url) : request_url(url) {}

MisesRequestInfo::~MisesRequestInfo() = default;

// static
std::shared_ptr<mises::MisesRequestInfo> MisesRequestInfo::MakeCTX(
    const network::ResourceRequest& request,
    int render_process_id,
    content::FrameTreeNodeId frame_tree_node_id,
    uint64_t request_identifier,
    content::BrowserContext* browser_context,
    std::shared_ptr<mises::MisesRequestInfo> old_ctx) {
  DCHECK_CURRENTLY_ON(content::BrowserThread::UI);

  auto ctx = std::make_shared<mises::MisesRequestInfo>();
  ctx->request_identifier = request_identifier;
  ctx->method = request.method;
  ctx->request_url = request.url;
  // TODO(iefremov): Replace GURL with Origin
  ctx->initiator_url =
      request.request_initiator.value_or(url::Origin()).GetURL();

  ctx->referrer = request.referrer;
  ctx->referrer_policy = request.referrer_policy;

  ctx->resource_type =
      static_cast<blink::mojom::ResourceType>(request.resource_type);

  ctx->is_webtorrent_disabled = true;

  ctx->frame_tree_node_id = frame_tree_node_id;

  // TODO(iefremov): remove tab_url. Change tab_origin from GURL to Origin.
  // ctx->tab_url = request.top_frame_origin;
  if (request.trusted_params) {
    // TODO(iefremov): Turns out it provides us a not expected value for
    // cross-site top-level navigations. Fortunately for now it is not a problem
    // for shields functionality. We should reconsider this machinery, also
    // given that this is always empty for subresources.
    ctx->network_isolation_key =
        request.trusted_params->isolation_info.network_isolation_key();
    ctx->tab_origin = request.trusted_params->isolation_info.top_frame_origin()
                          .value_or(url::Origin())
                          .GetURL();
  }
  // TODO(iefremov): We still need this for WebSockets, currently
  // |AddChannelRequest| provides only old-fashioned |site_for_cookies|.
  // (See |MisesProxyingWebSocket|).
  if (ctx->tab_origin.is_empty()) {
    content::WebContents* contents =
        content::WebContents::FromFrameTreeNodeId(ctx->frame_tree_node_id);
    if (contents) {
      ctx->tab_origin =
          url::Origin::Create(contents->GetLastCommittedURL()).GetURL();
    }
  }

  if (old_ctx) {
    ctx->internal_redirect = old_ctx->internal_redirect;
    ctx->redirect_source = old_ctx->redirect_source;
  }

#if BUILDFLAG(ENABLE_IPFS)
  auto* prefs = user_prefs::UserPrefs::Get(browser_context);
  ctx->ipfs_gateway_url =
      ipfs::GetConfiguredBaseGateway(prefs, chrome::GetChannel());
  ctx->ipfs_auto_fallback = prefs->GetBoolean(kIPFSAutoRedirectGateway);

  // ipfs:// navigations have no tab origin set, but we want it to be the tab
  // origin of the gateway so that ad-block in particular won't give up early.
  if (ipfs::IsLocalGatewayConfigured(prefs) && ctx->tab_origin.is_empty() &&
      ipfs::IsLocalGatewayURL(ctx->initiator_url)) {
    ctx->tab_url = ctx->initiator_url;
    ctx->tab_origin = url::Origin::Create(ctx->initiator_url).GetURL();
  }
#endif

  //Profile* profile = Profile::FromBrowserContext(browser_context);
  //auto* map = HostContentSettingsMapFactory::GetForProfile(profile);
  ctx->allow_brave_shields = false;
  ctx->allow_ads = true;
  // Currently, "aggressive" mode is registered as a cosmetic filtering control
  // type, even though it can also affect network blocking.
  ctx->aggressive_blocking = false;
  ctx->allow_http_upgradable_resource = true;

  // HACK: after we fix multiple creations of MisesRequestInfo we should
  // use only tab_origin. Since we recreate MisesRequestInfo during consequent
  // stages of navigation, |tab_origin| changes and so does |allow_referrers|
  // flag, which is not what we want for determining referrers.
  ctx->allow_referrers =true;
  ctx->upload_data = GetUploadData(request);

  ctx->browser_context = browser_context;

  // TODO(fmarier): remove this once the hacky code in
  // brave_proxying_url_loader_factory.cc is refactored. See
  // MisesProxyingURLLoaderFactory::InProgressRequest::UpdateRequestInfo().
  if (old_ctx) {
    ctx->internal_redirect = old_ctx->internal_redirect;
    ctx->redirect_source = old_ctx->redirect_source;
  }

  return ctx;
}

}  // namespace brave
