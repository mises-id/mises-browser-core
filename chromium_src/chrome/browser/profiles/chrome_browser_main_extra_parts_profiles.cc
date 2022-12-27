// Copyright 2013 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

#include "chrome/browser/profiles/chrome_browser_main_extra_parts_profiles.h"

#include <memory>
#include <utility>

#include "build/build_config.h"
#include "build/chromeos_buildflags.h"
#include "chrome/browser/accuracy_tips/accuracy_service_factory.h"
#include "chrome/browser/autocomplete/autocomplete_classifier_factory.h"
#include "chrome/browser/autocomplete/in_memory_url_index_factory.h"
#include "chrome/browser/autocomplete/shortcuts_backend_factory.h"
#include "chrome/browser/autofill/autofill_offer_manager_factory.h"
#include "chrome/browser/autofill/merchant_promo_code_manager_factory.h"
#include "chrome/browser/autofill/personal_data_manager_factory.h"
#include "chrome/browser/background/background_contents_service_factory.h"
#include "chrome/browser/bookmarks/bookmark_model_factory.h"
#include "chrome/browser/breadcrumbs/breadcrumb_manager_keyed_service_factory.h"
#include "chrome/browser/browsing_data/access_context_audit_service_factory.h"
#include "chrome/browser/browsing_data/browsing_data_history_observer_service.h"
#include "chrome/browser/browsing_data/chrome_browsing_data_remover_delegate_factory.h"
#include "chrome/browser/browsing_topics/browsing_topics_service_factory.h"
#include "chrome/browser/chrome_browser_main.h"
#include "chrome/browser/client_hints/client_hints_factory.h"
#include "chrome/browser/commerce/shopping_service_factory.h"
#include "chrome/browser/consent_auditor/consent_auditor_factory.h"
#include "chrome/browser/content_settings/cookie_settings_factory.h"
#include "chrome/browser/content_settings/host_content_settings_map_factory.h"
#include "chrome/browser/custom_handlers/protocol_handler_registry_factory.h"
#include "chrome/browser/device_api/managed_configuration_api_factory.h"
#include "chrome/browser/dom_distiller/dom_distiller_service_factory.h"
#include "chrome/browser/domain_reliability/service_factory.h"
#include "chrome/browser/download/background_download_service_factory.h"
#include "chrome/browser/download/download_core_service_factory.h"
#include "chrome/browser/engagement/site_engagement_service_factory.h"
#include "chrome/browser/enterprise/reporting/cloud_profile_reporting_service_factory.h"
#include "chrome/browser/favicon/favicon_service_factory.h"
#include "chrome/browser/favicon/history_ui_favicon_request_handler_factory.h"
#include "chrome/browser/feature_engagement/tracker_factory.h"
#include "chrome/browser/google/google_search_domain_mixing_metrics_emitter_factory.h"
#include "chrome/browser/history/domain_diversity_reporter_factory.h"
#include "chrome/browser/history/history_service_factory.h"
#include "chrome/browser/history/top_sites_factory.h"
#include "chrome/browser/language/language_model_manager_factory.h"
#include "chrome/browser/language/url_language_histogram_factory.h"
#include "chrome/browser/login_detection/login_detection_keyed_service_factory.h"
#include "chrome/browser/media/history/media_history_keyed_service_factory.h"
#include "chrome/browser/media/media_engagement_service.h"
#include "chrome/browser/media/media_engagement_service_factory.h"
#include "chrome/browser/media/router/chrome_media_router_factory.h"
#include "chrome/browser/media/router/presentation/chrome_local_presentation_manager_factory.h"
#include "chrome/browser/media/webrtc/webrtc_event_log_manager_keyed_service_factory.h"
#include "chrome/browser/media_galleries/media_galleries_preferences_factory.h"
#include "chrome/browser/net/profile_network_context_service_factory.h"
#include "chrome/browser/notifications/notifier_state_tracker_factory.h"
#include "chrome/browser/optimization_guide/model_validator_keyed_service_factory.h"
#include "chrome/browser/optimization_guide/optimization_guide_keyed_service_factory.h"
#include "chrome/browser/page_info/about_this_site_service_factory.h"
#include "chrome/browser/page_load_metrics/observers/https_engagement_metrics/https_engagement_service_factory.h"
#include "chrome/browser/page_load_metrics/page_load_metrics_memory_tracker_factory.h"
#include "chrome/browser/password_manager/password_store_factory.h"
#include "chrome/browser/permissions/adaptive_quiet_notification_permission_ui_enabler.h"
#include "chrome/browser/permissions/last_tab_standing_tracker_factory.h"
#include "chrome/browser/permissions/permission_auditing_service_factory.h"
#include "chrome/browser/persisted_state_db/session_proto_db_factory.h"
#include "chrome/browser/plugins/plugin_prefs_factory.h"
#include "chrome/browser/policy/cloud/user_cloud_policy_invalidator_factory.h"
#include "chrome/browser/predictors/autocomplete_action_predictor_factory.h"
#include "chrome/browser/predictors/loading_predictor_factory.h"
#include "chrome/browser/predictors/predictor_database_factory.h"
#include "chrome/browser/prefs/pref_metrics_service.h"
#include "chrome/browser/preloading/prefetch/no_state_prefetch/no_state_prefetch_link_manager_factory.h"
#include "chrome/browser/preloading/prefetch/no_state_prefetch/no_state_prefetch_manager_factory.h"
#include "chrome/browser/privacy/privacy_metrics_service_factory.h"
#include "chrome/browser/privacy_sandbox/privacy_sandbox_service_factory.h"
#include "chrome/browser/privacy_sandbox/privacy_sandbox_settings_factory.h"
#include "chrome/browser/profiles/renderer_updater_factory.h"
#include "chrome/browser/safe_browsing/certificate_reporting_service_factory.h"
#include "chrome/browser/safe_browsing/tailored_security/tailored_security_service_factory.h"
#include "chrome/browser/search_engines/template_url_fetcher_factory.h"
#include "chrome/browser/search_engines/template_url_service_factory.h"
#include "chrome/browser/segmentation_platform/segmentation_platform_service_factory.h"
#include "chrome/browser/send_tab_to_self/send_tab_to_self_client_service_factory.h"
#include "chrome/browser/sessions/session_data_service_factory.h"
#include "chrome/browser/sessions/tab_restore_service_factory.h"
#include "chrome/browser/sharing/sharing_service_factory.h"
#include "chrome/browser/sharing_hub/sharing_hub_service_factory.h"
#include "chrome/browser/signin/about_signin_internals_factory.h"
#include "chrome/browser/signin/account_consistency_mode_manager_factory.h"
#include "chrome/browser/signin/account_investigator_factory.h"
#include "chrome/browser/signin/account_reconcilor_factory.h"
#include "chrome/browser/signin/chrome_signin_client_factory.h"
#include "chrome/browser/signin/identity_manager_factory.h"
#include "chrome/browser/signin/signin_profile_attributes_updater_factory.h"
#include "chrome/browser/ssl/sct_reporting_service_factory.h"
#include "chrome/browser/sync/model_type_store_service_factory.h"
#include "chrome/browser/sync/sync_service_factory.h"
#include "chrome/browser/sync/user_event_service_factory.h"
#include "chrome/browser/themes/theme_service_factory.h"
#include "chrome/browser/translate/translate_ranker_factory.h"
#include "chrome/browser/ui/app_list/app_list_syncable_service_factory.h"
#include "chrome/browser/ui/find_bar/find_bar_state_factory.h"
#include "chrome/browser/ui/prefs/prefs_tab_helper.h"
#include "chrome/browser/ui/read_later/reading_list_model_factory.h"
#include "chrome/browser/ui/tabs/pinned_tab_service_factory.h"
#include "chrome/browser/ui/toolbar/toolbar_actions_model_factory.h"
#include "chrome/browser/ui/ui_features.h"
#include "chrome/browser/ui/webui/ntp/ntp_resource_cache_factory.h"
#include "chrome/browser/ui/webui/signin/login_ui_service_factory.h"
#include "chrome/browser/undo/bookmark_undo_service_factory.h"
#include "chrome/browser/unified_consent/unified_consent_service_factory.h"
#include "chrome/browser/web_data_service_factory.h"
#include "chrome/common/buildflags.h"
#include "chrome/common/chrome_features.h"
#include "components/breadcrumbs/core/breadcrumbs_status.h"
#include "components/captive_portal/core/buildflags.h"
#include "components/commerce/core/proto/persisted_state_db_content.pb.h"
#include "components/optimization_guide/core/optimization_guide_switches.h"
#include "components/optimization_guide/machine_learning_tflite_buildflags.h"
#include "components/permissions/features.h"
#include "components/reading_list/features/reading_list_switches.h"
#include "components/safe_browsing/buildflags.h"
#include "components/signin/public/base/signin_buildflags.h"
#include "components/site_engagement/content/site_engagement_service.h"
#include "components/spellcheck/spellcheck_buildflags.h"
#include "extensions/buildflags/buildflags.h"
#include "media/base/media_switches.h"
#include "ppapi/buildflags/buildflags.h"
#include "printing/buildflags/buildflags.h"

