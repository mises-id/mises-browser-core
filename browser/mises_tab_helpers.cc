/* Copyright (c) 2019 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "mises/browser/brave_tab_helpers.h"

#include "base/command_line.h"
#include "base/feature_list.h"
#include "mises/browser/brave_ads/ads_tab_helper.h"
#include "mises/browser/brave_news/brave_news_tab_helper.h"
#include "mises/browser/brave_rewards/rewards_tab_helper.h"
#include "mises/browser/brave_shields/brave_shields_web_contents_observer.h"
#include "mises/browser/brave_stats/brave_stats_tab_helper.h"
#include "mises/browser/brave_wallet/brave_wallet_tab_helper.h"
#include "mises/browser/ephemeral_storage/ephemeral_storage_tab_helper.h"
#include "mises/browser/ui/bookmark/brave_bookmark_tab_helper.h"
#include "mises/components/brave_perf_predictor/browser/perf_predictor_tab_helper.h"
#include "mises/components/brave_today/common/features.h"
#include "mises/components/brave_wayback_machine/buildflags.h"
#include "mises/components/greaselion/browser/buildflags/buildflags.h"
#include "mises/components/ipfs/buildflags/buildflags.h"
#include "mises/components/speedreader/common/buildflags.h"
#include "mises/components/tor/buildflags/buildflags.h"
#include "build/build_config.h"
#include "content/public/browser/browser_context.h"
#include "content/public/browser/web_contents.h"
#include "extensions/buildflags/buildflags.h"
#include "net/base/features.h"
#include "third_party/widevine/cdm/buildflags.h"

#if BUILDFLAG(ENABLE_GREASELION)
#include "mises/browser/greaselion/greaselion_tab_helper.h"
#endif

#if BUILDFLAG(IS_ANDROID)
#include "mises/browser/android/preferences/background_video_playback_tab_helper.h"
#endif

#if !BUILDFLAG(IS_ANDROID)
#include "mises/browser/ui/brave_shields_data_controller.h"
#include "chrome/browser/ui/thumbnails/thumbnail_tab_helper.h"
#endif

#if BUILDFLAG(ENABLE_WIDEVINE)
#include "mises/browser/brave_drm_tab_helper.h"
#endif

#if BUILDFLAG(ENABLE_BRAVE_WAYBACK_MACHINE)
#include "mises/browser/infobars/brave_wayback_machine_delegate_impl.h"
#endif

#if BUILDFLAG(ENABLE_SPEEDREADER)
#include "mises/browser/speedreader/speedreader_tab_helper.h"
#endif

#if BUILDFLAG(ENABLE_TOR)
#include "mises/components/tor/onion_location_tab_helper.h"
#include "mises/components/tor/tor_tab_helper.h"
#endif

#if BUILDFLAG(ENABLE_IPFS)
#include "mises/browser/ipfs/ipfs_service_factory.h"
#include "mises/browser/ipfs/ipfs_tab_helper.h"
#endif

#if BUILDFLAG(ENABLE_EXTENSIONS)
#include "mises/browser/web_discovery/web_discovery_tab_helper.h"
#endif

namespace brave {

void AttachTabHelpers(content::WebContents* web_contents) {
#if BUILDFLAG(ENABLE_GREASELION)
  greaselion::GreaselionTabHelper::CreateForWebContents(web_contents);
#endif
  brave_shields::BraveShieldsWebContentsObserver::CreateForWebContents(
      web_contents);
#if BUILDFLAG(IS_ANDROID)
  BackgroundVideoPlaybackTabHelper::CreateForWebContents(web_contents);
#else
  // Add tab helpers here unless they are intended for android too
  BraveBookmarkTabHelper::CreateForWebContents(web_contents);
  brave_shields::BraveShieldsDataController::CreateForWebContents(web_contents);
  ThumbnailTabHelper::CreateForWebContents(web_contents);
#endif

  brave_rewards::RewardsTabHelper::CreateForWebContents(web_contents);

#if BUILDFLAG(ENABLE_WIDEVINE)
  BraveDrmTabHelper::CreateForWebContents(web_contents);
#endif

#if BUILDFLAG(ENABLE_BRAVE_WAYBACK_MACHINE)
  BraveWaybackMachineDelegateImpl::AttachTabHelperIfNeeded(web_contents);
#endif

  brave_perf_predictor::PerfPredictorTabHelper::CreateForWebContents(
      web_contents);

  brave_ads::AdsTabHelper::CreateForWebContents(web_contents);

#if BUILDFLAG(ENABLE_EXTENSIONS)
  WebDiscoveryTabHelper::MaybeCreateForWebContents(web_contents);
#endif

#if BUILDFLAG(ENABLE_SPEEDREADER)
  speedreader::SpeedreaderTabHelper::MaybeCreateForWebContents(web_contents);
#endif

#if BUILDFLAG(ENABLE_TOR)
  tor::TorTabHelper::MaybeCreateForWebContents(
      web_contents, web_contents->GetBrowserContext()->IsTor());
  tor::OnionLocationTabHelper::CreateForWebContents(web_contents);
#endif

#if BUILDFLAG(ENABLE_IPFS)
  ipfs::IPFSTabHelper::MaybeCreateForWebContents(web_contents);
#endif

  if (base::FeatureList::IsEnabled(
          brave_today::features::kBraveNewsSubscribeButtonFeature)) {
    BraveNewsTabHelper::CreateForWebContents(web_contents);
  }

  brave_stats::BraveStatsTabHelper::CreateForWebContents(web_contents);

  if (base::FeatureList::IsEnabled(net::features::kBraveEphemeralStorage)) {
    ephemeral_storage::EphemeralStorageTabHelper::CreateForWebContents(
        web_contents);
  }

  brave_wallet::BraveWalletTabHelper::CreateForWebContents(web_contents);
}

}  // namespace brave