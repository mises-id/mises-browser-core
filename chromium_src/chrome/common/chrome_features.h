#ifndef MISES_COMMON_CHROME_FEATURES_H_
#define MISES_COMMON_CHROME_FEATURES_H_

#include "src/chrome/common/chrome_features.h"

namespace features {
#if BUILDFLAG(IS_ANDROID) 
COMPONENT_EXPORT(CHROME_FEATURES)
extern const base::Feature kAutofillAddressSurvey;
COMPONENT_EXPORT(CHROME_FEATURES)
extern const base::Feature kAutofillCardSurvey;
COMPONENT_EXPORT(CHROME_FEATURES)
extern const base::Feature kAutofillPasswordSurvey;
#endif

#if BUILDFLAG(IS_ANDROID)
COMPONENT_EXPORT(CHROME_FEATURES)
extern const base::Feature kBlockMigratedDefaultChromeAppSync;
#endif


#if BUILDFLAG(IS_ANDROID)
COMPONENT_EXPORT(CHROME_FEATURES)
extern const base::Feature kPreinstalledWebAppInstallation;

COMPONENT_EXPORT(CHROME_FEATURES)
extern const base::Feature kPreinstalledWebAppDuplicationFixer;
#endif

#if BUILDFLAG(IS_ANDROID) 
COMPONENT_EXPORT(CHROME_FEATURES)
extern const base::Feature kChromeAppsDeprecation;
COMPONENT_EXPORT(CHROME_FEATURES)
extern const base::Feature kKeepForceInstalledPreinstalledApps;
#endif

#if true || !BUILDFLAG(IS_ANDROID)
COMPONENT_EXPORT(CHROME_FEATURES)
extern const base::Feature kEnableWebHidOnExtensionServiceWorker;
#endif

#if BUILDFLAG(IS_ANDROID)
COMPONENT_EXPORT(CHROME_FEATURES)
extern const base::Feature kExtensionDeferredIndividualSettings;
#endif

#if BUILDFLAG(IS_ANDROID)
COMPONENT_EXPORT(CHROME_FEATURES)
extern const base::Feature kHappinessTrackingSurveysForDesktopDemo;

COMPONENT_EXPORT(CHROME_FEATURES)
extern const base::Feature kHappinessTrackingSurveysForDesktopPrivacySandbox;
COMPONENT_EXPORT(CHROME_FEATURES)
extern const base::FeatureParam<base::TimeDelta>
    kHappinessTrackingSurveysForDesktopPrivacySandboxTime;

COMPONENT_EXPORT(CHROME_FEATURES)
extern const base::Feature kHappinessTrackingSurveysForDesktopSettings;

COMPONENT_EXPORT(CHROME_FEATURES)
extern const base::Feature kHappinessTrackingSurveysForDesktopSettingsPrivacy;
COMPONENT_EXPORT(CHROME_FEATURES)
extern const base::FeatureParam<bool>
    kHappinessTrackingSurveysForDesktopSettingsPrivacyNoSandbox;
COMPONENT_EXPORT(CHROME_FEATURES)
extern const base::FeatureParam<bool>
    kHappinessTrackingSurveysForDesktopSettingsPrivacyNoGuide;
COMPONENT_EXPORT(CHROME_FEATURES)
extern const base::FeatureParam<base::TimeDelta>
    kHappinessTrackingSurveysForDesktopSettingsPrivacyTime;

COMPONENT_EXPORT(CHROME_FEATURES)
extern const base::Feature kHappinessTrackingSurveysForDesktopPrivacyGuide;
COMPONENT_EXPORT(CHROME_FEATURES)
extern const base::FeatureParam<base::TimeDelta>
    kHappinessTrackingSurveysForDesktopPrivacyGuideTime;

COMPONENT_EXPORT(CHROME_FEATURES)
extern const base::Feature kHappinessTrackingSurveysForDesktopNtpModules;
COMPONENT_EXPORT(CHROME_FEATURES)
extern const base::Feature kHappinessTrackingSurveysForNtpPhotosOptOut;

COMPONENT_EXPORT(CHROME_FEATURES)
extern const base::Feature kHappinessTrackingSurveysForDesktopWhatsNew;
COMPONENT_EXPORT(CHROME_FEATURES)
extern const base::FeatureParam<base::TimeDelta>
    kHappinessTrackingSurveysForDesktopWhatsNewTime;

COMPONENT_EXPORT(CHROME_FEATURES)
extern const base::Feature kHaTSDesktopDevToolsIssuesCOEP;

COMPONENT_EXPORT(CHROME_FEATURES)
extern const base::Feature kHaTSDesktopDevToolsIssuesMixedContent;

COMPONENT_EXPORT(CHROME_FEATURES)
extern const base::Feature
    kHappinessTrackingSurveysForDesktopDevToolsIssuesCookiesSameSite;

COMPONENT_EXPORT(CHROME_FEATURES)
extern const base::Feature kHaTSDesktopDevToolsIssuesHeavyAd;

COMPONENT_EXPORT(CHROME_FEATURES)
extern const base::Feature kHaTSDesktopDevToolsIssuesCSP;
#endif


#if BUILDFLAG(IS_ANDROID)
COMPONENT_EXPORT(CHROME_FEATURES) extern const base::Feature kOnConnectNative;
#endif


#if BUILDFLAG(IS_ANDROID)
COMPONENT_EXPORT(CHROME_FEATURES)
extern const base::Feature kWebAppManifestIconUpdating;
#endif  // !BUILDFLAG(IS_ANDROID)

}  // namespace features

#endif  // CHROME_COMMON_CHROME_FEATURES_H_
