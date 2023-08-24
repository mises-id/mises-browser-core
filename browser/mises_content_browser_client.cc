/* Copyright (c) 2019 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "mises/browser/mises_content_browser_client.h"

#include <algorithm>
#include <string>
#include <utility>
#include <vector>

#include "base/functional/bind.h"
#include "base/json/json_reader.h"
#include "base/strings/strcat.h"
#include "base/system/sys_info.h"
#include "mises/browser/mises_browser_process.h"
#include "mises/browser/profiles/profile_util.h"
#include "mises/browser/net/mises_proxying_url_loader_factory.h"
#include "mises/browser/net/mises_proxying_web_socket.h"

#include "mises/browser/brave_wallet/brave_wallet_context_utils.h"
#include "mises/browser/brave_wallet/brave_wallet_provider_delegate_impl.h"
#include "mises/browser/brave_wallet/brave_wallet_service_factory.h"
#include "mises/browser/brave_wallet/json_rpc_service_factory.h"
#include "mises/browser/brave_wallet/keyring_service_factory.h"
#include "mises/browser/brave_wallet/tx_service_factory.h"

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
#include "content/public/browser/web_ui_controller_interface_binder.h"
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
#include "chrome/common/pref_names.h"

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


#include "mises/components/brave_wallet/browser/brave_wallet_p3a_private.h"
#include "mises/components/brave_wallet/browser/brave_wallet_service.h"
#include "mises/components/brave_wallet/browser/brave_wallet_utils.h"
#include "mises/components/brave_wallet/browser/ethereum_provider_impl.h"
#include "mises/components/brave_wallet/browser/solana_provider_impl.h"
#include "mises/components/brave_wallet/common/brave_wallet.mojom.h"

#if !BUILDFLAG(IS_ANDROID)
#include "mises/browser/ui/webui/brave_wallet/wallet_page_ui.h"
#include "mises/browser/ui/webui/brave_wallet/wallet_panel_ui.h"
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


void MaybeBindWalletP3A(
    content::RenderFrameHost* const frame_host,
    mojo::PendingReceiver<brave_wallet::mojom::BraveWalletP3A> receiver) {
  auto* context = frame_host->GetBrowserContext();
  if (brave_wallet::IsAllowedForContext(frame_host->GetBrowserContext())) {
    brave_wallet::BraveWalletService* wallet_service =
        brave_wallet::BraveWalletServiceFactory::GetServiceForContext(context);
    DCHECK(wallet_service);
    wallet_service->GetBraveWalletP3A()->Bind(std::move(receiver));
  } else {
    // Dummy API to avoid reporting P3A for OTR contexts
    mojo::MakeSelfOwnedReceiver(
        std::make_unique<brave_wallet::BraveWalletP3APrivate>(),
        std::move(receiver));
  }
}

void MaybeBindEthereumProvider(
    content::RenderFrameHost* const frame_host,
    mojo::PendingReceiver<brave_wallet::mojom::EthereumProvider> receiver) {
  auto* json_rpc_service =
      brave_wallet::JsonRpcServiceFactory::GetServiceForContext(
          frame_host->GetBrowserContext());

  if (!json_rpc_service) {
    return;
  }

  auto* tx_service = brave_wallet::TxServiceFactory::GetServiceForContext(
      frame_host->GetBrowserContext());
  if (!tx_service) {
    return;
  }

  auto* keyring_service =
      brave_wallet::KeyringServiceFactory::GetServiceForContext(
          frame_host->GetBrowserContext());
  if (!keyring_service) {
    return;
  }

  auto* brave_wallet_service =
      brave_wallet::BraveWalletServiceFactory::GetServiceForContext(
          frame_host->GetBrowserContext());
  if (!brave_wallet_service) {
    return;
  }

  content::WebContents* web_contents =
      content::WebContents::FromRenderFrameHost(frame_host);
  mojo::MakeSelfOwnedReceiver(
      std::make_unique<brave_wallet::EthereumProviderImpl>(
          HostContentSettingsMapFactory::GetForProfile(
              Profile::FromBrowserContext(frame_host->GetBrowserContext())),
          json_rpc_service, tx_service, keyring_service, brave_wallet_service,
          std::make_unique<brave_wallet::BraveWalletProviderDelegateImpl>(
              web_contents, frame_host),
          user_prefs::UserPrefs::Get(web_contents->GetBrowserContext())),
      std::move(receiver));
}

void MaybeBindSolanaProvider(
    content::RenderFrameHost* const frame_host,
    mojo::PendingReceiver<brave_wallet::mojom::SolanaProvider> receiver) {
  auto* keyring_service =
      brave_wallet::KeyringServiceFactory::GetServiceForContext(
          frame_host->GetBrowserContext());
  if (!keyring_service) {
    return;
  }

  auto* brave_wallet_service =
      brave_wallet::BraveWalletServiceFactory::GetServiceForContext(
          frame_host->GetBrowserContext());
  if (!brave_wallet_service) {
    return;
  }

  auto* tx_service = brave_wallet::TxServiceFactory::GetServiceForContext(
      frame_host->GetBrowserContext());
  if (!tx_service) {
    return;
  }

  content::WebContents* web_contents =
      content::WebContents::FromRenderFrameHost(frame_host);
  mojo::MakeSelfOwnedReceiver(
      std::make_unique<brave_wallet::SolanaProviderImpl>(
          keyring_service, brave_wallet_service, tx_service,
          std::make_unique<brave_wallet::BraveWalletProviderDelegateImpl>(
              web_contents, frame_host)),
      std::move(receiver));
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



void MisesContentBrowserClient::RegisterBrowserInterfaceBindersForFrame(
    content::RenderFrameHost* render_frame_host,
    mojo::BinderMapWithContext<content::RenderFrameHost*>* map) {
  ChromeContentBrowserClient::RegisterBrowserInterfaceBindersForFrame(
      render_frame_host, map);

  map->Add<brave_wallet::mojom::BraveWalletP3A>(
      base::BindRepeating(&MaybeBindWalletP3A));
  if (brave_wallet::IsAllowedForContext(
          render_frame_host->GetBrowserContext())) {
    if (brave_wallet::IsNativeWalletEnabled()) {
      map->Add<brave_wallet::mojom::EthereumProvider>(
          base::BindRepeating(&MaybeBindEthereumProvider));
      map->Add<brave_wallet::mojom::SolanaProvider>(
          base::BindRepeating(&MaybeBindSolanaProvider));
    }
  }
#if BUILDFLAG(IS_ANDROID)
  content::RegisterWebUIControllerInterfaceBinder<
      brave_wallet::mojom::PageHandlerFactory, SwapPageUI>(map);
#endif

#if !BUILDFLAG(IS_ANDROID)
  content::RegisterWebUIControllerInterfaceBinder<
      brave_wallet::mojom::PageHandlerFactory, WalletPageUI>(map);
  content::RegisterWebUIControllerInterfaceBinder<
      brave_wallet::mojom::PanelHandlerFactory, WalletPanelUI>(map);
#endif

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

void MisesContentBrowserClient::OverrideWebkitPrefs(
    content::WebContents* web_contents,
    blink::web_pref::WebPreferences* web_prefs)  {
  ChromeContentBrowserClient::OverrideWebkitPrefs(web_contents, web_prefs);
  Profile* profile =
      Profile::FromBrowserContext(web_contents->GetBrowserContext());
  PrefService* prefs = profile->GetPrefs();
  if (prefs->GetBoolean(prefs::kWebKitForceDarkModeEnabled)) {
    web_prefs->force_night_mode = 1;
  } else {
    web_prefs->force_night_mode = 0;
  }
  LOG(INFO) << "MisesContentBrowserClient::OverrideWebkitPrefs " << web_contents << ", force_night_mode=" << web_prefs->force_night_mode;
                       
}
