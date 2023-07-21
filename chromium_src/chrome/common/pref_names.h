#ifndef MISES_COMMON_PREF_NAMES_H_
#define MISES_COMMON_PREF_NAMES_H_

#include "src/chrome/common/pref_names.h"

namespace prefs {

#if BUILDFLAG(IS_ANDROID)
extern const char kLiveCaptionEnabled[];
extern const char kLiveCaptionLanguageCode[];
#endif
#if BUILDFLAG(IS_ANDROID)
extern const char kPinnedTabs[];
#endif  // !BUILDFLAG(IS_ANDROID)
#if BUILDFLAG(IS_ANDROID)
extern const char kPrintPreviewUseSystemDefaultPrinter[];
extern const char kUserDataSnapshotRetentionLimit[];
#endif
#if BUILDFLAG(IS_ANDROID)
extern const char kHasSeenWelcomePage[];
extern const char kManagedAccountsSigninRestriction[];
extern const char kManagedAccountsSigninRestrictionScopeMachine[];
#endif
#if BUILDFLAG(IS_ANDROID)
extern const char kManagedSerialAllowAllPortsForUrls[];
extern const char kManagedSerialAllowUsbDevicesForUrls[];
extern const char kManagedWebHidAllowAllDevicesForUrls[];
extern const char kManagedWebHidAllowDevicesForUrls[];
extern const char kManagedWebHidAllowDevicesWithHidUsagesForUrls[];
#endif  // !BUILDFLAG(IS_ANDROID)

#if BUILDFLAG(IS_ANDROID)
extern const char kAutofillAssistantOnDesktopEnabled[];
#endif  // !BUILDFLAG(IS_ANDROID)

#if BUILDFLAG(IS_ANDROID)
#if !BUILDFLAG(IS_CHROMEOS_ASH)
extern const char kCommandLineFlagSecurityWarningsEnabled[];
#endif
extern const char kPromotionalTabsEnabled[];
extern const char kSuppressUnsupportedOSWarning[];
extern const char kWasRestarted[];
#endif  // !BUILDFLAG(IS_ANDROID)


#if BUILDFLAG(IS_ANDROID)
extern const char kNtpCustomBackgroundDict[];
extern const char kNtpCustomBackgroundLocalToDevice[];
extern const char kNtpCustomizeChromeButtonOpenCount[];
extern const char kNtpDisabledModules[];
extern const char kNtpModulesOrder[];
extern const char kNtpModulesVisible[];
extern const char kNtpModulesShownCount[];
extern const char kNtpModulesFirstShownTime[];
extern const char kNtpModulesFreVisible[];
extern const char kNtpPromoBlocklist[];
extern const char kNtpPromoVisible[];
extern const char kNtpSearchSuggestionsBlocklist[];
extern const char kNtpSearchSuggestionsImpressions[];
extern const char kNtpSearchSuggestionsOptOut[];
#endif 

#if BUILDFLAG(IS_ANDROID)
extern const char kDiceSigninUserMenuPromoCount[];
#endif

#if BUILDFLAG(IS_ANDROID)
extern const char kShowCastIconInToolbar[];
#endif  // !BUILDFLAG(IS_ANDROID)

#if BUILDFLAG(IS_ANDROID)
extern const char kRelaunchNotification[];
extern const char kRelaunchNotificationPeriod[];
extern const char kRelaunchWindow[];
#endif  // !BUILDFLAG(IS_ANDROID)

#if BUILDFLAG(IS_ANDROID)
extern const char kAttemptedToEnableAutoupdate[];

extern const char kMediaGalleriesUniqueId[];
extern const char kMediaGalleriesRememberedGalleries[];
#endif  // !BUILDFLAG(IS_ANDROID)

#if BUILDFLAG(IS_ANDROID)
extern const char kCloudExtensionRequestEnabled[];
extern const char kCloudExtensionRequestIds[];
#endif

#if BUILDFLAG(IS_ANDROID)
extern const char kSharedArrayBufferUnrestrictedAccessAllowed[];
extern const char kAutoplayAllowed[];
extern const char kAutoplayAllowlist[];
extern const char kBlockAutoplayEnabled[];
#endif
#if BUILDFLAG(IS_ANDROID)
extern const char kHatsSurveyMetadata[];
#endif  // !BUILDFLAG(IS_ANDROID)


#if BUILDFLAG(IS_ANDROID)
extern const char kCaretBrowsingEnabled[];
extern const char kShowCaretBrowsingDialog[];
#endif


#if BUILDFLAG(IS_ANDROID)
extern const char kCartModuleHidden[];
extern const char kCartModuleWelcomeSurfaceShownTimes[];
extern const char kCartDiscountAcknowledged[];
extern const char kCartDiscountEnabled[];
extern const char kCartUsedDiscounts[];
extern const char kCartDiscountLastFetchedTime[];
extern const char kCartDiscountConsentShown[];
extern const char kDiscountConsentDecisionMadeIn[];
extern const char kDiscountConsentDismissedIn[];
extern const char kDiscountConsentLastDimissedTime[];
extern const char kDiscountConsentLastShownInVariation[];
extern const char kDiscountConsentPastDismissedCount[];
extern const char kDiscountConsentShowInterest[];
extern const char kDiscountConsentShowInterestIn[];
#endif


#if BUILDFLAG(IS_ANDROID)
extern const char kFetchKeepaliveDurationOnShutdown[];
#endif

#if BUILDFLAG(IS_ANDROID)
extern const char kDeviceAttributesAllowedForOrigins[];
#endif


#if BUILDFLAG(IS_ANDROID)
extern const char kLastWhatsNewVersion[];
#endif

#if BUILDFLAG(IS_ANDROID)
extern const char kLensRegionSearchEnabled[];
extern const char kSidePanelHorizontalAlignment[];
extern const char kSidePanelCompanionEntryPinnedToToolbar[];
extern const char kLensDesktopNTPSearchEnabled[];
#endif

#if BUILDFLAG(IS_ANDROID)
extern const char kHighEfficiencyChipExpandedCount[];

extern const char kShouldShowPriceTrackFUEBubble[];
extern const char kShouldShowSidePanelBookmarkTab[];
#endif


extern const char kExtensionsUIDefaultEVMWallet[];

}  // namespace prefs

#endif  // CHROME_COMMON_PREF_NAMES_H_
