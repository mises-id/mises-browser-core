#include "build/build_config.h"

#include "base/system/sys_info.h"
#if BUILDFLAG(IS_ANDROID)
#include "chrome/browser/devtools/chrome_devtools_manager_delegate.h"
#include "chrome/browser/devtools/devtools_window.h"
#include "chrome/browser/media/unified_autoplay_config.h"
#include "chrome/browser/search/instant_service.h"
#include "chrome/browser/search/instant_service_factory.h"
#include "chrome/browser/serial/chrome_serial_delegate.h"
#include "chrome/browser/task_manager/task_manager_interface.h"
#include "chrome/browser/ui/browser.h"
#include "chrome/browser/ui/browser_dialogs.h"
#include "chrome/browser/ui/browser_finder.h"
#include "chrome/browser/ui/search/new_tab_page_navigation_throttle.h"
#include "chrome/browser/web_applications/policy/web_app_policy_manager.h"
#include "chrome/browser/web_applications/web_app_helpers.h"
#include "chrome/browser/web_applications/web_app_provider.h"
#include "chrome/browser/web_applications/web_app_registrar.h"
#include "chrome/browser/webauthn/authenticator_request_scheduler.h"
#include "chrome/browser/webauthn/chrome_authenticator_request_delegate.h"
#include "chrome/grit/chrome_unscaled_resources.h"  // nogncheck crbug.com/1125897
#include "third_party/blink/public/mojom/permissions_policy/permissions_policy_feature.mojom.h"
#endif  //  !BUILDFLAG(IS_ANDROID)

#include "mises/components/ipfs/buildflags/buildflags.h"
#if BUILDFLAG(ENABLE_IPFS)
#include "mises/components/ipfs/ipfs_url_loader_request_interceptor.h"
#endif
#include "extensions/browser/process_map.h"


#include "src/chrome/browser/chrome_content_browser_client.cc"


size_t ChromeContentBrowserClient::GetMaxRendererProcessCountOverride() {
#if BUILDFLAG(IS_ANDROID)
  if (!extensions::ProcessMap::IsIsolateExtensionsEnabled()) {
    static size_t max_count = 0;
    if (!max_count) {
      LOG(INFO) << "GetMaxRendererProcessCountOverride:" << base::SysInfo::AmountOfPhysicalMemoryMB();
      max_count = base::SysInfo::AmountOfPhysicalMemoryMB() / 2;
      max_count /= 128;
      max_count = std::clamp(max_count, (size_t)3u, (size_t)96u);
    }
    return max_count;
  }
#endif
  return 0u;

}
