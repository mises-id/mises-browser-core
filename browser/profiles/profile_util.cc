/* Copyright (c) 2019 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "mises/browser/profiles/profile_util.h"

#include <map>
#include <memory>
#include <utility>

#include "base/memory/raw_ptr.h"
#include "base/metrics/histogram_macros.h"

#include "chrome/browser/content_settings/host_content_settings_map_factory.h"
#include "chrome/browser/profiles/profile.h"
#include "components/content_settings/core/browser/cookie_settings.h"
#include "components/content_settings/core/common/pref_names.h"
#include "components/prefs/pref_service.h"
#include "components/search_engines/search_engines_pref_names.h"

//using ntp_background_images::prefs::kNewTabPageShowBackgroundImage;
//using ntp_background_images::prefs::kNewTabPageShowSponsoredImagesBackgroundImage; // NOLINT



namespace brave {

bool IsGuestProfile(content::BrowserContext* context) {
  DCHECK(context);
  return Profile::FromBrowserContext(context)
      ->GetOriginalProfile()
      ->IsGuestSession();
}

bool IsTorDisabledForProfile(Profile* profile) {

  return true;

}

bool IsRegularProfile(content::BrowserContext* context) {
  auto* profile = Profile::FromBrowserContext(context);
  return 
         !profile->IsGuestSession() &&
         profile->IsRegularProfile();
}

void RecordSponsoredImagesEnabledP3A(Profile* profile) {
  bool is_sponsored_image_enabled = false;
  /*
      profile->GetPrefs()->GetBoolean(kNewTabPageShowBackgroundImage) &&
      profile->GetPrefs()->GetBoolean(
          kNewTabPageShowSponsoredImagesBackgroundImage);
 */ 
 UMA_HISTOGRAM_BOOLEAN("Brave.NTP.SponsoredImagesEnabled",
                        is_sponsored_image_enabled);
}

void RecordInitialP3AValues(Profile* profile) {
  // Preference is unregistered for some reason in profile_manager_unittest
  // TODO(bsclifton): create a proper testing profile
/*
      	if (!profile->GetPrefs()->FindPreference(kNewTabPageShowBackgroundImage) ||
      !profile->GetPrefs()->FindPreference(
          kNewTabPageShowSponsoredImagesBackgroundImage)) {
    return;
  }
  RecordSponsoredImagesEnabledP3A(profile);
  if (profile->IsRegularProfile()) {
    brave_shields::MaybeRecordInitialShieldsSettings(
        profile->GetPrefs(),
        HostContentSettingsMapFactory::GetForProfile(profile));
  }
 */
}

void SetDefaultSearchVersion(Profile* profile, bool is_new_profile) {
  const PrefService::Preference* pref_default_search_version =
      profile->GetPrefs()->FindPreference(prefs::kBraveDefaultSearchVersion);
  if (!pref_default_search_version->HasUserSetting()) {
    profile->GetPrefs()->SetInteger(
        prefs::kBraveDefaultSearchVersion,0);
    /*
        is_new_profile
            ? TemplateURLPrepopulateData::kBraveCurrentDataVersion
            : TemplateURLPrepopulateData::kBraveFirstTrackedDataVersion);*/
  }
}

void SetDefaultThirdPartyCookieBlockValue(Profile* profile) {
  profile->GetPrefs()->SetDefaultPrefValue(
      prefs::kCookieControlsMode,
      base::Value(static_cast<int>(
          content_settings::CookieControlsMode::kBlockThirdParty)));
}

}  // namespace brave
