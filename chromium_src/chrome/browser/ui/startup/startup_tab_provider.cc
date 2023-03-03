#include "src/chrome/browser/ui/startup/startup_tab_provider.cc"


#if BUILDFLAG(IS_ANDROID)
#include "chrome/browser/privacy_sandbox/privacy_sandbox_service.h"
#include "chrome/browser/search/search.h"
#include "chrome/browser/ui/webui/new_tab_page/new_tab_page_ui.h"
#include "chrome/common/extensions/chrome_manifest_url_handlers.h"
#include "chrome/common/webui_url_constants.h"
#include "extensions/browser/extension_registry.h"
#endif  // !BUILDFLAG(IS_ANDROID)

#if BUILDFLAG(IS_ANDROID)
StartupTabs StartupTabProviderImpl::GetNewFeaturesTabs(
    bool whats_new_enabled) const {
  return GetNewFeaturesTabsForState(whats_new_enabled);
}

StartupTabs StartupTabProviderImpl::GetPrivacySandboxTabs(
    Profile* profile,
    const StartupTabs& other_startup_tabs) const {
  return GetPrivacySandboxTabsForState(
      extensions::ExtensionRegistry::Get(profile),
      search::GetNewTabPageURL(profile), other_startup_tabs);
}

#endif  // !BUILDFLAG(IS_ANDROID)
