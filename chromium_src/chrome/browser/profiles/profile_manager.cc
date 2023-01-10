// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
#include "mises/browser/profiles/mises_profile_manager.h"

#include "src/chrome/browser/profiles/profile_manager.cc"

#if BUILDFLAG(IS_ANDROID)

 void ProfileManager::MaybeScheduleProfileForDeletion(
    const base::FilePath& profile_dir,
    ProfileLoadedCallback callback,
    ProfileMetrics::ProfileDelete deletion_source) {

 }
 
void ProfileManager::ScheduleProfileForDeletion(
    const base::FilePath& profile_dir,
    ProfileLoadedCallback callback) {
  DCHECK(profiles::IsMultipleProfilesEnabled());
  DCHECK(!IsProfileDirectoryMarkedForDeletion(profile_dir));

  Profile* profile = GetProfileByPath(profile_dir);
  if (profile) {
    // Cancel all in-progress downloads before deleting the profile to prevent a
    // "Do you want to exit Google Chrome and cancel the downloads?" prompt
    // (crbug.com/336725).
    DownloadCoreService* service =
        DownloadCoreServiceFactory::GetForBrowserContext(profile);
    service->CancelDownloads();
    DCHECK_EQ(0, service->NonMaliciousDownloadCount());
  }
}
 
void ProfileManager::ScheduleEphemeralProfileForDeletion(
    const base::FilePath& profile_dir) {

}

#endif