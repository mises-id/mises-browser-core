/* Copyright (c) 2020 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

//#include "mises/components/brave_sync/brave_sync_prefs.h"
#include "mises/components/brave_wallet/browser/brave_wallet_prefs.h"
#include "mises/components/brave_wallet/browser/keyring_service.h"
#include "mises/components/decentralized_dns/core/utils.h"
#include "mises/components/ipfs/buildflags/buildflags.h"
//#include "mises/components/p3a/buildflags.h"
//#include "mises/components/p3a/p3a_service.h"
//#include "mises/ios/browser/brave_stats/brave_stats_prefs.h"
#include "components/pref_registry/pref_registry_syncable.h"

#if BUILDFLAG(ENABLE_IPFS)
#include "mises/components/ipfs/ipfs_service.h"
#endif

void MisesRegisterBrowserStatePrefs(
    user_prefs::PrefRegistrySyncable* registry) {
 // brave_sync::Prefs::RegisterProfilePrefs(registry);
  brave_wallet::RegisterProfilePrefs(registry);
  brave_wallet::RegisterProfilePrefsForMigration(registry);
#if BUILDFLAG(ENABLE_IPFS)
  ipfs::IpfsService::RegisterProfilePrefs(registry);
#endif
}

void MisesRegisterLocalStatePrefs(PrefRegistrySimple* registry) {
  //brave_stats::RegisterLocalStatePrefs(registry);
  brave_wallet::RegisterLocalStatePrefs(registry);
  brave_wallet::RegisterLocalStatePrefsForMigration(registry);
  decentralized_dns::RegisterLocalStatePrefs(registry);
// #if BUILDFLAG(MISES_P3A_ENABLED)
//   p3a::P3AService::RegisterPrefs(registry, false);
// #endif
}

void MisesMigrateObsoleteBrowserStatePrefs(PrefService* prefs) {
  brave_wallet::KeyringService::MigrateObsoleteProfilePrefs(prefs);
  brave_wallet::MigrateObsoleteProfilePrefs(prefs);
}

#define MISES_REGISTER_BROWSER_STATE_PREFS MisesRegisterBrowserStatePrefs(registry);
#define MISES_REGISTER_LOCAL_STATE_PREFS MisesRegisterLocalStatePrefs(registry);
#define MISES_MIGRATE_OBSOLETE_BROWSER_STATE_PREFS \
  MisesMigrateObsoleteBrowserStatePrefs(prefs);
#include "src/ios/chrome/browser/prefs/browser_prefs.mm"
