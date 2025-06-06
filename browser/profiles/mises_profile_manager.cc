// Copyright (c) 2019 The Brave Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this file,
// you can obtain one at http://mozilla.org/MPL/2.0/.

#include "mises/browser/profiles/mises_profile_manager.h"

#include <memory>
#include <string>
#include <utility>
#include <vector>

#include "mises/components/constants/pref_names.h"
#include "mises/components/ipfs/buildflags/buildflags.h"
#include "mises/browser/profiles/profile_util.h"

#include "chrome/browser/browser_process.h"
#include "chrome/browser/profiles/profile_attributes_entry.h"
#include "chrome/browser/profiles/profile_attributes_storage.h"
#include "chrome/browser/profiles/profiles_state.h"
#include "chrome/common/chrome_constants.h"
#include "chrome/common/pref_names.h"
#include "chrome/grit/generated_resources.h"
#include "components/bookmarks/common/bookmark_pref_names.h"
#include "components/gcm_driver/gcm_buildflags.h"
#include "components/prefs/pref_service.h"
#include "components/signin/public/base/signin_pref_names.h"
#include "content/public/browser/browser_thread.h"
#include "content/public/browser/url_data_source.h"
#include "ui/base/l10n/l10n_util.h"


#if BUILDFLAG(ENABLE_IPFS)
#include "mises/browser/ipfs/ipfs_service_factory.h"
#endif

using content::BrowserThread;

MisesProfileManager::MisesProfileManager(const base::FilePath& user_data_dir)
    : ProfileManager(user_data_dir) {
  MigrateProfileNames();
}

void MisesProfileManager::InitProfileUserPrefs(Profile* profile) {
  // migrate obsolete plugin prefs to temporary migration pref because otherwise
  // they get deleteed by PrefProvider before we can migrate them in
  // BravePrefProvider


// Chromecast is enabled by default on Android.
#if !BUILDFLAG(IS_ANDROID)
  auto* pref_service = profile->GetPrefs();
  if (pref_service && pref_service->FindPreference(kEnableMediaRouterOnRestart))  {
      // At start, the value of kEnableMediaRouterOnRestart is updated to match
    // kEnableMediaRouter so users don't lose their current setting
    if (pref_service->FindPreference(kEnableMediaRouterOnRestart)
            ->IsDefaultValue()) {
      auto enabled = pref_service->GetBoolean(::prefs::kEnableMediaRouter);
      pref_service->SetBoolean(kEnableMediaRouterOnRestart, enabled);
    } else {
      // For Desktop, kEnableMediaRouterOnRestart is used to track the current
      // state of the media router switch in brave://settings/extensions. The
      // value of kEnableMediaRouter is only updated to match
      // kEnableMediaRouterOnRestart on restart
      auto enabled = pref_service->GetBoolean(kEnableMediaRouterOnRestart);
      pref_service->SetBoolean(::prefs::kEnableMediaRouter, enabled);
    }
  }

#else
  PrefService* prefs = profile->GetPrefs();
  prefs->SetBoolean(prefs::kSigninAllowed, false);
#endif

  ProfileManager::InitProfileUserPrefs(profile);

  mises::SetDefaultSearchVersion(profile, profile->IsNewProfile());
}

void MisesProfileManager::DoFinalInitForServices(Profile* profile,
                                                 bool go_off_the_record) {
  ProfileManager::DoFinalInitForServices(profile, go_off_the_record);
  if (!do_final_services_init_)
    return;
#if BUILDFLAG(ENABLE_IPFS)
  ipfs::IpfsServiceFactory::GetForContext(profile);
#endif
}

bool MisesProfileManager::IsAllowedProfilePath(
    const base::FilePath& path) const {
  // Chromium only allows profiles to be created in the user_data_dir, but we
  // want to also be able to create profile in subfolders of user_data_dir.
  return ProfileManager::IsAllowedProfilePath(path) ||
         user_data_dir().IsParent(path.DirName());
}

bool MisesProfileManager::LoadProfileByPath(const base::FilePath& profile_path,
                         bool incognito,
                         ProfileLoadedCallback callback) {

  return ProfileManager::LoadProfileByPath(profile_path, incognito,
                                           std::move(callback));
}

// This overridden method doesn't clear |kDefaultSearchProviderDataPrefName|.
// W/o this, prefs set by TorWindowSearchEngineProviderService is cleared
// during the initialization.
void MisesProfileManager::SetNonPersonalProfilePrefs(Profile* profile) {
  PrefService* prefs = profile->GetPrefs();
  prefs->SetBoolean(prefs::kSigninAllowed, false);
  prefs->SetBoolean(bookmarks::prefs::kEditBookmarksEnabled, false);
  prefs->SetBoolean(bookmarks::prefs::kShowBookmarkBar, false);
}

void MisesProfileManager::MigrateProfileNames() {
#if !BUILDFLAG(IS_ANDROID) && !BUILDFLAG(IS_CHROMEOS)
  // If any profiles have a default name using an
  // older version of the default name string format,
  // then name it with the new default name string format.
  // e.g. 'Person X' --> 'Profile X'.
  ProfileAttributesStorage& storage = GetProfileAttributesStorage();
  std::vector<ProfileAttributesEntry*> entries =
      storage.GetAllProfilesAttributesSortedByNameWithCheck();
  // Make sure we keep the numbering the same.
  for (auto* entry : entries) {
    // Rename the necessary profiles. Don't check for legacy names as profile
    // info cache should have migrated them by now.
    if (entry->IsUsingDefaultName() &&
        !storage.IsDefaultProfileName(
            entry->GetName(),
            /*include_check_for_legacy_profile_name=*/false)) {
      auto icon_index = entry->GetAvatarIconIndex();
      entry->SetLocalProfileName(storage.ChooseNameForNewProfile(icon_index),
                                 /*is_default_name=*/true);
    }
  }
#endif
}

MisesProfileManagerWithoutInit::MisesProfileManagerWithoutInit(
    const base::FilePath& user_data_dir)
    : MisesProfileManager(user_data_dir) {
  set_do_final_services_init(false);
}
