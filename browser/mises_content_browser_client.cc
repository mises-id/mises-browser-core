/* Copyright (c) 2019 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "mises/browser/mises_content_browser_client.h"

#include <algorithm>
#include <string>
#include <utility>
#include <vector>

#include "base/bind.h"
#include "base/json/json_reader.h"
#include "base/strings/strcat.h"
#include "base/system/sys_info.h"
#include "mises/browser/mises_browser_process.h"
#include "mises/browser/profiles/profile_util.h"
#include "mises/browser/net/mises_proxying_url_loader_factory.h"
#include "mises/browser/net/mises_proxying_web_socket.h"
#include "mises/components/constants/pref_names.h"
#include "mises/components/constants/webui_url_constants.h"
#include "mises/components/decentralized_dns/content/decentralized_dns_navigation_throttle.h"
#include "mises/components/ipfs/buildflags/buildflags.h"
#include "mises/grit/mises_generated_resources.h"
#include "build/build_config.h"
#include "chrome/browser/browser_process.h"
#include "chrome/browser/chrome_browser_interface_binders.h"
#include "chrome/browser/chrome_content_browser_client.h"
#include "chrome/browser/content_settings/host_content_settings_map_factory.h"
#include "chrome/browser/profiles/profile.h"
#include "chrome/browser/profiles/profile_io_data.h"
#include "chrome/browser/search_engines/template_url_service_factory.h"
#include "chrome/common/url_constants.h"
#include "chrome/grit/chromium_strings.h"
#include "components/content_settings/browser/page_specific_content_settings.h"
#include "components/content_settings/core/browser/host_content_settings_map.h"
#include "components/prefs/pref_service.h"
#include "components/services/heap_profiling/public/mojom/heap_profiling_client.mojom.h"
#include "components/user_prefs/user_prefs.h"
#include "components/version_info/version_info.h"
#include "content/browser/renderer_host/render_frame_host_impl.h"
#include "content/browser/service_worker/service_worker_host.h"
#include "content/public/browser/browser_context.h"
#include "content/public/browser/browser_task_traits.h"
#include "content/public/browser/browser_thread.h"
#include "content/public/browser/browser_url_handler.h"
#include "content/public/browser/navigation_handle.h"
#include "content/public/browser/storage_partition.h"
#include "content/public/browser/weak_document_ptr.h"
#include "content/public/browser/web_ui_browser_interface_broker_registry.h"
#include "content/public/common/content_client.h"
#include "content/public/common/content_switches.h"
#include "content/public/common/url_constants.h"
#include "extensions/buildflags/buildflags.h"
#include "mojo/public/cpp/bindings/pending_receiver.h"
#include "mojo/public/cpp/bindings/self_owned_receiver.h"
#include "net/base/registry_controlled_domains/registry_controlled_domain.h"
#include "net/cookies/site_for_cookies.h"
#include "third_party/blink/public/common/associated_interfaces/associated_interface_registry.h"
#include "third_party/blink/public/common/loader/url_loader_throttle.h"
#include "third_party/blink/public/mojom/webpreferences/web_preferences.mojom.h"
#include "third_party/widevine/cdm/buildflags.h"
#include "ui/base/l10n/l10n_util.h"

using blink::web_pref::WebPreferences;
using content::BrowserThread;
using content::ContentBrowserClient;
using content::RenderFrameHost;
using content::WebContents;

#if BUILDFLAG(ENABLE_EXTENSIONS)
#include "chrome/browser/extensions/chrome_content_browser_client_extensions_part.h"
#include "extensions/browser/extension_registry.h"
using extensions::ChromeContentBrowserClientExtensionsPart;
#endif


#if BUILDFLAG(ENABLE_IPFS)
#include "mises/browser/ipfs/content_browser_client_helper.h"
#include "mises/browser/ipfs/ipfs_service_factory.h"
#include "mises/browser/ipfs/ipfs_subframe_navigation_throttle.h"
#include "mises/components/ipfs/ipfs_constants.h"
#include "mises/components/ipfs/ipfs_navigation_throttle.h"
#endif


namespace {

bool HandleURLReverseOverrideRewrite(GURL* url,
                                     content::BrowserContext* browser_context) {
  if (MisesContentBrowserClient::HandleURLOverrideRewrite(url, browser_context))
    return true;

  return false;
}

bool HandleURLRewrite(GURL* url, content::BrowserContext* browser_context) {
  if (MisesContentBrowserClient::HandleURLOverrideRewrite(url, browser_context))
    return true;

  return false;
}

}  // namespace

MisesContentBrowserClient::MisesContentBrowserClient() = default;

MisesContentBrowserClient::~MisesContentBrowserClient() = default;

std::unique_ptr<content::BrowserMainParts>
MisesContentBrowserClient::CreateBrowserMainParts(bool is_integration_test) {
  std::unique_ptr<content::BrowserMainParts> main_parts =
      ChromeContentBrowserClient::CreateBrowserMainParts(is_integration_test);
  // ChromeBrowserMainParts* chrome_main_parts =
  //     static_cast<ChromeBrowserMainParts*>(main_parts.get());
  // chrome_main_parts->AddParts(std::make_unique<MisesBrowserMainExtraParts>());
  return main_parts;
}

void MisesContentBrowserClient::BrowserURLHandlerCreated(
    content::BrowserURLHandler* handler) {
#if BUILDFLAG(ENABLE_IPFS)
  handler->AddHandlerPair(&ipfs::HandleIPFSURLRewrite,
                          &ipfs::HandleIPFSURLReverseRewrite);
#endif
  handler->AddHandlerPair(&HandleURLRewrite, &HandleURLReverseOverrideRewrite);
  ChromeContentBrowserClient::BrowserURLHandlerCreated(handler);
}



std::vector<std::unique_ptr<content::NavigationThrottle>>
MisesContentBrowserClient::CreateThrottlesForNavigation(
    content::NavigationHandle* handle) {
  std::vector<std::unique_ptr<content::NavigationThrottle>> throttles =
      ChromeContentBrowserClient::CreateThrottlesForNavigation(handle);




#if BUILDFLAG(ENABLE_IPFS)
  throttles.insert(
      throttles.begin(),
      ipfs::IpfsSubframeNavigationThrottle::CreateThrottleFor(handle));

  content::BrowserContext* context =
      handle->GetWebContents()->GetBrowserContext();
  std::unique_ptr<content::NavigationThrottle> ipfs_navigation_throttle =
      ipfs::IpfsNavigationThrottle::MaybeCreateThrottleFor(
          handle, ipfs::IpfsServiceFactory::GetForContext(context),
          user_prefs::UserPrefs::Get(context),
          g_browser_process->GetApplicationLocale());
  if (ipfs_navigation_throttle)
    throttles.push_back(std::move(ipfs_navigation_throttle));

#endif

  std::unique_ptr<content::NavigationThrottle>
      decentralized_dns_navigation_throttle =
          decentralized_dns::DecentralizedDnsNavigationThrottle::
              MaybeCreateThrottleFor(handle, g_browser_process->local_state(),
                                     g_browser_process->GetApplicationLocale());
  if (decentralized_dns_navigation_throttle)
    throttles.push_back(std::move(decentralized_dns_navigation_throttle));

  //Web3sitesSafeNavigationThrottle
 /*  std::unique_ptr<content::NavigationThrottle> web3sites_safe_navigation_throttle =
      Web3sitesSafeNavigationThrottle::MaybeCreateNavigationThrottle(handle);
  if (web3sites_safe_navigation_throttle){
      throttles.push_back(std::move(web3sites_safe_navigation_throttle));
  } */

  return throttles;
}


