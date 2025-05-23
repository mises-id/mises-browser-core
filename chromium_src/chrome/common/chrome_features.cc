#include "src/chrome/common/chrome_features.cc"

#include "base/feature_override.h"

namespace features {

#if BUILDFLAG(IS_ANDROID)

OVERRIDE_FEATURE_DEFAULT_STATES({{
    {kSafetyHub, base::FEATURE_ENABLED_BY_DEFAULT},
}});

// Enables OS Integration sub managers to execute the
// registration/unregistration functionality and write the new OS states to the
// DB.
BASE_FEATURE(kOsIntegrationSubManagers,
             "OsIntegrationSubManagers",
             base::FEATURE_ENABLED_BY_DEFAULT);
const base::FeatureParam<OsIntegrationSubManagersStage>::Option
    sub_manager_stages[] = {
        {OsIntegrationSubManagersStage::kWriteConfig, "write_config"},
        {OsIntegrationSubManagersStage::kExecuteAndWriteConfig,
         "execute_and_write_config"}};
const base::FeatureParam<OsIntegrationSubManagersStage>
    kOsIntegrationSubManagersStageParam{
        &kOsIntegrationSubManagers, "stage",
        OsIntegrationSubManagersStage::kWriteConfig, &sub_manager_stages};
#endif

#if BUILDFLAG(IS_ANDROID)
// Enables or disables the Autofill survey triggered by opening a prompt to
// save address info.
BASE_FEATURE(kAutofillAddressSurvey,
             "AutofillAddressSurvey",
             base::FEATURE_DISABLED_BY_DEFAULT);
// Enables or disables the Autofill survey triggered by opening a prompt to
// save credit card info.
BASE_FEATURE(kAutofillCardSurvey,
             "AutofillCardSurvey",
             base::FEATURE_DISABLED_BY_DEFAULT);
// Enables or disables the Autofill survey triggered by opening a prompt to
// save password info.
BASE_FEATURE(kAutofillPasswordSurvey,
             "AutofillPasswordSurvey",
             base::FEATURE_DISABLED_BY_DEFAULT);
#endif


#if BUILDFLAG(IS_ANDROID)
// Enables migration of apps that are loaded erroneously but installed
// correctly by policy in the web app system.
BASE_FEATURE(kMigrateErrorLoadedPolicyApps,
             "MigrateErrorLoadedPolicyApps",
             base::FEATURE_ENABLED_BY_DEFAULT);

// Whether to allow installed-by-default web apps to be installed or not.
BASE_FEATURE(kPreinstalledWebAppInstallation,
             "DefaultWebAppInstallation",
             base::FEATURE_ENABLED_BY_DEFAULT);
#endif


#if BUILDFLAG(IS_ANDROID)
// Lazy initialize IndividualSettings for extensions from enterprise policy
// that are not installed.
BASE_FEATURE(kExtensionDeferredIndividualSettings,
             "ExtensionDeferredIndividualSettings",
             base::FEATURE_ENABLED_BY_DEFAULT);
#endif


#if BUILDFLAG(IS_ANDROID)
// Enables or disables the Happiness Tracking System demo mode for Desktop
// Chrome.
BASE_FEATURE(kHappinessTrackingSurveysForDesktopDemo,
             "HappinessTrackingSurveysForDesktopDemo",
             base::FEATURE_DISABLED_BY_DEFAULT);

BASE_FEATURE(kHappinessTrackingSurveysConfiguration,
             "HappinessTrackingSurveysConfiguration",
             base::FEATURE_ENABLED_BY_DEFAULT);

const base::FeatureParam<std::string> kHappinessTrackingSurveysHostedUrl{
    &kHappinessTrackingSurveysConfiguration, "custom-url",
    "https://www.google.com/chrome/hats/index_m129.html"};
    
// Enables or disables the Happiness Tracking System for COEP issues in Chrome
// DevTools on Desktop.
BASE_FEATURE(kHaTSDesktopDevToolsIssuesCOEP,
             "HaTSDesktopDevToolsIssuesCOEP",
             base::FEATURE_DISABLED_BY_DEFAULT);

// Enables or disables the Happiness Tracking System for Mixed Content issues in
// Chrome DevTools on Desktop.
BASE_FEATURE(kHaTSDesktopDevToolsIssuesMixedContent,
             "HaTSDesktopDevToolsIssuesMixedContent",
             base::FEATURE_DISABLED_BY_DEFAULT);

// Enables or disables the Happiness Tracking System for same-site cookies
// issues in Chrome DevTools on Desktop.
BASE_FEATURE(kHappinessTrackingSurveysForDesktopDevToolsIssuesCookiesSameSite,
             "HappinessTrackingSurveysForDesktopDevToolsIssuesCookiesSameSite",
             base::FEATURE_DISABLED_BY_DEFAULT);

// Enables or disables the Happiness Tracking System for Heavy Ad issues in
// Chrome DevTools on Desktop.
BASE_FEATURE(kHaTSDesktopDevToolsIssuesHeavyAd,
             "HaTSDesktopDevToolsIssuesHeavyAd",
             base::FEATURE_DISABLED_BY_DEFAULT);

// Enables or disables the Happiness Tracking System for CSP issues in Chrome
// DevTools on Desktop.
BASE_FEATURE(kHaTSDesktopDevToolsIssuesCSP,
             "HaTSDesktopDevToolsIssuesCSP",
             base::FEATURE_DISABLED_BY_DEFAULT);

// Enables or disables the Happiness Tracking System for Chrome extensions page.
BASE_FEATURE(kHappinessTrackingSurveysExtensionsSafetyHub,
             "HappinessTrackingSurveysExtensionsSafetyHub",
             base::FEATURE_DISABLED_BY_DEFAULT);
const base::FeatureParam<base::TimeDelta>
    kHappinessTrackingSurveysExtensionsSafetyHubTime{
        &kHappinessTrackingSurveysExtensionsSafetyHub, "settings-time",
        base::Seconds(10)};

// Enables or disables the Happiness Tracking System for Desktop Privacy Guide.
BASE_FEATURE(kHappinessTrackingSurveysForDesktopPrivacyGuide,
             "HappinessTrackingSurveysForDesktopPrivacyGuide",
             base::FEATURE_DISABLED_BY_DEFAULT);
const base::FeatureParam<base::TimeDelta>
    kHappinessTrackingSurveysForDesktopPrivacyGuideTime{
        &kHappinessTrackingSurveysForDesktopPrivacyGuide, "settings-time",
        base::Seconds(20)};

// Enables or disables the Happiness Tracking System for Desktop Privacy
// Sandbox.
BASE_FEATURE(kHappinessTrackingSurveysForDesktopPrivacySandbox,
             "HappinessTrackingSurveysForDesktopPrivacySandbox",
             base::FEATURE_DISABLED_BY_DEFAULT);
const base::FeatureParam<base::TimeDelta>
    kHappinessTrackingSurveysForDesktopPrivacySandboxTime{
        &kHappinessTrackingSurveysForDesktopPrivacySandbox, "settings-time",
        base::Seconds(20)};

// Enables or disables the Happiness Tracking System for Desktop Chrome
// Settings.
BASE_FEATURE(kHappinessTrackingSurveysForDesktopSettings,
             "HappinessTrackingSurveysForDesktopSettings",
             base::FEATURE_DISABLED_BY_DEFAULT);

// Enables or disables the Happiness Tracking System for Desktop Chrome
// Privacy Settings.
BASE_FEATURE(kHappinessTrackingSurveysForDesktopSettingsPrivacy,
             "HappinessTrackingSurveysForDesktopSettingsPrivacy",
             base::FEATURE_DISABLED_BY_DEFAULT);
const base::FeatureParam<bool>
    kHappinessTrackingSurveysForDesktopSettingsPrivacyNoSandbox{
        &kHappinessTrackingSurveysForDesktopSettingsPrivacy, "no-sandbox",
        false};
const base::FeatureParam<bool>
    kHappinessTrackingSurveysForDesktopSettingsPrivacyNoGuide{
        &kHappinessTrackingSurveysForDesktopSettingsPrivacy, "no-guide", false};
const base::FeatureParam<base::TimeDelta>
    kHappinessTrackingSurveysForDesktopSettingsPrivacyTime{
        &kHappinessTrackingSurveysForDesktopSettingsPrivacy, "settings-time",
        base::Seconds(20)};

// Enables or disables the Happiness Tracking System for Desktop Chrome
// NTP Modules.
BASE_FEATURE(kHappinessTrackingSurveysForDesktopNtpModules,
             "HappinessTrackingSurveysForDesktopNtpModules",
             base::FEATURE_DISABLED_BY_DEFAULT);

BASE_FEATURE(kHappinessTrackingSurveysForNtpPhotosOptOut,
             "HappinessTrackingSurveysForrNtpPhotosOptOut",
             base::FEATURE_DISABLED_BY_DEFAULT);

// Enables or disables the Happiness Tracking System for Wallpaper Search.
BASE_FEATURE(kHappinessTrackingSurveysForWallpaperSearch,
             "HappinessTrackingSurveysForWallpaperSearch",
             base::FEATURE_DISABLED_BY_DEFAULT);

// Enables or disables the Happiness Tracking System for Chrome What's New.
BASE_FEATURE(kHappinessTrackingSurveysForDesktopWhatsNew,
             "HappinessTrackingSurveysForDesktopWhatsNew",
             base::FEATURE_DISABLED_BY_DEFAULT);
const base::FeatureParam<base::TimeDelta>
    kHappinessTrackingSurveysForDesktopWhatsNewTime{
        &kHappinessTrackingSurveysForDesktopWhatsNew, "whats-new-time",
        base::Seconds(20)};

// Happiness tracking surveys for the M1 Privacy Sandbox settings.
BASE_FEATURE(kHappinessTrackingSurveysForDesktopM1AdPrivacyPage,
             "HappinessTrackingSurveysForDesktopM1AdPrivacyPage",
             base::FEATURE_DISABLED_BY_DEFAULT);
const base::FeatureParam<base::TimeDelta>
    kHappinessTrackingSurveysForDesktopM1AdPrivacyPageTime{
        &kHappinessTrackingSurveysForDesktopM1AdPrivacyPage, "settings-time",
        base::Seconds(20)};
BASE_FEATURE(kHappinessTrackingSurveysForDesktopM1TopicsSubpage,
             "HappinessTrackingSurveysForDesktopM1TopicsSubpage",
             base::FEATURE_DISABLED_BY_DEFAULT);
const base::FeatureParam<base::TimeDelta>
    kHappinessTrackingSurveysForDesktopM1TopicsSubpageTime{
        &kHappinessTrackingSurveysForDesktopM1TopicsSubpage, "settings-time",
        base::Seconds(20)};
BASE_FEATURE(kHappinessTrackingSurveysForDesktopM1FledgeSubpage,
             "HappinessTrackingSurveysForDesktopM1FledgeSubpage",
             base::FEATURE_DISABLED_BY_DEFAULT);
const base::FeatureParam<base::TimeDelta>
    kHappinessTrackingSurveysForDesktopM1FledgeSubpageTime{
        &kHappinessTrackingSurveysForDesktopM1FledgeSubpage, "settings-time",
        base::Seconds(20)};
BASE_FEATURE(kHappinessTrackingSurveysForDesktopM1AdMeasurementSubpage,
             "HappinessTrackingSurveysForDesktopM1AdMeasurementSubpage",
             base::FEATURE_DISABLED_BY_DEFAULT);
const base::FeatureParam<base::TimeDelta>
    kHappinessTrackingSurveysForDesktopM1AdMeasurementSubpageTime{
        &kHappinessTrackingSurveysForDesktopM1AdMeasurementSubpage,
        "settings-time", base::Seconds(20)};

// Enables or disables the Happiness Tracking System for Chrome security page.
BASE_FEATURE(kHappinessTrackingSurveysForSecurityPage,
             "HappinessTrackingSurveysForSecurityPage",
             base::FEATURE_DISABLED_BY_DEFAULT);
const base::FeatureParam<base::TimeDelta>
    kHappinessTrackingSurveysForSecurityPageTime{
        &kHappinessTrackingSurveysForSecurityPage, "security-page-time",
        base::Seconds(15)};
extern const base::FeatureParam<std::string>
    kHappinessTrackingSurveysForSecurityPageTriggerId{
        &kHappinessTrackingSurveysForSecurityPage, "security-page-trigger-id",
        ""};

#endif  // !BUILDFLAG(IS_ANDROID)


#if BUILDFLAG(IS_ANDROID)
BASE_FEATURE(kOnConnectNative,
             "OnConnectNative",
             base::FEATURE_DISABLED_BY_DEFAULT);
#endif

#if BUILDFLAG(IS_ANDROID)
// Enables surveying of users of Trust & Safety features with HaTS.
BASE_FEATURE(kTrustSafetySentimentSurvey,
             "TrustSafetySentimentSurvey",
             base::FEATURE_DISABLED_BY_DEFAULT);
// The minimum and maximum time after a user has interacted with a Trust and
// Safety they are eligible to be surveyed.
const base::FeatureParam<base::TimeDelta>
    kTrustSafetySentimentSurveyMinTimeToPrompt{
        &kTrustSafetySentimentSurvey, "min-time-to-prompt", base::Minutes(2)};
const base::FeatureParam<base::TimeDelta>
    kTrustSafetySentimentSurveyMaxTimeToPrompt{
        &kTrustSafetySentimentSurvey, "max-time-to-prompt", base::Minutes(60)};
// The maximum and minimum range for the random number of NTPs that the user
// must at least visit after interacting with a Trust and Safety feature to be
// eligible for a survey.
const base::FeatureParam<int> kTrustSafetySentimentSurveyNtpVisitsMinRange{
    &kTrustSafetySentimentSurvey, "ntp-visits-min-range", 2};
const base::FeatureParam<int> kTrustSafetySentimentSurveyNtpVisitsMaxRange{
    &kTrustSafetySentimentSurvey, "ntp-visits-max-range", 4};
// The feature area probabilities for each feature area considered as part of
// the Trust & Safety sentiment survey.
const base::FeatureParam<double>
    kTrustSafetySentimentSurveyPrivacySettingsProbability{
        &kTrustSafetySentimentSurvey, "privacy-settings-probability", 0.6};
const base::FeatureParam<double>
    kTrustSafetySentimentSurveyTrustedSurfaceProbability{
        &kTrustSafetySentimentSurvey, "trusted-surface-probability", 0.4};
const base::FeatureParam<double>
    kTrustSafetySentimentSurveyTransactionsProbability{
        &kTrustSafetySentimentSurvey, "transactions-probability", 0.05};
const base::FeatureParam<double>
    kTrustSafetySentimentSurveyPrivacySandbox3ConsentAcceptProbability{
        &kTrustSafetySentimentSurvey,
        "privacy-sandbox-3-consent-accept-probability", 0.1};
const base::FeatureParam<double>
    kTrustSafetySentimentSurveyPrivacySandbox3ConsentDeclineProbability{
        &kTrustSafetySentimentSurvey,
        "privacy-sandbox-3-consent-decline-probability", 0.5};
const base::FeatureParam<double>
    kTrustSafetySentimentSurveyPrivacySandbox3NoticeDismissProbability{
        &kTrustSafetySentimentSurvey,
        "privacy-sandbox-3-notice-dismiss-probability", 0.5};
const base::FeatureParam<double>
    kTrustSafetySentimentSurveyPrivacySandbox3NoticeOkProbability{
        &kTrustSafetySentimentSurvey, "privacy-sandbox-3-notice-ok-probability",
        0.05};
const base::FeatureParam<double>
    kTrustSafetySentimentSurveyPrivacySandbox3NoticeSettingsProbability{
        &kTrustSafetySentimentSurvey,
        "privacy-sandbox-3-notice-settings-probability", 0.8};
const base::FeatureParam<double>
    kTrustSafetySentimentSurveyPrivacySandbox3NoticeLearnMoreProbability{
        &kTrustSafetySentimentSurvey,
        "privacy-sandbox-3-notice-learn-more-probability", 0.2};
const base::FeatureParam<double>
    kTrustSafetySentimentSurveyPrivacySandbox4ConsentAcceptProbability{
        &kTrustSafetySentimentSurvey,
        "privacy-sandbox-4-consent-accept-probability", 0.0};
const base::FeatureParam<double>
    kTrustSafetySentimentSurveyPrivacySandbox4ConsentDeclineProbability{
        &kTrustSafetySentimentSurvey,
        "privacy-sandbox-4-consent-decline-probability", 0.0};
const base::FeatureParam<double>
    kTrustSafetySentimentSurveyPrivacySandbox4NoticeOkProbability{
        &kTrustSafetySentimentSurvey, "privacy-sandbox-4-notice-ok-probability",
        0.0};
const base::FeatureParam<double>
    kTrustSafetySentimentSurveyPrivacySandbox4NoticeSettingsProbability{
        &kTrustSafetySentimentSurvey,
        "privacy-sandbox-4-notice-settings-probability", 0.0};
// The HaTS trigger IDs, which determine which survey is delivered from the HaTS
// backend.
const base::FeatureParam<std::string>
    kTrustSafetySentimentSurveyPrivacySettingsTriggerId{
        &kTrustSafetySentimentSurvey, "privacy-settings-trigger-id", ""};
const base::FeatureParam<std::string>
    kTrustSafetySentimentSurveyTrustedSurfaceTriggerId{
        &kTrustSafetySentimentSurvey, "trusted-surface-trigger-id", ""};
extern const base::FeatureParam<std::string>
    kTrustSafetySentimentSurveyTransactionsTriggerId{
        &kTrustSafetySentimentSurvey, "transactions-trigger-id", ""};
extern const base::FeatureParam<std::string>
    kTrustSafetySentimentSurveyPrivacySandbox3ConsentAcceptTriggerId{
        &kTrustSafetySentimentSurvey,
        "privacy-sandbox-3-consent-accept-trigger-id", ""};
extern const base::FeatureParam<std::string>
    kTrustSafetySentimentSurveyPrivacySandbox3ConsentDeclineTriggerId{
        &kTrustSafetySentimentSurvey,
        "privacy-sandbox-3-consent-decline-trigger-id", ""};
extern const base::FeatureParam<std::string>
    kTrustSafetySentimentSurveyPrivacySandbox3NoticeDismissTriggerId{
        &kTrustSafetySentimentSurvey,
        "privacy-sandbox-3-notice-dismiss-trigger-id", ""};
extern const base::FeatureParam<std::string>
    kTrustSafetySentimentSurveyPrivacySandbox3NoticeOkTriggerId{
        &kTrustSafetySentimentSurvey, "privacy-sandbox-3-notice-ok-trigger-id",
        ""};
extern const base::FeatureParam<std::string>
    kTrustSafetySentimentSurveyPrivacySandbox3NoticeSettingsTriggerId{
        &kTrustSafetySentimentSurvey,
        "privacy-sandbox-3-notice-settings-trigger-id", ""};
extern const base::FeatureParam<std::string>
    kTrustSafetySentimentSurveyPrivacySandbox3NoticeLearnMoreTriggerId{
        &kTrustSafetySentimentSurvey,
        "privacy-sandbox-3-notice-learn-more-trigger-id", ""};
extern const base::FeatureParam<std::string>
    kTrustSafetySentimentSurveyPrivacySandbox4ConsentAcceptTriggerId{
        &kTrustSafetySentimentSurvey,
        "privacy-sandbox-4-consent-accept-trigger-id", ""};
extern const base::FeatureParam<std::string>
    kTrustSafetySentimentSurveyPrivacySandbox4ConsentDeclineTriggerId{
        &kTrustSafetySentimentSurvey,
        "privacy-sandbox-4-consent-decline-trigger-id", ""};
extern const base::FeatureParam<std::string>
    kTrustSafetySentimentSurveyPrivacySandbox4NoticeOkTriggerId{
        &kTrustSafetySentimentSurvey, "privacy-sandbox-4-notice-ok-trigger-id",
        ""};
extern const base::FeatureParam<std::string>
    kTrustSafetySentimentSurveyPrivacySandbox4NoticeSettingsTriggerId{
        &kTrustSafetySentimentSurvey,
        "privacy-sandbox-4-notice-settings-trigger-id", ""};
// The time the user must remain on settings after interacting with a privacy
// setting to be considered.
const base::FeatureParam<base::TimeDelta>
    kTrustSafetySentimentSurveyPrivacySettingsTime{&kTrustSafetySentimentSurvey,
                                                   "privacy-settings-time",
                                                   base::Seconds(20)};
// The time the user must have the Trusted Surface bubble open to be considered.
// Alternatively the user can interact with the bubble, in which case this time
// is irrelevant.
const base::FeatureParam<base::TimeDelta>
    kTrustSafetySentimentSurveyTrustedSurfaceTime{
        &kTrustSafetySentimentSurvey, "trusted-surface-time", base::Seconds(5)};
// The time the user must remain on settings after visiting the password
// manager page.
const base::FeatureParam<base::TimeDelta>
    kTrustSafetySentimentSurveyTransactionsPasswordManagerTime{
        &kTrustSafetySentimentSurvey, "transactions-password-manager-time",
        base::Seconds(20)};

#endif




// TrustSafetySentimentSurveyV2
#if BUILDFLAG(IS_ANDROID)
// Enables the second version of the sentiment survey for users of Trust &
// Safety features, using HaTS.
BASE_FEATURE(kTrustSafetySentimentSurveyV2,
             "TrustSafetySentimentSurveyV2",
             base::FEATURE_DISABLED_BY_DEFAULT);
// The minimum and maximum time after a user has interacted with a Trust and
// Safety feature that they are eligible to be surveyed.
const base::FeatureParam<base::TimeDelta>
    kTrustSafetySentimentSurveyV2MinTimeToPrompt{
        &kTrustSafetySentimentSurveyV2, "min-time-to-prompt", base::Minutes(2)};
const base::FeatureParam<base::TimeDelta>
    kTrustSafetySentimentSurveyV2MaxTimeToPrompt{&kTrustSafetySentimentSurveyV2,
                                                 "max-time-to-prompt",
                                                 base::Minutes(60)};
// The maximum and minimum range for the random number of NTPs that the user
// must at least visit after interacting with a Trust and Safety feature to be
// eligible for a survey.
const base::FeatureParam<int> kTrustSafetySentimentSurveyV2NtpVisitsMinRange{
    &kTrustSafetySentimentSurveyV2, "ntp-visits-min-range", 2};
const base::FeatureParam<int> kTrustSafetySentimentSurveyV2NtpVisitsMaxRange{
    &kTrustSafetySentimentSurveyV2, "ntp-visits-max-range", 4};
// The minimum time that has to pass in the current session before a user can be
// eligible to be considered for the baseline control group.
const base::FeatureParam<base::TimeDelta>
    kTrustSafetySentimentSurveyV2MinSessionTime{
        &kTrustSafetySentimentSurveyV2, "min-session-time", base::Seconds(30)};
// The feature area probabilities for each feature area considered as part of
// the Trust & Safety sentiment survey.
// TODO(crbug.com/1382134): Calculate initial probabilities and remove 0.0
const base::FeatureParam<double>
    kTrustSafetySentimentSurveyV2BrowsingDataProbability{
        &kTrustSafetySentimentSurveyV2, "browsing-data-probability", 0.0};
const base::FeatureParam<double>
    kTrustSafetySentimentSurveyV2ControlGroupProbability{
        &kTrustSafetySentimentSurveyV2, "control-group-probability", 0.0};
const base::FeatureParam<double>
    kTrustSafetySentimentSurveyV2DownloadWarningUIProbability{
        &kTrustSafetySentimentSurveyV2, "download-warning-ui-probability", 0.0};
const base::FeatureParam<double>
    kTrustSafetySentimentSurveyV2PasswordCheckProbability{
        &kTrustSafetySentimentSurveyV2, "password-check-probability", 0.0};
const base::FeatureParam<double>
    kTrustSafetySentimentSurveyV2PasswordProtectionUIProbability{
        &kTrustSafetySentimentSurveyV2, "password-protection-ui-probability",
        0.0};
const base::FeatureParam<double>
    kTrustSafetySentimentSurveyV2SafetyCheckProbability{
        &kTrustSafetySentimentSurveyV2, "safety-check-probability", 0.0};
const base::FeatureParam<double>
    kTrustSafetySentimentSurveyV2TrustedSurfaceProbability{
        &kTrustSafetySentimentSurveyV2, "trusted-surface-probability", 0.0};
const base::FeatureParam<double>
    kTrustSafetySentimentSurveyV2PrivacyGuideProbability{
        &kTrustSafetySentimentSurveyV2, "privacy-guide-probability", 0.0};
const base::FeatureParam<double>
    kTrustSafetySentimentSurveyV2PrivacySandbox4ConsentAcceptProbability{
        &kTrustSafetySentimentSurveyV2,
        "privacy-sandbox-4-consent-accept-probability", 0.0};
const base::FeatureParam<double>
    kTrustSafetySentimentSurveyV2PrivacySandbox4ConsentDeclineProbability{
        &kTrustSafetySentimentSurveyV2,
        "privacy-sandbox-4-consent-decline-probability", 0.0};
const base::FeatureParam<double>
    kTrustSafetySentimentSurveyV2PrivacySandbox4NoticeOkProbability{
        &kTrustSafetySentimentSurveyV2,
        "privacy-sandbox-4-notice-ok-probability", 0.0};
const base::FeatureParam<double>
    kTrustSafetySentimentSurveyV2PrivacySandbox4NoticeSettingsProbability{
        &kTrustSafetySentimentSurveyV2,
        "privacy-sandbox-4-notice-settings-probability", 0.0};
const base::FeatureParam<double>
    kTrustSafetySentimentSurveyV2SafeBrowsingInterstitialProbability{
        &kTrustSafetySentimentSurveyV2,
        "safe-browsing-interstitial-probability", 0.0};
// The HaTS trigger IDs, which determine which survey is delivered from the HaTS
// backend.
const base::FeatureParam<std::string>
    kTrustSafetySentimentSurveyV2BrowsingDataTriggerId{
        &kTrustSafetySentimentSurveyV2, "browsing-data-trigger-id", ""};
const base::FeatureParam<std::string>
    kTrustSafetySentimentSurveyV2ControlGroupTriggerId{
        &kTrustSafetySentimentSurveyV2, "control-group-trigger-id", ""};
extern const base::FeatureParam<std::string>
    kTrustSafetySentimentSurveyV2DownloadWarningUITriggerId{
        &kTrustSafetySentimentSurveyV2, "download-warning-ui-trigger-id", ""};
const base::FeatureParam<std::string>
    kTrustSafetySentimentSurveyV2PasswordCheckTriggerId{
        &kTrustSafetySentimentSurveyV2, "password-check-trigger-id", ""};
extern const base::FeatureParam<std::string>
    kTrustSafetySentimentSurveyV2PasswordProtectionUITriggerId{
        &kTrustSafetySentimentSurveyV2, "password-protection-ui-trigger-id",
        ""};
const base::FeatureParam<std::string>
    kTrustSafetySentimentSurveyV2SafetyCheckTriggerId{
        &kTrustSafetySentimentSurveyV2, "safety-check-trigger-id", ""};
const base::FeatureParam<std::string>
    kTrustSafetySentimentSurveyV2SafetyHubInteractionTriggerId{
        &kTrustSafetySentimentSurveyV2, "safety-hub-interaction-trigger-id",
        ""};
const base::FeatureParam<std::string>
    kTrustSafetySentimentSurveyV2SafetyHubNotificationTriggerId{
        &kTrustSafetySentimentSurveyV2, "safety-hub-notification-trigger-id",
        ""};
const base::FeatureParam<std::string>
    kTrustSafetySentimentSurveyV2TrustedSurfaceTriggerId{
        &kTrustSafetySentimentSurveyV2, "trusted-surface-trigger-id", ""};
const base::FeatureParam<std::string>
    kTrustSafetySentimentSurveyV2PrivacyGuideTriggerId{
        &kTrustSafetySentimentSurveyV2, "privacy-guide-trigger-id", ""};
extern const base::FeatureParam<std::string>
    kTrustSafetySentimentSurveyV2PrivacySandbox4ConsentAcceptTriggerId{
        &kTrustSafetySentimentSurveyV2,
        "privacy-sandbox-4-consent-accept-trigger-id", ""};
extern const base::FeatureParam<std::string>
    kTrustSafetySentimentSurveyV2PrivacySandbox4ConsentDeclineTriggerId{
        &kTrustSafetySentimentSurveyV2,
        "privacy-sandbox-4-consent-decline-trigger-id", ""};
extern const base::FeatureParam<std::string>
    kTrustSafetySentimentSurveyV2PrivacySandbox4NoticeOkTriggerId{
        &kTrustSafetySentimentSurveyV2,
        "privacy-sandbox-4-notice-ok-trigger-id", ""};
extern const base::FeatureParam<std::string>
    kTrustSafetySentimentSurveyV2PrivacySandbox4NoticeSettingsTriggerId{
        &kTrustSafetySentimentSurveyV2,
        "privacy-sandbox-4-notice-settings-trigger-id", ""};
extern const base::FeatureParam<std::string>
    kTrustSafetySentimentSurveyV2SafeBrowsingInterstitialTriggerId{
        &kTrustSafetySentimentSurveyV2, "safe-browsing-interstitial-trigger-id",
        ""};
// The time the user must have the Trusted Surface bubble open to be considered.
// Alternatively the user can interact with the bubble, in which case this time
// is irrelevant.
const base::FeatureParam<base::TimeDelta>
    kTrustSafetySentimentSurveyV2TrustedSurfaceTime{
        &kTrustSafetySentimentSurveyV2, "trusted-surface-time",
        base::Seconds(5)};
#endif


#if BUILDFLAG(IS_ANDROID)

BASE_FEATURE(kWebAppManifestIconUpdating,
             "WebAppManifestIconUpdating",
             base::FEATURE_DISABLED_BY_DEFAULT);

BASE_FEATURE(kWebAppSyncGeneratedIconBackgroundFix,
             "WebAppSyncGeneratedIconBackgroundFix",
             base::FEATURE_ENABLED_BY_DEFAULT);

BASE_FEATURE(kWebAppSyncGeneratedIconRetroactiveFix,
             "WebAppSyncGeneratedIconRetroactiveFix",
             base::FEATURE_ENABLED_BY_DEFAULT);

BASE_FEATURE(kWebAppSyncGeneratedIconUpdateFix,
             "WebAppSyncGeneratedIconUpdateFix",
             base::FEATURE_ENABLED_BY_DEFAULT);

BASE_FEATURE(kWebAppUniversalInstall,
             "WebAppUniversalInstall",
             base::FEATURE_ENABLED_BY_DEFAULT
);
#endif  // !BUILDFLAG(IS_ANDROID)



// TrackingProtectionSentimentSurvey
#if BUILDFLAG(IS_ANDROID)

BASE_FEATURE(kTrackingProtectionSentimentSurvey,
             "TrackingProtectionSentimentSurvey",
             base::FEATURE_DISABLED_BY_DEFAULT);

extern const base::FeatureParam<double>
    kTrackingProtectionSentimentSurveyImmediateOverDelayedProbability{
        &kTrackingProtectionSentimentSurvey,
        "tracking-protection-immediate-over-delayed-probability", 0.5};

extern const base::FeatureParam<double>
    kTrackingProtectionSentimentSurveyControlImmediateProbability{
        &kTrackingProtectionSentimentSurvey,
        "tracking-protection-control-immediate-probability", 0.0};
extern const base::FeatureParam<double>
    kTrackingProtectionSentimentSurveyTreatmentImmediateProbability{
        &kTrackingProtectionSentimentSurvey,
        "tracking-protection-treatment-immediate-probability", 0.0};
extern const base::FeatureParam<double>
    kTrackingProtectionSentimentSurveyControlDelayedProbability{
        &kTrackingProtectionSentimentSurvey,
        "tracking-protection-control-delayed-probability", 0.0};
extern const base::FeatureParam<double>
    kTrackingProtectionSentimentSurveyTreatmentDelayedProbability{
        &kTrackingProtectionSentimentSurvey,
        "tracking-protection-treatment-delayed-probability", 0.0};

extern const base::FeatureParam<std::string>
    kTrackingProtectionSentimentSurveyControlImmediateTriggerId{
        &kTrackingProtectionSentimentSurvey,
        "tracking-protection-control-immediate-trigger-id", ""};
extern const base::FeatureParam<std::string>
    kTrackingProtectionSentimentSurveyTreatmentImmediateTriggerId{
        &kTrackingProtectionSentimentSurvey,
        "tracking-protection-treatment-immediate-trigger-id", ""};
extern const base::FeatureParam<std::string>
    kTrackingProtectionSentimentSurveyControlDelayedTriggerId{
        &kTrackingProtectionSentimentSurvey,
        "tracking-protection-control-delayed-trigger-id", ""};
extern const base::FeatureParam<std::string>
    kTrackingProtectionSentimentSurveyTreatmentDelayedTriggerId{
        &kTrackingProtectionSentimentSurvey,
        "tracking-protection-treatment-delayed-trigger-id", ""};
#endif


#if BUILDFLAG(IS_ANDROID)
BASE_FEATURE(kShortcutsNotAppsRevealDesktop,
             "ShortcutsNotAppsRevealDesktop",
             base::FEATURE_ENABLED_BY_DEFAULT);
#endif



#if BUILDFLAG(IS_ANDROID)
// Enables or disables the Trust Safety Sentiment Survey for Safety Hub.
BASE_FEATURE(kSafetyHubTrustSafetySentimentSurvey,
             "TrustSafetySentimentSurveyForSafetyHub",
             base::FEATURE_DISABLED_BY_DEFAULT);

// Enables or disables the A/B Experiment Survey for Safety Hub.
BASE_FEATURE(kSafetyHubHaTSOneOffSurvey,
             "SafetyHubHaTSOneOffSurvey",
             base::FEATURE_DISABLED_BY_DEFAULT);
const base::FeatureParam<std::string>
    kHatsSurveyTriggerSafetyHubOneOffExperimentControlTriggerId{
        &kSafetyHubHaTSOneOffSurvey, "safety-hub-ab-control-trigger-id", ""};
const base::FeatureParam<std::string>
    kHatsSurveyTriggerSafetyHubOneOffExperimentNotificationTriggerId{
        &kSafetyHubHaTSOneOffSurvey, "safety-hub-ab-notification-trigger-id",
        ""};
const base::FeatureParam<std::string>
    kHatsSurveyTriggerSafetyHubOneOffExperimentInteractionTriggerId{
        &kSafetyHubHaTSOneOffSurvey, "safety-hub-ab-interaction-trigger-id",
        ""};
#endif  // !BUILDFLAG(IS_ANDROID)

}  // namespace features
