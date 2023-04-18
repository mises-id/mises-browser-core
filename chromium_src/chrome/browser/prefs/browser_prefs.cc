#include "chrome/browser/prefs/browser_prefs.h"

#include <string>
#include "mises/browser/mises_local_state_prefs.h"
#include "mises/browser/mises_profile_prefs.h"

#if BUILDFLAG(IS_ANDROID)
#include "chrome/browser/cart/cart_service.h"
#include "chrome/browser/device_api/device_service_impl.h"
#include "chrome/browser/gcm/gcm_product_util.h"
#include "chrome/browser/hid/hid_policy_allowed_devices.h"
#include "chrome/browser/intranet_redirect_detector.h"
#include "chrome/browser/media/router/discovery/access_code/access_code_cast_feature.h"
#include "chrome/browser/media/unified_autoplay_config.h"
#include "chrome/browser/metrics/tab_stats/tab_stats_tracker.h"
#include "chrome/browser/nearby_sharing/common/nearby_share_prefs.h"
#include "chrome/browser/new_tab_page/modules/drive/drive_service.h"
#include "chrome/browser/new_tab_page/modules/photos/photos_service.h"
#include "chrome/browser/new_tab_page/modules/safe_browsing/safe_browsing_handler.h"
#include "chrome/browser/new_tab_page/promos/promo_service.h"
#include "chrome/browser/policy/developer_tools_policy_handler.h"
#include "chrome/browser/search/background/ntp_custom_background_service.h"
#include "chrome/browser/serial/serial_policy_allowed_ports.h"
#include "chrome/browser/signin/signin_promo.h"
#include "chrome/browser/ui/startup/startup_browser_creator.h"
#include "chrome/browser/ui/webui/history/foreign_session_handler.h"
#include "chrome/browser/ui/webui/new_tab_page/new_tab_page_handler.h"
#include "chrome/browser/ui/webui/new_tab_page/new_tab_page_ui.h"
#include "chrome/browser/ui/webui/settings/settings_ui.h"
#include "chrome/browser/ui/webui/side_panel/read_anything/read_anything_prefs.h"
#include "chrome/browser/ui/webui/tab_search/tab_search_prefs.h"
#include "chrome/browser/ui/webui/whats_new/whats_new_ui.h"
#include "chrome/browser/upgrade_detector/upgrade_detector.h"
#include "components/ntp_tiles/custom_links_manager_impl.h"
#include "chrome/browser/sessions/session_service_log.h"
#endif  // BUILDFLAG(IS_ANDROID)


#include "chrome/browser/web_applications/daily_metrics_helper.h"
#include "chrome/browser/web_applications/externally_installed_web_app_prefs.h"
#include "chrome/browser/web_applications/install_bounce_metric.h"
#include "chrome/browser/web_applications/policy/web_app_policy_manager.h"
#include "chrome/browser/web_applications/preinstalled_web_app_manager.h"
#include "chrome/browser/web_applications/user_uninstalled_preinstalled_web_app_prefs.h"
#include "chrome/browser/web_applications/web_app_prefs_utils.h"
#include "chrome/browser/web_applications/web_app_provider.h"
#include "chrome/browser/web_applications/web_app_utils.h"

void MisesRegisterLocalStatePrefs(PrefRegistrySimple* registry);
void MisesRegisterProfilePrefs(user_prefs::PrefRegistrySyncable* registry);
#include "src/chrome/browser/prefs/browser_prefs.cc"

