#include "mises/browser/browser_context_keyed_service_factories.h"
#include "chrome/browser/apps/app_service/app_service_proxy_factory.h"
#include "chrome/browser/browsing_data/chrome_browsing_data_lifetime_manager_factory.h"
#include "chrome/browser/cart/cart_service_factory.h"
#include "chrome/browser/commerce/coupons/coupon_service_factory.h"
#include "chrome/browser/feedback/feedback_uploader_factory_chrome.h"
#include "chrome/browser/media/router/discovery/access_code/access_code_cast_sink_service_factory.h"
#include "chrome/browser/metrics/desktop_session_duration/desktop_profile_session_durations_service_factory.h"
#include "chrome/browser/performance_manager/persistence/site_data/site_data_cache_facade_factory.h"
#include "chrome/browser/profiles/profile_theme_update_service_factory.h"
#include "chrome/browser/search/instant_service_factory.h"
#include "chrome/browser/storage/storage_notification_service_factory.h"
#include "chrome/browser/ui/global_error/global_error_service_factory.h"
#include "chrome/browser/ui/media_router/media_router_ui_service_factory.h"
#include "chrome/browser/usb/usb_chooser_context_factory.h"
#include "components/commerce/core/proto/cart_db_content.pb.h"
#include "components/commerce/core/proto/coupon_db_content.pb.h"
#include "chrome/browser/chrome_browser_main_extra_parts.h"

#include "chrome/browser/profiles/chrome_browser_main_extra_parts_profiles.h"

#define PreProfileInit PreProfileInit_Chromium
#include "src/chrome/browser/profiles/chrome_browser_main_extra_parts_profiles.cc"
#undef PreProfileInit