#if BUILDFLAG(IS_ANDROID)
#include "chrome/browser/android/explore_sites/explore_sites_service_factory.h"
#include "chrome/browser/android/reading_list/reading_list_manager_factory.h"
#include "chrome/browser/android/reading_list/reading_list_notification_service_factory.h"
#include "chrome/browser/android/search_permissions/search_permissions_service.h"
#include "chrome/browser/android/thin_webview/chrome_thin_webview_initializer.h"
#include "chrome/browser/commerce/merchant_viewer/merchant_viewer_data_manager_factory.h"
#include "chrome/browser/media/android/cdm/media_drm_origin_id_manager_factory.h"
#include "components/commerce/core/commerce_feature_list.h"
#include "components/commerce/core/proto/commerce_subscription_db_content.pb.h"
#include "components/commerce/core/proto/merchant_signal_db_content.pb.h"
#endif
#if (true)
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
#include "chrome/browser/ui/user_education/user_education_service_factory.h"
#include "chrome/browser/usb/usb_chooser_context_factory.h"
#include "components/commerce/core/proto/cart_db_content.pb.h"
#include "components/commerce/core/proto/coupon_db_content.pb.h"
#endif

#if BUILDFLAG(IS_CHROMEOS_ASH)
#include "ash/constants/ash_features.h"
#include "chrome/browser/ash/account_manager/account_apps_availability_factory.h"
#include "chrome/browser/ash/browser_context_keyed_service_factories.h"
#include "chrome/browser/ash/login/security_token_session_controller_factory.h"
#include "chrome/browser/ash/system_extensions/api/window_management/cros_window_management_context_factory.h"
#include "chrome/browser/ash/system_extensions/system_extensions_provider_factory.h"
#include "chrome/browser/ash/system_web_apps/system_web_app_manager_factory.h"
#include "chrome/browser/nearby_sharing/nearby_sharing_service_factory.h"
#else
#include "chrome/browser/policy/cloud/user_policy_signin_service_factory.h"
#include "chrome/browser/profiles/gaia_info_update_service_factory.h"
#endif