void MisesRegisterLocalStatePrefs(PrefRegistrySimple* registry) {
#if BUILDFLAG(IS_ANDROID)
  gcm::RegisterPrefs(registry);
  IntranetRedirectDetector::RegisterPrefs(registry);
  media_router::RegisterLocalStatePrefs(registry);
  metrics::TabStatsTracker::RegisterPrefs(registry);
  performance_manager::user_tuning::prefs::RegisterLocalStatePrefs(registry);
  RegisterBrowserPrefs(registry);
  //StartupBrowserCreator::RegisterLocalStatePrefs(registry);
  task_manager::TaskManagerInterface::RegisterPrefs(registry);
  UpgradeDetector::RegisterPrefs(registry);
  WhatsNewUI::RegisterLocalStatePrefs(registry);
#endif
  mises::RegisterLocalStatePrefs(registry);
}
void MisesRegisterProfilePrefs(user_prefs::PrefRegistrySyncable* registry) {
#if BUILDFLAG(IS_ANDROID) 
  //ApcClient::RegisterPrefs(registry);
  //AppShortcutManager::RegisterProfilePrefs(registry);
  BrowserFeaturePromoSnoozeService::RegisterProfilePrefs(registry);
  DeviceServiceImpl::RegisterProfilePrefs(registry);
  DevToolsWindow::RegisterProfilePrefs(registry);
  DriveService::RegisterProfilePrefs(registry);
  enterprise_connectors::RegisterProfilePrefs(registry);
  extensions::CommandService::RegisterProfilePrefs(registry);
  extensions::TabsCaptureVisibleTabFunction::RegisterProfilePrefs(registry);
  first_run::RegisterProfilePrefs(registry);
  HatsService::RegisterProfilePrefs(registry);
  NtpCustomBackgroundService::RegisterProfilePrefs(registry);
  media_router::RegisterAccessCodeProfilePrefs(registry);
  media_router::RegisterProfilePrefs(registry);
  NewTabPageHandler::RegisterProfilePrefs(registry);
  NewTabPageUI::RegisterProfilePrefs(registry);
  NewTabUI::RegisterProfilePrefs(registry);
  ntp::SafeBrowsingHandler::RegisterProfilePrefs(registry);
  ntp_tiles::CustomLinksManagerImpl::RegisterProfilePrefs(registry);
  PhotosService::RegisterProfilePrefs(registry);
  PinnedTabCodec::RegisterProfilePrefs(registry);
  policy::DeveloperToolsPolicyHandler::RegisterProfilePrefs(registry);
  PromoService::RegisterProfilePrefs(registry);
  RegisterReadAnythingProfilePrefs(registry);
  //settings::SettingsUI::RegisterProfilePrefs(registry);
  send_tab_to_self::RegisterProfilePrefs(registry);
  signin::RegisterProfilePrefs(registry);
  //StartupBrowserCreator::RegisterProfilePrefs(registry);
  tab_search_prefs::RegisterProfilePrefs(registry);
  //TaskModuleService::RegisterProfilePrefs(registry);
  UnifiedAutoplayConfig::RegisterProfilePrefs(registry);
  RegisterSessionServiceLogProfilePrefs(registry);
#endif

#if BUILDFLAG(IS_ANDROID) 
  preinstalled_apps::RegisterProfilePrefs(registry);
#endif

#if BUILDFLAG(IS_ANDROID)
  registry->RegisterBooleanPref(
      prefs::kLensRegionSearchEnabled, true,
      user_prefs::PrefRegistrySyncable::SYNCABLE_PREF);
  registry->RegisterBooleanPref(
      webauthn::pref_names::kRemoteProxiedRequestsAllowed, false);

  // When in RTL mode, the side panel should default to the left of the screen.
  // Otherwise, the side panel should default to the right side of the screen.
  // TODO(dljames): Add enum values kAlternateSide / kDefaultSide that will
  // replace false and true respectively.
  registry->RegisterBooleanPref(prefs::kSidePanelHorizontalAlignment,
                                base::i18n::IsRTL() ? false : true);


  registry->RegisterBooleanPref(prefs::kShowCastIconInToolbar, false);

#endif

#if !BUILDFLAG(ENABLE_FEED_V2)
  feed::prefs::RegisterFeedSharedProfilePrefs(registry);
  feed::RegisterProfilePrefs(registry);
#endif 

#if BUILDFLAG(IS_ANDROID)
  web_app::UserUninstalledPreinstalledWebAppPrefs::RegisterProfilePrefs(registry);
  web_app::ExternallyInstalledWebAppPrefs::RegisterProfilePrefs(registry);
  web_app::PreinstalledWebAppManager::RegisterProfilePrefs(registry);
  web_app::WebAppPolicyManager::RegisterProfilePrefs(registry);
  web_app::WebAppPrefsUtilsRegisterProfilePrefs(registry);
  web_app::RegisterInstallBounceMetricProfilePrefs(registry);
  web_app::RegisterDailyWebAppMetricsProfilePrefs(registry);
  web_app::WebAppShortcutManager::RegisterProfilePrefs(registry);
#endif


  mises::RegisterProfilePrefs(registry);
}
