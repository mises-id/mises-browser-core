/* Copyright (c) 2019 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "mises/browser/ui/webui/mises_web_ui_controller_factory.h"

#include <memory>

#include "base/feature_list.h"
#include "base/memory/ptr_util.h"
#include "mises/components/constants/pref_names.h"
#include "mises/components/constants/webui_url_constants.h"
#include "mises/components/ipfs/buildflags/buildflags.h"
#include "build/build_config.h"
#include "chrome/browser/profiles/profile.h"
#include "chrome/common/url_constants.h"
#include "components/prefs/pref_service.h"
#include "content/public/browser/web_contents.h"
#include "url/gurl.h"


#if !BUILDFLAG(IS_ANDROID)
#include "mises/browser/brave_wallet/brave_wallet_context_utils.h"
#include "mises/browser/ui/webui/mises_settings_ui.h"
#include "mises/browser/ui/webui/brave_wallet/wallet_page_ui.h"
#include "mises/browser/ui/webui/brave_wallet/wallet_panel_ui.h"
#include "mises/components/brave_wallet/browser/brave_wallet_utils.h"
#include "mises/components/brave_wallet/common/brave_wallet.mojom.h"
#include "mises/components/brave_wallet/common/common_util.h"
#endif



#if BUILDFLAG(ENABLE_IPFS)
#include "mises/browser/ipfs/ipfs_service_factory.h"
#include "mises/browser/ui/webui/ipfs_ui.h"
#include "mises/components/ipfs/features.h"
#include "mises/components/ipfs/ipfs_utils.h"
#endif

using content::WebUI;
using content::WebUIController;

namespace {

// A function for creating a new WebUI. The caller owns the return value, which
// may be NULL (for example, if the URL refers to an non-existent extension).
typedef WebUIController* (*WebUIFactoryFunction)(WebUI* web_ui,
                                                 const GURL& url);

WebUIController* NewWebUI(WebUI* web_ui, const GURL& url) {
  auto host = url.host_piece();
  Profile* profile = Profile::FromBrowserContext(
      web_ui->GetWebContents()->GetBrowserContext());
#if BUILDFLAG(ENABLE_IPFS)
  if (host == kIPFSWebUIHost &&
             ipfs::IpfsServiceFactory::IsIpfsEnabled(profile)) {
    return new IPFSUI(web_ui, url.host());
  }
#endif
#if !BUILDFLAG(IS_ANDROID)
  if (host == kWalletPageHost &&
             // We don't want to check for supported profile type here because
             // we want private windows to redirect to the regular profile.
             // Guest session will just show an error page.
             brave_wallet::IsAllowed(profile->GetPrefs())) {
    if (brave_wallet::IsNativeWalletEnabled()) {
      // auto default_wallet =
      //     brave_wallet::GetDefaultEthereumWallet(profile->GetPrefs());
      // if (default_wallet == brave_wallet::mojom::DefaultWallet::CryptoWallets)
      //   return new EthereumRemoteClientUI(web_ui, url.host());
      return new WalletPageUI(web_ui);
    }
  }
  if (host == kWalletPanelHost &&
             brave_wallet::IsAllowedForContext(profile)) {
    return new WalletPanelUI(web_ui);
  }
#endif  // BUILDFLAG(OS_ANDROID)
#if !BUILDFLAG(IS_ANDROID)
  if (host == chrome::kChromeUISettingsHost) {
    return new MisesSettingsUI(web_ui, url.host());
  } 
#endif

  return nullptr;
}

// Returns a function that can be used to create the right type of WebUI for a
// tab, based on its URL. Returns NULL if the URL doesn't have WebUI associated
// with it.
WebUIFactoryFunction GetWebUIFactoryFunction(WebUI* web_ui, const GURL& url) {
  if (
#if BUILDFLAG(ENABLE_IPFS)
      (url.host_piece() == kIPFSWebUIHost &&
       base::FeatureList::IsEnabled(ipfs::features::kIpfsFeature)) ||
#endif  // BUILDFLAG(ENABLE_IPFS)
#if !BUILDFLAG(IS_ANDROID)
      url.host_piece() == kWalletPanelHost ||
      url.host_piece() == kWalletPageHost ||
#endif
      url.host_piece() == kWelcomeHost ||
      url.host_piece() == chrome::kChromeUIWelcomeURL ||
#if !BUILDFLAG(IS_ANDROID)
      // On Android New Tab is a native page implemented in Java, so no need in
      // WebUI.
      url.host_piece() == chrome::kChromeUINewTabHost ||
#endif  // !BUILDFLAG(IS_ANDROID)
      url.host_piece() == chrome::kChromeUISettingsHost) {
    return &NewWebUI;
  }

  return nullptr;
}

bool ShouldBlockRewardsWebUI(content::BrowserContext* browser_context,
                             const GURL& url) {
  return false;
}

}  // namespace

WebUI::TypeID MisesWebUIControllerFactory::GetWebUIType(
    content::BrowserContext* browser_context,
    const GURL& url) {
  if (ShouldBlockRewardsWebUI(browser_context, url)) {
    return WebUI::kNoWebUI;
  }
  WebUIFactoryFunction function = GetWebUIFactoryFunction(nullptr, url);
  if (function) {
    return reinterpret_cast<WebUI::TypeID>(function);
  }
  return ChromeWebUIControllerFactory::GetWebUIType(browser_context, url);
}

std::unique_ptr<WebUIController>
MisesWebUIControllerFactory::CreateWebUIControllerForURL(WebUI* web_ui,
                                                         const GURL& url) {
  WebUIFactoryFunction function = GetWebUIFactoryFunction(web_ui, url);
  if (!function) {
    return ChromeWebUIControllerFactory::CreateWebUIControllerForURL(web_ui,
                                                                     url);
  }

  return base::WrapUnique((*function)(web_ui, url));
}

// static
MisesWebUIControllerFactory* MisesWebUIControllerFactory::GetInstance() {
  return base::Singleton<MisesWebUIControllerFactory>::get();
}

MisesWebUIControllerFactory::MisesWebUIControllerFactory() = default;

MisesWebUIControllerFactory::~MisesWebUIControllerFactory() = default;
