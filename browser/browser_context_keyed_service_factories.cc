/* Copyright (c) 2019 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "mises/browser/browser_context_keyed_service_factories.h"

#include "base/feature_list.h"
//#include "mises/browser/brave_ads/ads_service_factory.h"
//#include "mises/browser/brave_federated/brave_federated_service_factory.h"
//#include "mises/browser/brave_news/brave_news_controller_factory.h"
//#include "mises/browser/brave_rewards/rewards_service_factory.h"
//#include "mises/browser/brave_shields/ad_block_pref_service_factory.h"
//#include "mises/browser/brave_wallet/asset_ratio_service_factory.h"
//#include "mises/browser/brave_wallet/brave_wallet_service_factory.h"
//#include "mises/browser/brave_wallet/json_rpc_service_factory.h"
//#include "mises/browser/brave_wallet/keyring_service_factory.h"
//#include "mises/browser/brave_wallet/swap_service_factory.h"
//#include "mises/browser/brave_wallet/tx_service_factory.h"
//#include "mises/browser/debounce/debounce_service_factory.h"
//#include "mises/browser/ethereum_remote_client/buildflags/buildflags.h"
//#include "mises/browser/ntp_background/view_counter_service_factory.h"
//#include "mises/browser/permissions/permission_lifetime_manager_factory.h"
//#include "mises/browser/search_engines/search_engine_tracker.h"
//#include "mises/browser/skus/skus_service_factory.h"
//#include "mises/components/brave_adaptive_captcha/buildflags/buildflags.h"
//#include "mises/components/brave_today/common/features.h"
//#include "mises/components/greaselion/browser/buildflags/buildflags.h"
#include "mises/components/ipfs/buildflags/buildflags.h"
//#include "mises/components/playlist/buildflags/buildflags.h"
//#include "mises/components/tor/buildflags/buildflags.h"

//#if BUILDFLAG(ENABLE_GREASELION)
//#include "mises/browser/greaselion/greaselion_service_factory.h"
//#endif
//
//#if !BUILDFLAG(IS_ANDROID)
//#include "mises/browser/search_engines/search_engine_provider_service_factory.h"
//#include "mises/browser/ui/bookmark/bookmark_prefs_service_factory.h"
//#else
//#include "mises/browser/ntp_background/android/ntp_background_images_bridge.h"
//#endif

//#if BUILDFLAG(ETHEREUM_REMOTE_CLIENT_ENABLED)
//#include "mises/browser/ethereum_remote_client/ethereum_remote_client_service_factory.h"
//#endif

#if BUILDFLAG(ENABLE_IPFS)
#include "mises/browser/ipfs/ipfs_service_factory.h"
#endif

//#if BUILDFLAG(ENABLE_TOR)
//#include "mises/browser/tor/tor_profile_service_factory.h"
//#endif
//
//#if BUILDFLAG(BRAVE_ADAPTIVE_CAPTCHA_ENABLED)
//#include "mises/browser/brave_adaptive_captcha/brave_adaptive_captcha_service_factory.h"
//#endif

//#if BUILDFLAG(ENABLE_PLAYLIST)
//#include "mises/browser/playlist/playlist_service_factory.h"
//#include "mises/components/playlist/features.h"
//#endif

namespace brave {

void EnsureBrowserContextKeyedServiceFactoriesBuilt() {
//  brave_ads::AdsServiceFactory::GetInstance();
//  brave_federated::BraveFederatedServiceFactory::GetInstance();
//  brave_rewards::RewardsServiceFactory::GetInstance();
//  brave_shields::AdBlockPrefServiceFactory::GetInstance();
//  debounce::DebounceServiceFactory::GetInstance();
//#if BUILDFLAG(ENABLE_GREASELION)
//  greaselion::GreaselionServiceFactory::GetInstance();
//#endif
//#if BUILDFLAG(ENABLE_TOR)
//  TorProfileServiceFactory::GetInstance();
//#endif
//  SearchEngineTrackerFactory::GetInstance();
//  ntp_background_images::ViewCounterServiceFactory::GetInstance();

//#if !BUILDFLAG(IS_ANDROID)
//  BookmarkPrefsServiceFactory::GetInstance();
//  SearchEngineProviderServiceFactory::GetInstance();
//#else
//  ntp_background_images::NTPBackgroundImagesBridgeFactory::GetInstance();
//#endif

//  if (base::FeatureList::IsEnabled(brave_today::features::kBraveNewsFeature)) {
//    brave_news::BraveNewsControllerFactory::GetInstance();
//  }

//  brave_wallet::AssetRatioServiceFactory::GetInstance();
//  brave_wallet::KeyringServiceFactory::GetInstance();
//  brave_wallet::JsonRpcServiceFactory::GetInstance();
//  brave_wallet::SwapServiceFactory::GetInstance();
//  brave_wallet::TxServiceFactory::GetInstance();
//  brave_wallet::BraveWalletServiceFactory::GetInstance();

//#if BUILDFLAG(ETHEREUM_REMOTE_CLIENT_ENABLED)
//  EthereumRemoteClientServiceFactory::GetInstance();
//#endif

#if BUILDFLAG(ENABLE_IPFS)
  ipfs::IpfsServiceFactory::GetInstance();
#endif

//#if BUILDFLAG(BRAVE_ADAPTIVE_CAPTCHA_ENABLED)
//  brave_adaptive_captcha::BraveAdaptiveCaptchaServiceFactory::GetInstance();
//#endif
//
//  PermissionLifetimeManagerFactory::GetInstance();
//
//  skus::SkusServiceFactory::GetInstance();
//
//#if BUILDFLAG(ENABLE_PLAYLIST)
//  if (base::FeatureList::IsEnabled(playlist::features::kPlaylist)) {
//    playlist::PlaylistServiceFactory::GetInstance();
//  }
//#endif
}

}  // namespace brave