#if BUILDFLAG(IS_CHROMEOS)
#include "chrome/browser/apps/intent_helper/supported_links_infobar_prefs_service_factory.h"
#include "chrome/browser/chromeos/policy/dlp/dlp_rules_manager_factory.h"
#include "chrome/browser/policy/messaging_layer/util/manual_test_heartbeat_event_factory.h"
#include "chrome/browser/policy/networking/policy_cert_service_factory.h"
#include "chrome/browser/policy/networking/user_network_configuration_updater_factory.h"
#endif

#if BUILDFLAG(IS_WIN)
#include "chrome/browser/profile_resetter/triggered_profile_resetter_factory.h"
#endif

#if BUILDFLAG(ENABLE_CAPTIVE_PORTAL_DETECTION)
#include "chrome/browser/captive_portal/captive_portal_service_factory.h"
#endif

#if BUILDFLAG(ENABLE_DICE_SUPPORT)
#include "chrome/browser/signin/dice_web_signin_interceptor_factory.h"
#endif

#if BUILDFLAG(ENABLE_DICE_SUPPORT) || BUILDFLAG(IS_CHROMEOS_LACROS)
#include "chrome/browser/signin/signin_manager_factory.h"
#endif

#if BUILDFLAG(ENABLE_EXTENSIONS)
#include "apps/browser_context_keyed_service_factories.h"
#include "chrome/browser/apps/platform_apps/api/browser_context_keyed_service_factories.h"
#include "chrome/browser/apps/platform_apps/browser_context_keyed_service_factories.h"
#include "chrome/browser/extensions/browser_context_keyed_service_factories.h"
#include "chrome/browser/ui/web_applications/web_app_metrics_factory.h"
#include "chrome/browser/web_applications/adjustments/web_app_adjustments.h"
#include "chrome/browser/web_applications/web_app_provider_factory.h"
#include "extensions/browser/browser_context_keyed_service_factories.h"

#if BUILDFLAG(IS_CHROMEOS)
#include "chrome/browser/extensions/chromeos_browser_context_keyed_service_factories.h"
#endif
#endif

