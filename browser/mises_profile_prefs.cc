/* Copyright (c) 2019 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "mises/browser/mises_profile_prefs.h"

#include <string>

#include "mises/components/constants/pref_names.h"
#include "mises/components/ipfs/buildflags/buildflags.h"
#include "mises/components/brave_wallet/browser/brave_wallet_prefs.h"
#include "mises/components/search_engines/mises_prepopulated_engines.h"

#include "build/build_config.h"
#include "chrome/browser/prefetch/pref_names.h"
#include "chrome/browser/prefs/session_startup_pref.h"
#include "chrome/browser/preloading/preloading_prefs.h"
#include "chrome/browser/ui/webui/new_tab_page/ntp_pref_names.h"
#include "chrome/common/channel_info.h"
#include "chrome/common/pref_names.h"
#include "components/content_settings/core/common/pref_names.h"
#include "components/embedder_support/pref_names.h"
#include "components/gcm_driver/gcm_buildflags.h"
#include "components/password_manager/core/common/password_manager_pref_names.h"
#include "components/policy/core/common/policy_pref_names.h"
#include "components/pref_registry/pref_registry_syncable.h"
#include "components/prefs/pref_registry_simple.h"
#include "components/privacy_sandbox/privacy_sandbox_prefs.h"
#include "components/safe_browsing/core/common/safe_browsing_prefs.h"
#include "components/search_engines/search_engines_pref_names.h"
#include "components/signin/public/base/signin_pref_names.h"
#include "components/sync/base/pref_names.h"
#include "extensions/buildflags/buildflags.h"
#include "third_party/widevine/cdm/buildflags.h"


#if BUILDFLAG(ENABLE_IPFS)
#include "mises/components/ipfs/ipfs_service.h"
#endif


#if BUILDFLAG(ENABLE_EXTENSIONS)
#include "extensions/common/feature_switch.h"
using extensions::FeatureSwitch;
#endif

#if BUILDFLAG(ENABLE_WIDEVINE)
#include "mises/browser/widevine/widevine_utils.h"
#endif

namespace mises {


void RegisterProfilePrefsForMigration(
    user_prefs::PrefRegistrySyncable* registry) {
      
  brave_wallet::RegisterProfilePrefsForMigration(registry);

#if BUILDFLAG(ENABLE_WIDEVINE)
  RegisterWidevineProfilePrefsForMigration(registry);
#endif
    
}
void RegisterProfilePrefs(user_prefs::PrefRegistrySyncable* registry) {
  

#if BUILDFLAG(ENABLE_IPFS)
  ipfs::IpfsService::RegisterProfilePrefs(registry);
#endif

#if BUILDFLAG(IS_ANDROID)
  registry->RegisterBooleanPref(kBackgroundVideoPlaybackEnabled, false);
#endif

  // Brave Wallet
  brave_wallet::RegisterProfilePrefs(registry);

  registry->RegisterBooleanPref(kPreinstallMetamaskEnabled, true);
  registry->RegisterBooleanPref(kMisesWalletDidMigrated, false);
  registry->RegisterStringPref(
      kMisesWalletAuthCache, std::string());

  registry->RegisterStringPref(
      prefs::kExtensionsUIDefaultEVMWalletID, std::string());
  registry->RegisterStringPref(
      prefs::kExtensionsUIDefaultEVMWalletKeyProperty, std::string());
    
    // Default search engine version
  registry->RegisterIntegerPref(
      prefs::kMisesDefaultSearchVersion,
      TemplateURLPrepopulateData::kMisesCurrentDataVersion);



  // TODO(shong): Migrate this to local state also and guard in ENABLE_WIDEVINE.
  // We don't need to display "don't ask widevine prompt option" in settings
  // if widevine is disabled.
  // F/u issue: https://github.com/brave/brave-browser/issues/7000
  registry->RegisterBooleanPref(kAskEnableWidvine, true);


  RegisterProfilePrefsForMigration(registry);

}

}  // namespace mises
