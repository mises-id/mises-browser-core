#ifndef MISES_BROWSER_FLAG_DESCRIPTIONS_H_
#define MISES_BROWSER_FLAG_DESCRIPTIONS_H_

// Includes needed for macros allowing conditional compilation of some strings.
#include "src/chrome/browser/flag_descriptions.h"


namespace flag_descriptions {

extern const char kHorizontalTabSwitcherAndroidName[];
extern const char kHorizontalTabSwitcherAndroidDescription[];


#if BUILDFLAG(IS_ANDROID)
extern const char kAppManagementAppDetailsName[];
extern const char kAppManagementAppDetailsDescription[];

extern const char kAllowAllSitesToInitiateMirroringName[];
extern const char kAllowAllSitesToInitiateMirroringDescription[];

extern const char kBlockMigratedDefaultChromeAppSyncName[];
extern const char kBlockMigratedDefaultChromeAppSyncDescription[];

extern const char kEnableAccessibilityLiveCaptionName[];
extern const char kEnableAccessibilityLiveCaptionDescription[];

extern const char kEnableUserCloudSigninRestrictionPolicyName[];
extern const char kEnableUserCloudSigninRestrictionPolicyDescription[];

extern const char kEnableWebHidOnExtensionServiceWorkerName[];
extern const char kEnableWebHidOnExtensionServiceWorkerDescription[];

extern const char kCopyLinkToTextName[];
extern const char kCopyLinkToTextDescription[];

extern const char kGlobalMediaControlsCastStartStopName[];
extern const char kGlobalMediaControlsCastStartStopDescription[];

extern const char kMuteNotificationSnoozeActionName[];
extern const char kMuteNotificationSnoozeActionDescription[];

extern const char kNtpCacheOneGoogleBarName[];
extern const char kNtpCacheOneGoogleBarDescription[];

extern const char kNtpChromeCartModuleName[];
extern const char kNtpChromeCartModuleDescription[];

extern const char kNtpDriveModuleName[];
extern const char kNtpDriveModuleDescription[];

#if !defined(OFFICIAL_BUILD)
extern const char kNtpDummyModulesName[];
extern const char kNtpDummyModulesDescription[];
#endif

extern const char kNtpMiddleSlotPromoDismissalName[];
extern const char kNtpMiddleSlotPromoDismissalDescription[];

extern const char kNtpModulesDragAndDropName[];
extern const char kNtpModulesDragAndDropDescription[];

extern const char kNtpModulesFirstRunExperienceName[];
extern const char kNtpModulesFirstRunExperienceDescription[];

extern const char kNtpModulesName[];
extern const char kNtpModulesDescription[];

extern const char kNtpModulesRedesignedName[];
extern const char kNtpModulesRedesignedDescription[];

extern const char kNtpModulesRedesignedLayoutName[];
extern const char kNtpModulesRedesignedLayoutDescription[];

extern const char kNtpPhotosModuleOptInTitleName[];
extern const char kNtpPhotosModuleOptInTitleDescription[];

extern const char kNtpPhotosModuleOptInArtWorkName[];
extern const char kNtpPhotosModuleOptInArtWorkDescription[];

extern const char kNtpPhotosModuleName[];
extern const char kNtpPhotosModuleDescription[];

extern const char kNtpPhotosModuleSoftOptOutName[];
extern const char kNtpPhotosModuleSoftOptOutDescription[];

extern const char kNtpRealboxMatchOmniboxThemeName[];
extern const char kNtpRealboxMatchOmniboxThemeDescription[];

extern const char kNtpRealboxMatchSearchboxThemeName[];
extern const char kNtpRealboxMatchSearchboxThemeDescription[];

extern const char kNtpRealboxPedalsName[];
extern const char kNtpRealboxPedalsDescription[];

extern const char kNtpRealboxSuggestionAnswersName[];
extern const char kNtpRealboxSuggestionAnswersDescription[];

extern const char kNtpRealboxTailSuggestName[];
extern const char kNtpRealboxTailSuggestDescription[];

extern const char kNtpRealboxUseGoogleGIconName[];
extern const char kNtpRealboxUseGoogleGIconDescription[];

extern const char kNtpRecipeTasksModuleName[];
extern const char kNtpRecipeTasksModuleDescription[];

extern const char kNtpSafeBrowsingModuleName[];
extern const char kNtpSafeBrowsingModuleDescription[];

extern const char kEnableReaderModeName[];
extern const char kEnableReaderModeDescription[];

extern const char kHappinessTrackingSurveysForDesktopDemoName[];
extern const char kHappinessTrackingSurveysForDesktopDemoDescription[];

extern const char kOmniboxDriveSuggestionsName[];
extern const char kOmniboxDriveSuggestionsDescriptions[];

extern const char kOmniboxExperimentalKeywordModeName[];
extern const char kOmniboxExperimentalKeywordModeDescription[];

extern const char kScreenAIName[];
extern const char kScreenAIDescription[];

extern const char kSCTAuditingName[];
extern const char kSCTAuditingDescription[];

extern const char kSharingDesktopSharePreviewName[];
extern const char kSharingDesktopSharePreviewDescription[];

extern const char kWebAuthenticationPermitEnterpriseAttestationName[];
extern const char kWebAuthenticationPermitEnterpriseAttestationDescription[];

#endif  // BUILDFLAG(IS_ANDROID)


// Random platform combinations -----------------------------------------------

#if BUILDFLAG(IS_ANDROID)

extern const char kDesktopDetailedLanguageSettingsName[];
extern const char kDesktopDetailedLanguageSettingsDescription[];

extern const char kQuickCommandsName[];
extern const char kQuickCommandsDescription[];

#endif  // BUILDFLAG(IS_WIN) || BUILDFLAG(IS_MAC) || BUILDFLAG(IS_LINUX) ||
        // defined (OS_FUCHSIA)

}  // namespace flag_descriptions

#endif  // CHROME_BROWSER_FLAG_DESCRIPTIONS_H_