#if BUILDFLAG(ENABLE_SESSION_SERVICE)
#include "chrome/browser/sessions/exit_type_service_factory.h"
#include "chrome/browser/sessions/session_service_factory.h"
#endif

#if BUILDFLAG(ENABLE_SPELLCHECK)
#include "chrome/browser/spellchecker/spellcheck_factory.h"
#endif

#if BUILDFLAG(ENABLE_SUPERVISED_USERS)
#include "chrome/browser/supervised_user/supervised_user_metrics_service_factory.h"
#include "chrome/browser/supervised_user/supervised_user_service_factory.h"
#endif

#if BUILDFLAG(FULL_SAFE_BROWSING)
#include "chrome/browser/safe_browsing/advanced_protection_status_manager_factory.h"
#include "chrome/browser/safe_browsing/extension_telemetry/extension_telemetry_service_factory.h"
#endif

#if BUILDFLAG(IS_CHROMEOS_LACROS)
#include "chrome/browser/chromeos/extensions/login_screen/login/cleanup/cleanup_manager_lacros_factory.h"
#include "chrome/browser/lacros/account_manager/profile_account_manager_factory.h"
#include "chrome/browser/lacros/cert/cert_db_initializer_factory.h"
#include "chrome/browser/lacros/remote_apps/remote_apps_proxy_lacros_factory.h"
#include "chrome/browser/ui/startup/lacros_first_run_service.h"
#endif

#if BUILDFLAG(BUILD_WITH_TFLITE_LIB)
#include "chrome/browser/permissions/prediction_model_handler_factory.h"
#endif

#if BUILDFLAG(IS_MAC)
#include "chrome/browser/ui/cocoa/screentime/history_bridge_factory.h"
#include "chrome/browser/ui/cocoa/screentime/screentime_features.h"
#endif

#if BUILDFLAG(IS_WIN) || BUILDFLAG(IS_MAC) || BUILDFLAG(IS_LINUX)
#include "chrome/browser/enterprise/idle/idle_service_factory.h"
#endif

namespace chrome {

void AddProfilesExtraParts(ChromeBrowserMainParts* main_parts) {
  main_parts->AddParts(std::make_unique<ChromeBrowserMainExtraPartsProfiles>());
}

}  // namespace chrome

ChromeBrowserMainExtraPartsProfiles::ChromeBrowserMainExtraPartsProfiles() =
    default;

ChromeBrowserMainExtraPartsProfiles::~ChromeBrowserMainExtraPartsProfiles() =
    default;