void ChromeBrowserMainExtraPartsProfiles::
    EnsureBrowserContextKeyedServiceFactoriesBuiltAndroid() {

  LOG(INFO) << "EnsureBrowserContextKeyedServiceFactoriesBuiltAndroid Begin";
  AboutSigninInternalsFactory::GetInstance();
  AboutThisSiteServiceFactory::GetInstance();
  AccountConsistencyModeManagerFactory::GetInstance();
  AccountInvestigatorFactory::GetInstance();
  AccountReconcilorFactory::GetInstance();
  AdaptiveQuietNotificationPermissionUiEnabler::Factory::GetInstance();

  autofill::PersonalDataManagerFactory::GetInstance();
  autofill::AutofillOfferManagerFactory::GetInstance();
  autofill::MerchantPromoCodeManagerFactory::GetInstance();

  BookmarkModelFactory::GetInstance();
  BookmarkUndoServiceFactory::GetInstance();
  if (breadcrumbs::IsEnabled())
    BreadcrumbManagerKeyedServiceFactory::GetInstance();
  browser_sync::UserEventServiceFactory::GetInstance();
  BrowsingDataHistoryObserverService::Factory::GetInstance();
  browsing_topics::BrowsingTopicsServiceFactory::GetInstance();

#if BUILDFLAG(ENABLE_CAPTIVE_PORTAL_DETECTION)
  CaptivePortalServiceFactory::GetInstance();
#endif

#if BUILDFLAG(IS_ANDROID)
  if (base::FeatureList::IsEnabled(commerce::kCommerceMerchantViewer))
    MerchantViewerDataManagerFactory::GetInstance();
#endif
  CertificateReportingServiceFactory::GetInstance();

  ChromeSigninClientFactory::GetInstance();
  ClientHintsFactory::GetInstance();
  ConsentAuditorFactory::GetInstance();
  CookieSettingsFactory::GetInstance();

#if BUILDFLAG(ENABLE_DICE_SUPPORT)
  DiceWebSigninInterceptorFactory::GetInstance();
#endif
  DomainDiversityReporterFactory::GetInstance();
  dom_distiller::DomDistillerServiceFactory::GetInstance();
  DownloadCoreServiceFactory::GetInstance();
  BackgroundDownloadServiceFactory::GetInstance();
#if BUILDFLAG(ENABLE_SESSION_SERVICE)
  ExitTypeServiceFactory::GetInstance();
#endif
#if BUILDFLAG(IS_ANDROID)
  FastCheckoutCapabilitiesFetcherFactory::GetInstance();
#endif
  FaviconServiceFactory::GetInstance();
  feature_engagement::TrackerFactory::GetInstance();

  FindBarStateFactory::GetInstance();
#if !BUILDFLAG(IS_CHROMEOS_ASH)
  GAIAInfoUpdateServiceFactory::GetInstance();
#endif

  HistoryServiceFactory::GetInstance();

  HostContentSettingsMapFactory::GetInstance();
  HttpsEngagementServiceFactory::GetInstance();
  IdentityManagerFactory::EnsureFactoryAndDependeeFactoriesBuilt();
  InMemoryURLIndexFactory::GetInstance();

  LanguageModelManagerFactory::GetInstance();
  login_detection::LoginDetectionKeyedServiceFactory::GetInstance();

#if BUILDFLAG(IS_ANDROID)
  MediaDrmOriginIdManagerFactory::GetInstance();
#endif
  if (MediaEngagementService::IsEnabled())
    MediaEngagementServiceFactory::GetInstance();

  if (base::FeatureList::IsEnabled(media::kUseMediaHistoryStore))
    media_history::MediaHistoryKeyedServiceFactory::GetInstance();
  media_router::ChromeLocalPresentationManagerFactory::GetInstance();
  media_router::ChromeMediaRouterFactory::GetInstance();


  ModelTypeStoreServiceFactory::GetInstance();

  NotifierStateTrackerFactory::GetInstance();

  OptimizationGuideKeyedServiceFactory::GetInstance();
  if (optimization_guide::switches::ShouldValidateModel())
    optimization_guide::ModelValidatorKeyedServiceFactory::GetInstance();
  page_load_metrics::PageLoadMetricsMemoryTrackerFactory::GetInstance();
  ProfilePasswordStoreFactory::GetInstance();
  PermissionAuditingServiceFactory::GetInstance();
  SessionProtoDBFactory<
      persisted_state_db::PersistedStateContentProto>::GetInstance();
#if BUILDFLAG(IS_ANDROID)
  PinnedTabServiceFactory::GetInstance();
#endif
#if BUILDFLAG(ENABLE_PLUGINS)
  PluginPrefsFactory::GetInstance();
#endif
  PrefMetricsService::Factory::GetInstance();
  PrefsTabHelper::GetServiceInstance();

#if BUILDFLAG(IS_ANDROID)
  SessionProtoDBFactory<commerce_subscription_db::
                            CommerceSubscriptionContentProto>::GetInstance();
#endif
#if BUILDFLAG(IS_ANDROID)
  SessionProtoDBFactory<
      merchant_signal_db::MerchantSignalContentProto>::GetInstance();
#endif

  policy::UserCloudPolicyInvalidatorFactory::GetInstance();
#if !BUILDFLAG(IS_CHROMEOS_ASH)
  policy::UserPolicySigninServiceFactory::GetInstance();
#endif

#if !BUILDFLAG(IS_CHROMEOS_ASH)
  enterprise_reporting::CloudProfileReportingServiceFactory::GetInstance();
#endif
#if BUILDFLAG(BUILD_WITH_TFLITE_LIB)
  if (base::FeatureList::IsEnabled(
          permissions::features::kPermissionOnDeviceNotificationPredictions)) {
    PredictionModelHandlerProviderFactory::GetInstance();
  }
#endif  // BUILDFLAG(BUILD_WITH_TFLITE_LIB)

  PrivacySandboxServiceFactory::GetInstance();
  PrivacySandboxSettingsFactory::GetInstance();

  ProfileNetworkContextServiceFactory::GetInstance();


  ProtocolHandlerRegistryFactory::GetInstance();

  ReadingListModelFactory::GetInstance();


  RendererUpdaterFactory::GetInstance();


#if BUILDFLAG(FULL_SAFE_BROWSING)
  safe_browsing::AdvancedProtectionStatusManagerFactory::GetInstance();
  safe_browsing::ExtensionTelemetryServiceFactory::GetInstance();
#endif

  SCTReportingServiceFactory::GetInstance();
#if BUILDFLAG(IS_ANDROID)
  SearchPermissionsService::Factory::GetInstance();
#endif
  //segmentation_platform::SegmentationPlatformServiceFactory::GetInstance();
  send_tab_to_self::SendTabToSelfClientServiceFactory::GetInstance();
#if BUILDFLAG(ENABLE_SESSION_SERVICE)
  SessionServiceFactory::GetInstance();
  SessionDataServiceFactory::GetInstance();
#endif

  commerce::ShoppingServiceFactory::GetInstance();
  ShortcutsBackendFactory::GetInstance();
  SigninProfileAttributesUpdaterFactory::GetInstance();
#if BUILDFLAG(ENABLE_DICE_SUPPORT) || BUILDFLAG(IS_CHROMEOS_LACROS)
  SigninManagerFactory::GetInstance();
#endif
#if BUILDFLAG(ENABLE_SPELLCHECK)
  SpellcheckServiceFactory::GetInstance();
#endif


  TabRestoreServiceFactory::GetInstance();
  safe_browsing::TailoredSecurityServiceFactory::GetInstance();
  TemplateURLFetcherFactory::GetInstance();
  TemplateURLServiceFactory::GetInstance();

#if BUILDFLAG(IS_ANDROID)
  thin_webview::android::ChromeThinWebViewInitializer::Initialize();
#endif

  translate::TranslateRankerFactory::GetInstance();

  UrlLanguageHistogramFactory::GetInstance();


  WebDataServiceFactory::GetInstance();
  webrtc_event_logging::WebRtcEventLogManagerKeyedServiceFactory::GetInstance();

  LOG(INFO) << "EnsureBrowserContextKeyedServiceFactoriesBuiltAndroid End";
}

void ChromeBrowserMainExtraPartsProfiles::PreProfileInit() {
 #if BUILDFLAG(IS_ANDROID)
  EnsureBrowserContextKeyedServiceFactoriesBuilt();
  InstantServiceFactory::GetInstance();
  PinnedTabServiceFactory::GetInstance();
  ThemeServiceFactory::GetInstance();
#else
  PreProfileInit_Chromium();
#endif

  mises::EnsureBrowserContextKeyedServiceFactoriesBuiltExtra();
}
