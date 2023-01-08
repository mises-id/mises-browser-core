/* Copyright (c) 2019 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "mises/browser/brave_local_state_prefs.h"

#include "base/values.h"
//#include "mises/browser/brave_stats/brave_stats_updater.h"
//#include "mises/browser/metrics/buildflags/buildflags.h"
//#include "mises/browser/metrics/metrics_reporting_util.h"
//#include "mises/browser/themes/brave_dark_mode_utils.h"
//#include "mises/components/brave_referrals/buildflags/buildflags.h"
//#include "mises/components/brave_search_conversion/p3a.h"
//#include "mises/components/brave_shields/browser/ad_block_service.h"
//#include "mises/components/brave_shields/browser/brave_shields_p3a.h"
//#include "mises/components/brave_vpn/buildflags/buildflags.h"
//#include "mises/components/constants/pref_names.h"
#include "mises/components/decentralized_dns/utils.h"
//#include "mises/components/ntp_background_images/browser/ntp_background_images_service.h"
//#include "mises/components/ntp_background_images/browser/view_counter_service.h"
//#include "mises/components/p3a/brave_p3a_service.h"
//#include "mises/components/p3a/buildflags.h"
//#include "mises/components/tor/buildflags/buildflags.h"
#include "build/build_config.h"
#include "chrome/common/pref_names.h"
#include "components/metrics/metrics_pref_names.h"
#include "components/prefs/pref_registry_simple.h"
#include "third_party/widevine/cdm/buildflags.h"

//#if BUILDFLAG(ENABLE_BRAVE_REFERRALS)
//#include "mises/components/brave_referrals/browser/brave_referrals_service.h"
//#endif
//
//#if BUILDFLAG(ENABLE_TOR)
//#include "mises/components/tor/tor_profile_service.h"
//#endif
//
//#include "mises/browser/ui/webui/new_tab_page/brave_new_tab_message_handler.h"
//
//#if !BUILDFLAG(IS_ANDROID)
//#include "mises/browser/p3a/p3a_core_metrics.h"
//#include "chrome/browser/first_run/first_run.h"
//#endif  // !BUILDFLAG(IS_ANDROID)
//
//#if BUILDFLAG(ENABLE_BRAVE_VPN)
//#include "mises/components/brave_vpn/brave_vpn_utils.h"
//#endif
//
//#if BUILDFLAG(ENABLE_WIDEVINE)
//#include "mises/browser/widevine/widevine_utils.h"
//#endif

namespace brave {

void RegisterLocalStatePrefsForMigration(PrefRegistrySimple* registry) {
//#if BUILDFLAG(ENABLE_WIDEVINE)
//  RegisterWidevineLocalstatePrefsForMigration(registry);
//#endif
}

void RegisterLocalStatePrefs(PrefRegistrySimple* registry) {
//  brave_shields::RegisterPrefsForAdBlockService(registry);
//  brave_stats::RegisterLocalStatePrefs(registry);
//  ntp_background_images::NTPBackgroundImagesService::RegisterLocalStatePrefs(
//      registry);
//  ntp_background_images::ViewCounterService::RegisterLocalStatePrefs(registry);
//#if BUILDFLAG(ENABLE_BRAVE_REFERRALS)
//  RegisterPrefsForBraveReferralsService(registry);
//#endif
//#if BUILDFLAG(IS_MAC)
//  // Turn off super annoying 'Hold to quit'
//  registry->SetDefaultPrefValue(prefs::kConfirmToQuitEnabled,
//                                base::Value(false));
//#endif
//#if BUILDFLAG(ENABLE_TOR)
//  tor::TorProfileService::RegisterLocalStatePrefs(registry);
//#endif
//  registry->SetDefaultPrefValue(
//      metrics::prefs::kMetricsReportingEnabled,
//      base::Value(GetDefaultPrefValueForMetricsReporting()));
//
//#if BUILDFLAG(BRAVE_P3A_ENABLED)
//  brave::BraveP3AService::RegisterPrefs(registry,
//#if !BUILDFLAG(IS_ANDROID)
//                                        first_run::IsChromeFirstRun());
//#else
//                                        // BraveP3AService::RegisterPrefs
//                                        // doesn't use this arg on Android
//                                        false);
//#endif  // !BUILDFLAG(IS_ANDROID)
//
//#endif  // BUILDFLAG(BRAVE_P3A_ENABLED)
//
//  brave_shields::RegisterShieldsP3ALocalPrefs(registry);
//#if !BUILDFLAG(IS_ANDROID)
//  BraveNewTabMessageHandler::RegisterLocalStatePrefs(registry);
//  BraveWindowTracker::RegisterPrefs(registry);
//  BraveUptimeTracker::RegisterPrefs(registry);
//  dark_mode::RegisterBraveDarkModeLocalStatePrefs(registry);
//
//  registry->RegisterBooleanPref(kDefaultBrowserPromptEnabled, true);
//#endif
//
//#if BUILDFLAG(ENABLE_CRASH_DIALOG)
//  registry->RegisterBooleanPref(kDontAskForCrashReporting, false);
//#endif
//
//#if BUILDFLAG(ENABLE_WIDEVINE)
//  RegisterWidevineLocalstatePrefs(registry);
//#endif

  decentralized_dns::RegisterLocalStatePrefs(registry);

//  RegisterLocalStatePrefsForMigration(registry);
//
//  brave_search_conversion::p3a::RegisterLocalStatePrefs(registry);
//
//#if BUILDFLAG(ENABLE_BRAVE_VPN)
//  brave_vpn::RegisterLocalStatePrefs(registry);
//#endif
}

}  // namespace brave
