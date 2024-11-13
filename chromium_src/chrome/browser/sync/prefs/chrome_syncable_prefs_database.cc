/* Copyright (c) 2023 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at https://mozilla.org/MPL/2.0/. */

#include <optional>
#include <string_view>

#include "base/containers/fixed_flat_map.h"
#include "chrome/browser/sync/prefs/chrome_syncable_prefs_database.h"


#define GetSyncablePrefMetadata GetSyncablePrefMetadata_ChromiumImpl
#include "src/chrome/browser/sync/prefs/chrome_syncable_prefs_database.cc"
#undef GetSyncablePrefMetadata



namespace browser_sync {
namespace {

const auto& MisesSyncablePreferences() {
  static const auto kMisesSyncablePrefsAllowList = base::MakeFixedFlatMap<
      std::string_view, sync_preferences::SyncablePrefMetadata>({
#if BUILDFLAG(IS_ANDROID)
     {prefs::kAccessibilityReadAnythingFontName,
     {syncable_prefs_ids::kAccessibilityReadAnythingFontName,
      syncer::PREFERENCES, sync_preferences::PrefSensitivity::kNone,
      sync_preferences::MergeBehavior::kNone}},
    {prefs::kAccessibilityReadAnythingFontScale,
     {syncable_prefs_ids::kAccessibilityReadAnythingFontScale,
      syncer::PREFERENCES, sync_preferences::PrefSensitivity::kNone,
      sync_preferences::MergeBehavior::kNone}},
    {prefs::kAccessibilityReadAnythingColorInfo,
     {syncable_prefs_ids::kAccessibilityReadAnythingColorInfo,
      syncer::PREFERENCES, sync_preferences::PrefSensitivity::kNone,
      sync_preferences::MergeBehavior::kNone}},
    {prefs::kAccessibilityReadAnythingLineSpacing,
     {syncable_prefs_ids::kAccessibilityReadAnythingLineSpacing,
      syncer::PREFERENCES, sync_preferences::PrefSensitivity::kNone,
      sync_preferences::MergeBehavior::kNone}},
    {prefs::kAccessibilityReadAnythingLetterSpacing,
     {syncable_prefs_ids::kAccessibilityReadAnythingLetterSpacing,
      syncer::PREFERENCES, sync_preferences::PrefSensitivity::kNone,
      sync_preferences::MergeBehavior::kNone}},
    {prefs::kAccessibilityReadAnythingVoiceName,
     {syncable_prefs_ids::kAccessibilityReadAnythingVoiceName,
      syncer::PREFERENCES, sync_preferences::PrefSensitivity::kNone,
      sync_preferences::MergeBehavior::kNone}},
    {prefs::kAccessibilityReadAnythingSpeechRate,
     {syncable_prefs_ids::kAccessibilityReadAnythingSpeechRate,
      syncer::PREFERENCES, sync_preferences::PrefSensitivity::kNone,
      sync_preferences::MergeBehavior::kNone}},
    {prefs::kAccessibilityReadAnythingHighlightGranularity,
     {syncable_prefs_ids::kAccessibilityReadAnythingHighlightGranularity,
      syncer::PREFERENCES, sync_preferences::PrefSensitivity::kNone,
      sync_preferences::MergeBehavior::kNone}},
    {prefs::kAccessibilityReadAnythingHighlightColor,
     {syncable_prefs_ids::kAccessibilityReadAnythingHighlightColor,
      syncer::PREFERENCES, sync_preferences::PrefSensitivity::kNone,
      sync_preferences::MergeBehavior::kNone}},
    {prefs::kAccessibilityReadAnythingLinksEnabled,
     {syncable_prefs_ids::kAccessibilityReadAnythingLinksEnabled,
      syncer::PREFERENCES, sync_preferences::PrefSensitivity::kNone,
      sync_preferences::MergeBehavior::kNone}},
    {prefs::kAccessibilityReadAnythingImagesEnabled,
     {syncable_prefs_ids::kAccessibilityReadAnythingImagesEnabled,
      syncer::PREFERENCES, sync_preferences::PrefSensitivity::kNone,
      sync_preferences::MergeBehavior::kNone}},
    {prefs::kAccessibilityReadAnythingLanguagesEnabled,
     {syncable_prefs_ids::kAccessibilityReadAnythingLanguagesEnabled,
      syncer::PREFERENCES, sync_preferences::PrefSensitivity::kNone,
      sync_preferences::MergeBehavior::kNone}},
    {prefs::kLensRegionSearchEnabled,
     {syncable_prefs_ids::kLensRegionSearchEnabled, syncer::PREFERENCES,
      sync_preferences::PrefSensitivity::kNone,
      sync_preferences::MergeBehavior::kNone}},
    {prefs::kHatsSurveyMetadata,
     {syncable_prefs_ids::kHatsSurveyMetadata, syncer::PREFERENCES,
      sync_preferences::PrefSensitivity::kNone,
      sync_preferences::MergeBehavior::kNone}},
    {prefs::kHomePage,
     {syncable_prefs_ids::kHomePage, syncer::PREFERENCES,
      sync_preferences::PrefSensitivity::kNone,
      sync_preferences::MergeBehavior::kNone}},
    {prefs::kHomePageIsNewTabPage,
     {syncable_prefs_ids::kHomePageIsNewTabPage, syncer::PREFERENCES,
      sync_preferences::PrefSensitivity::kNone,
      sync_preferences::MergeBehavior::kNone}},
    {prefs::kNtpCustomBackgroundDictDoNotUse,
     {syncable_prefs_ids::kNtpCustomBackgroundDict, syncer::PREFERENCES,
      sync_preferences::PrefSensitivity::kNone,
      sync_preferences::MergeBehavior::kNone}},
    {prefs::kLiveCaptionBubbleExpanded,
     {syncable_prefs_ids::kLiveCaptionBubbleExpanded, syncer::PREFERENCES,
      sync_preferences::PrefSensitivity::kNone,
      sync_preferences::MergeBehavior::kNone}},
    {prefs::kLiveCaptionEnabled,
     {syncable_prefs_ids::kLiveCaptionEnabled, syncer::PREFERENCES,
      sync_preferences::PrefSensitivity::kNone,
      sync_preferences::MergeBehavior::kNone}},
    {prefs::kLiveCaptionLanguageCode,
     {syncable_prefs_ids::kLiveCaptionLanguageCode, syncer::PREFERENCES,
      sync_preferences::PrefSensitivity::kNone,
      sync_preferences::MergeBehavior::kNone}},
    {prefs::kLiveCaptionMediaFoundationRendererErrorSilenced,
     {syncable_prefs_ids::kLiveCaptionMediaFoundationRendererErrorSilenced,
      syncer::PREFERENCES, sync_preferences::PrefSensitivity::kNone,
      sync_preferences::MergeBehavior::kNone}},
    {prefs::kLiveCaptionMaskOffensiveWords,
     {syncable_prefs_ids::kLiveCaptionMaskOffensiveWords, syncer::PREFERENCES,
      sync_preferences::PrefSensitivity::kNone,
      sync_preferences::MergeBehavior::kNone}},
    {prefs::kShowHomeButton,
     {syncable_prefs_ids::kShowHomeButton, syncer::PREFERENCES,
      sync_preferences::PrefSensitivity::kNone,
      sync_preferences::MergeBehavior::kNone}},
    {prefs::kShowForwardButton,
     {syncable_prefs_ids::kShowForwardButton, syncer::PREFERENCES,
      sync_preferences::PrefSensitivity::kNone,
      sync_preferences::MergeBehavior::kNone}},
    {prefs::kSidePanelCompanionEntryPinnedToToolbar,
     {syncable_prefs_ids::kSidePanelCompanionEntryPinnedToToolbar,
      syncer::PREFERENCES, sync_preferences::PrefSensitivity::kNone,
      sync_preferences::MergeBehavior::kNone}},
    {prefs::kPinnedActions,
     {syncable_prefs_ids::kPinnedActions, syncer::PREFERENCES,
      sync_preferences::PrefSensitivity::kNone,
      sync_preferences::MergeBehavior::kMergeableListWithRewriteOnUpdate}},
    {prefs::kPinnedSearchCompanionMigrationComplete,
     {syncable_prefs_ids::kPinnedSearchCompanionMigrationComplete,
      syncer::PREFERENCES, sync_preferences::PrefSensitivity::kNone,
      sync_preferences::MergeBehavior::kNone}},
    {prefs::kPinnedChromeLabsMigrationComplete,
     {syncable_prefs_ids::kPinnedChromeLabsMigrationComplete,
      syncer::PREFERENCES, sync_preferences::PrefSensitivity::kNone,
      sync_preferences::MergeBehavior::kNone}},
#endif
  });
  return kMisesSyncablePrefsAllowList;
}
}  // namespace

std::optional<sync_preferences::SyncablePrefMetadata>
ChromeSyncablePrefsDatabase::GetSyncablePrefMetadata(
    std::string_view pref_name) const {
  const auto it = MisesSyncablePreferences().find(pref_name);
  if (it != MisesSyncablePreferences().end()) {
    return it->second;
  }
  return GetSyncablePrefMetadata_ChromiumImpl(pref_name);
}

}  // namespace browser_sync