// [static]
bool MisesContentBrowserClient::HandleURLOverrideRewrite(
    GURL* url,
    content::BrowserContext* browser_context) {
  return false;
}


bool MisesContentBrowserClient::WillCreateURLLoaderFactory(
    content::BrowserContext* browser_context,
    content::RenderFrameHost* frame,
    int render_process_id,
    URLLoaderFactoryType type,
    const url::Origin& request_initiator,
    absl::optional<int64_t> navigation_id,
    ukm::SourceIdObj ukm_source_id,
    mojo::PendingReceiver<network::mojom::URLLoaderFactory>* factory_receiver,
    mojo::PendingRemote<network::mojom::TrustedURLLoaderHeaderClient>*
        header_client,
    bool* bypass_redirect_checks,
    bool* disable_secure_dns,
    network::mojom::URLLoaderFactoryOverridePtr* factory_override) {
  bool use_proxy = false;
  // TODO(iefremov): Skip proxying for certain requests?
  use_proxy = MisesProxyingURLLoaderFactory::MaybeProxyRequest(
      browser_context, frame,
      type == URLLoaderFactoryType::kNavigation ? -1 : render_process_id,
      factory_receiver);

  use_proxy |= ChromeContentBrowserClient::WillCreateURLLoaderFactory(
      browser_context, frame, render_process_id, type, request_initiator,
      std::move(navigation_id), ukm_source_id, factory_receiver, header_client,
      bypass_redirect_checks, disable_secure_dns, factory_override);

  return use_proxy;
}

bool MisesContentBrowserClient::WillInterceptWebSocket(
    content::RenderFrameHost* frame) {
  return (frame != nullptr);
}

void MisesContentBrowserClient::CreateWebSocket(
    content::RenderFrameHost* frame,
    content::ContentBrowserClient::WebSocketFactory factory,
    const GURL& url,
    const net::SiteForCookies& site_for_cookies,
    const absl::optional<std::string>& user_agent,
    mojo::PendingRemote<network::mojom::WebSocketHandshakeClient>
        handshake_client) {
  auto* proxy = MisesProxyingWebSocket::ProxyWebSocket(
      frame, std::move(factory), url, site_for_cookies, user_agent,
      std::move(handshake_client));

  if (ChromeContentBrowserClient::WillInterceptWebSocket(frame)) {
    ChromeContentBrowserClient::CreateWebSocket(
        frame, proxy->web_socket_factory(), url, site_for_cookies, user_agent,
        proxy->handshake_client().Unbind());
  } else {
    proxy->Start();
  }
}