// This method gets the instance of each ServiceFactory. We do this so that
// each ServiceFactory initializes itself and registers its dependencies with
// the global PreferenceDependencyManager. We need to have a complete
// dependency graph when we create a profile so we can dispatch the profile
// creation message to the services that want to create their services at
// profile creation time.
//
// TODO(erg): This needs to be something else. I don't think putting every
// FooServiceFactory here will scale or is desirable long term.
//
// static
void ChromeBrowserMainExtraPartsProfiles::
    EnsureBrowserContextKeyedServiceFactoriesBuilt(bool full_init) {
//LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << full_init;
#if BUILDFLAG(ENABLE_EXTENSIONS)
if (full_init){
   //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 1";
  apps::EnsureBrowserContextKeyedServiceFactoriesBuilt();
   //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 2";
  chrome_apps::EnsureBrowserContextKeyedServiceFactoriesBuilt();
   //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 3";
  chrome_apps::api::EnsureBrowserContextKeyedServiceFactoriesBuilt();
   //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 4";
  chrome_extensions::EnsureBrowserContextKeyedServiceFactoriesBuilt();
#if BUILDFLAG(IS_CHROMEOS)
  chromeos_extensions::EnsureBrowserContextKeyedServiceFactoriesBuilt();
#endif
   //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 5";
  extensions::EnsureBrowserContextKeyedServiceFactoriesBuilt();
}
#endif
#if BUILDFLAG(IS_CHROMEOS_ASH)
  ash::login::SecurityTokenSessionControllerFactory::GetInstance();
  ash::EnsureBrowserContextKeyedServiceFactoriesBuilt();
#endif
   //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 6";
  AboutSigninInternalsFactory::GetInstance();
   //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 7";
  AboutThisSiteServiceFactory::GetInstance();
   //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 8";
  AccessContextAuditServiceFactory::GetInstance();
   //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 9";
  AccountConsistencyModeManagerFactory::GetInstance();
   //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 10";
  AccountInvestigatorFactory::GetInstance();
   //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 11";
  AccountReconcilorFactory::GetInstance();
#if !BUILDFLAG(IS_ANDROID)
  AccuracyServiceFactory::GetInstance();
#endif
   //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 12";
  AdaptiveQuietNotificationPermissionUiEnabler::Factory::GetInstance();
#if BUILDFLAG(IS_CHROMEOS_ASH)
  app_list::AppListSyncableServiceFactory::GetInstance();
  ash::AccountAppsAvailabilityFactory::GetInstance();
  ash::SystemWebAppManagerFactory::GetInstance();
#endif
#if !BUILDFLAG(IS_ANDROID)
  apps::AppServiceProxyFactory::GetInstance();
#endif
#if BUILDFLAG(IS_CHROMEOS)
  apps::SupportedLinksInfoBarPrefsServiceFactory::GetInstance();
#endif
   //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 13";
  if (full_init) AutocompleteClassifierFactory::GetInstance();
   //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 14";
  autofill::PersonalDataManagerFactory::GetInstance();
   //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 15";
  autofill::AutofillOfferManagerFactory::GetInstance();
   //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 16";
  autofill::MerchantPromoCodeManagerFactory::GetInstance();
#if BUILDFLAG(ENABLE_BACKGROUND_CONTENTS)
   //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 17";
  BackgroundContentsServiceFactory::GetInstance();
#endif
   //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 18";
  BookmarkModelFactory::GetInstance();
   //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 19";
  BookmarkUndoServiceFactory::GetInstance();
   //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 20";
  if (breadcrumbs::IsEnabled())
    BreadcrumbManagerKeyedServiceFactory::GetInstance();
    //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 21";
  browser_sync::UserEventServiceFactory::GetInstance();
  //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 22";
  BrowsingDataHistoryObserverService::Factory::GetInstance();
  //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 23";
  browsing_topics::BrowsingTopicsServiceFactory::GetInstance();
#if BUILDFLAG(IS_CHROMEOS_LACROS)
  chromeos::CleanupManagerLacrosFactory::GetInstance();
  chromeos::RemoteAppsProxyLacrosFactory::GetInstance();
#endif
#if BUILDFLAG(ENABLE_CAPTIVE_PORTAL_DETECTION)
  //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 24";
  CaptivePortalServiceFactory::GetInstance();
#endif
#if !BUILDFLAG(IS_ANDROID)
  CartServiceFactory::GetInstance();
#endif
#if BUILDFLAG(IS_ANDROID)
  //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 25";
  if (base::FeatureList::IsEnabled(commerce::kCommerceMerchantViewer))
    MerchantViewerDataManagerFactory::GetInstance();
#endif
#if BUILDFLAG(IS_CHROMEOS_LACROS)
  CertDbInitializerFactory::GetInstance();
#endif
  //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 26";
  CertificateReportingServiceFactory::GetInstance();
#if !BUILDFLAG(IS_ANDROID)
  ChromeBrowsingDataLifetimeManagerFactory::GetInstance();
#endif
  //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 27";
  if (full_init) ChromeBrowsingDataRemoverDelegateFactory::GetInstance();
  //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 28";
  ChromeSigninClientFactory::GetInstance();
  //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 29";
  ClientHintsFactory::GetInstance();
  //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 30";
  ConsentAuditorFactory::GetInstance();
  //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 31";
  CookieSettingsFactory::GetInstance();
  //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 32";
#if !BUILDFLAG(IS_ANDROID)
  CouponServiceFactory::GetInstance();
#endif
#if BUILDFLAG(ENABLE_DICE_SUPPORT)
  //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 33";
  DiceWebSigninInterceptorFactory::GetInstance();
#endif
  //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 34";
  DomainDiversityReporterFactory::GetInstance();
  //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 35";
  dom_distiller::DomDistillerServiceFactory::GetInstance();
  //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 36";
  DownloadCoreServiceFactory::GetInstance();
  //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 37";
  BackgroundDownloadServiceFactory::GetInstance();
#if BUILDFLAG(ENABLE_SESSION_SERVICE)
  //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 38";
  ExitTypeServiceFactory::GetInstance();
#endif
#if BUILDFLAG(IS_ANDROID)
  //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 39";
  explore_sites::ExploreSitesServiceFactory::GetInstance();
#endif
  //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 40";
  FaviconServiceFactory::GetInstance();
  //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 41";
  feature_engagement::TrackerFactory::GetInstance();
#if !BUILDFLAG(IS_ANDROID)

  feedback::FeedbackUploaderFactoryChrome::GetInstance();
#endif
  //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 42";
  FindBarStateFactory::GetInstance();
#if !BUILDFLAG(IS_CHROMEOS_ASH)
  //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 43";
  GAIAInfoUpdateServiceFactory::GetInstance();
#endif
#if !BUILDFLAG(IS_ANDROID)
  GlobalErrorServiceFactory::GetInstance();
#endif
  //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 44";
  GoogleSearchDomainMixingMetricsEmitterFactory::GetInstance();
  //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 45";
  HistoryServiceFactory::GetInstance();
  //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 46";
  if (full_init) HistoryUiFaviconRequestHandlerFactory::GetInstance();
  //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 47";
  HostContentSettingsMapFactory::GetInstance();
  //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 48";
  HttpsEngagementServiceFactory::GetInstance();
  //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 49";
  IdentityManagerFactory::EnsureFactoryAndDependeeFactoriesBuilt();
  //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 50";
  InMemoryURLIndexFactory::GetInstance();
  //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 51";
#if true || !BUILDFLAG(IS_ANDROID)
  InstantServiceFactory::GetInstance();
#endif
#if BUILDFLAG(IS_CHROMEOS_LACROS)
  LacrosFirstRunServiceFactory::GetInstance();
#endif
  //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 52";
  LanguageModelManagerFactory::GetInstance();
  //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 53";
  if (base::FeatureList::IsEnabled(
          permissions::features::kOneTimeGeolocationPermission)) {
    LastTabStandingTrackerFactory::GetInstance();
  }
//LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 54";
  login_detection::LoginDetectionKeyedServiceFactory::GetInstance();
#if !BUILDFLAG(IS_ANDROID)
  LoginUIServiceFactory::GetInstance();
  ManagedConfigurationAPIFactory::GetInstance();
#endif
#if BUILDFLAG(IS_ANDROID)
  //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 55";
  MediaDrmOriginIdManagerFactory::GetInstance();
#endif
  //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 56";
  if (MediaEngagementService::IsEnabled())
    MediaEngagementServiceFactory::GetInstance();
#if !BUILDFLAG(IS_ANDROID)
  MediaGalleriesPreferencesFactory::GetInstance();
#endif
  //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 57";
  if (base::FeatureList::IsEnabled(media::kUseMediaHistoryStore))
    media_history::MediaHistoryKeyedServiceFactory::GetInstance();
    //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 58";
  media_router::ChromeLocalPresentationManagerFactory::GetInstance();
  //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 59";
  media_router::ChromeMediaRouterFactory::GetInstance();
#if !BUILDFLAG(IS_ANDROID)
  if (base::FeatureList::IsEnabled(features::kAccessCodeCastUI))
    media_router::AccessCodeCastSinkServiceFactory::GetInstance();
  media_router::MediaRouterUIServiceFactory::GetInstance();
#endif
// TODO(crbug.com/1052397): Revisit the macro expression once build flag switch
// of lacros-chrome is complete.
#if BUILDFLAG(IS_WIN) || BUILDFLAG(IS_MAC) || \
    (BUILDFLAG(IS_LINUX) || BUILDFLAG(IS_CHROMEOS_LACROS))
  metrics::DesktopProfileSessionDurationsServiceFactory::GetInstance();
#endif
#if BUILDFLAG(IS_WIN) || BUILDFLAG(IS_MAC) || BUILDFLAG(IS_LINUX)
  enterprise_idle::IdleServiceFactory::GetInstance();
#endif
  ModelTypeStoreServiceFactory::GetInstance();
#if BUILDFLAG(IS_CHROMEOS_ASH)
  NearbySharingServiceFactory::GetInstance();
#endif
  NotifierStateTrackerFactory::GetInstance();
#if !BUILDFLAG(IS_ANDROID)
  NTPResourceCacheFactory::GetInstance();
#endif
  //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 60";
  OptimizationGuideKeyedServiceFactory::GetInstance();
  //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 61";
  if (optimization_guide::switches::ShouldValidateModel())
    optimization_guide::ModelValidatorKeyedServiceFactory::GetInstance();
    //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 62";
  page_load_metrics::PageLoadMetricsMemoryTrackerFactory::GetInstance();
  //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 63";
  PasswordStoreFactory::GetInstance();
  //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 64";
  PermissionAuditingServiceFactory::GetInstance();
  //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 65";
  SessionProtoDBFactory<
      persisted_state_db::PersistedStateContentProto>::GetInstance();
#if true || !BUILDFLAG(IS_ANDROID)
      //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 66";
  PinnedTabServiceFactory::GetInstance();
#endif
#if BUILDFLAG(ENABLE_PLUGINS)
  PluginPrefsFactory::GetInstance();
#endif
  //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 67";
  PrefMetricsService::Factory::GetInstance();
  //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 68";
  PrefsTabHelper::GetServiceInstance();
#if !BUILDFLAG(IS_ANDROID)
  SessionProtoDBFactory<cart_db::ChromeCartContentProto>::GetInstance();
  SessionProtoDBFactory<coupon_db::CouponContentProto>::GetInstance();
#endif
#if BUILDFLAG(IS_ANDROID)
  //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 69";
  SessionProtoDBFactory<commerce_subscription_db::
                            CommerceSubscriptionContentProto>::GetInstance();
#endif
#if BUILDFLAG(IS_ANDROID)
			     //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 70";
  SessionProtoDBFactory<
      merchant_signal_db::MerchantSignalContentProto>::GetInstance();
#endif
#if BUILDFLAG(IS_CHROMEOS)
  policy::DlpRulesManagerFactory::GetInstance();
  policy::PolicyCertServiceFactory::GetInstance();
  policy::UserNetworkConfigurationUpdaterFactory::GetInstance();
#endif
  //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 71";
  policy::UserCloudPolicyInvalidatorFactory::GetInstance();
#if !BUILDFLAG(IS_CHROMEOS_ASH)
  policy::UserPolicySigninServiceFactory::GetInstance();
#endif

#if !BUILDFLAG(IS_CHROMEOS_ASH)
  //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 72";
  enterprise_reporting::CloudProfileReportingServiceFactory::GetInstance();
#endif
#if BUILDFLAG(BUILD_WITH_TFLITE_LIB)
  //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 73";
  if (base::FeatureList::IsEnabled(
          permissions::features::kPermissionOnDeviceNotificationPredictions)) {
    PredictionModelHandlerFactory::GetInstance();
  }
#endif  // BUILDFLAG(BUILD_WITH_TFLITE_LIB)
if (full_init) {
	//LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 74";
  predictors::AutocompleteActionPredictorFactory::GetInstance();
  //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 75";
  predictors::LoadingPredictorFactory::GetInstance();
  //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 76";
  predictors::PredictorDatabaseFactory::GetInstance();
  //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 77";
  prerender::NoStatePrefetchLinkManagerFactory::GetInstance();
  //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 78";
  prerender::NoStatePrefetchManagerFactory::GetInstance();
}
//LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 79";
  PrivacyMetricsServiceFactory::GetInstance();
  //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 80";
  PrivacySandboxServiceFactory::GetInstance();
  //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 81";
  PrivacySandboxSettingsFactory::GetInstance();
#if BUILDFLAG(IS_CHROMEOS_LACROS)
  ProfileAccountManagerFactory::GetInstance();
#endif
  //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 82";
  ProfileNetworkContextServiceFactory::GetInstance();
  //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 83";
  SyncServiceFactory::GetInstance();
#if !BUILDFLAG(IS_ANDROID)
  ProfileThemeUpdateServiceFactory::GetInstance();
#endif
  //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 84";
  ProtocolHandlerRegistryFactory::GetInstance();

  //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 85";
  ReadingListModelFactory::GetInstance();

#if BUILDFLAG(IS_ANDROID)
  //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 86";
  ReadingListManagerFactory::GetInstance();
  //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 87";
  ReadingListNotificationServiceFactory::GetInstance();
#endif

  //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 88";
  RendererUpdaterFactory::GetInstance();

#if BUILDFLAG(IS_CHROMEOS)
  reporting::ManualTestHeartbeatEventFactory::GetInstance();
#endif

#if !BUILDFLAG(IS_ANDROID)
  performance_manager::SiteDataCacheFacadeFactory::GetInstance();
#endif
#if BUILDFLAG(FULL_SAFE_BROWSING)
  //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 89";
  safe_browsing::AdvancedProtectionStatusManagerFactory::GetInstance();
  safe_browsing::ExtensionTelemetryServiceFactory::GetInstance();
#endif
#if BUILDFLAG(IS_MAC)
  if (screentime::IsScreenTimeEnabled())
    screentime::HistoryBridgeFactory::GetInstance();
#endif
    //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 90";
  SCTReportingServiceFactory::GetInstance();
#if BUILDFLAG(IS_ANDROID)
  //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 91";
  SearchPermissionsService::Factory::GetInstance();
#endif
  //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 92";
  segmentation_platform::SegmentationPlatformServiceFactory::GetInstance();
  //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 93";
  send_tab_to_self::SendTabToSelfClientServiceFactory::GetInstance();
#if BUILDFLAG(ENABLE_SESSION_SERVICE)
  //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 94";
  SessionServiceFactory::GetInstance();
  //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 95";
  SessionDataServiceFactory::GetInstance();
#endif
  //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 96";
  if (full_init) SharingServiceFactory::GetInstance();
#if !BUILDFLAG(IS_ANDROID)
  sharing_hub::SharingHubServiceFactory::GetInstance();
#endif
  //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 97";
  commerce::ShoppingServiceFactory::GetInstance();
  //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 98";
  ShortcutsBackendFactory::GetInstance();
  //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 99";
  SigninProfileAttributesUpdaterFactory::GetInstance();
  //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 100";
  if (site_engagement::SiteEngagementService::IsEnabled())
    site_engagement::SiteEngagementServiceFactory::GetInstance();
#if BUILDFLAG(ENABLE_DICE_SUPPORT) || BUILDFLAG(IS_CHROMEOS_LACROS)
    //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 101";
  SigninManagerFactory::GetInstance();
#endif
#if BUILDFLAG(ENABLE_SPELLCHECK)
  //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 102";
  SpellcheckServiceFactory::GetInstance();
#endif
#if !BUILDFLAG(IS_ANDROID)
  StorageNotificationServiceFactory::GetInstance();
#endif
#if BUILDFLAG(ENABLE_SUPERVISED_USERS)
  //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 103";
  SupervisedUserMetricsServiceFactory::GetInstance();
  //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 104";
  if (full_init) SupervisedUserServiceFactory::GetInstance();
#endif
#if BUILDFLAG(IS_CHROMEOS_ASH)
  if (base::FeatureList::IsEnabled(ash::features::kSystemExtensions)) {
    ash::SystemExtensionsProviderFactory::GetInstance();
    ash::CrosWindowManagementContextFactory::GetInstance();
  }
#endif
//LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 105";
  TabRestoreServiceFactory::GetInstance();
  //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 106";
  safe_browsing::TailoredSecurityServiceFactory::GetInstance();
  //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 107";
  TemplateURLFetcherFactory::GetInstance();
  //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 108";
  TemplateURLServiceFactory::GetInstance();
#if true || !BUILDFLAG(IS_ANDROID)
  //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 109";
  ThemeServiceFactory::GetInstance();
#endif
#if BUILDFLAG(IS_ANDROID)
  //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 110";
  thin_webview::android::ChromeThinWebViewInitializer::Initialize();
#endif
#if BUILDFLAG(ENABLE_EXTENSIONS)
  //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 111";
  if (full_init) ToolbarActionsModelFactory::GetInstance();
#endif
  //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 112";
  TopSitesFactory::GetInstance();
  //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 113";
  translate::TranslateRankerFactory::GetInstance();
#if BUILDFLAG(IS_WIN)
  TriggeredProfileResetterFactory::GetInstance();
#endif
  //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 114";
  UnifiedConsentServiceFactory::GetInstance();
  //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 115";
  UrlLanguageHistogramFactory::GetInstance();
#if !BUILDFLAG(IS_ANDROID)
  UsbChooserContextFactory::GetInstance();
  UserEducationServiceFactory::GetInstance();
#endif
#if BUILDFLAG(ENABLE_EXTENSIONS)
if (full_init) {
	//LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 116";
  web_app::WebAppMetricsFactory::GetInstance();
  //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 117";
  web_app::WebAppProviderFactory::GetInstance();
  //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 118";
  web_app::WebAppAdjustmentsFactory::GetInstance();
}
#endif
//LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 119";
  WebDataServiceFactory::GetInstance();
  //LOG(ERROR) << "EnsureBrowserContextKeyedServiceFactoriesBuilt" << "step - 120";
  webrtc_event_logging::WebRtcEventLogManagerKeyedServiceFactory::GetInstance();
}

void ChromeBrowserMainExtraPartsProfiles::PreProfileInit() {
  EnsureBrowserContextKeyedServiceFactoriesBuilt();
}
