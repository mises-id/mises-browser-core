#ifndef MISES_BROWSER_WEB_APPLICATIONS_EXTENSION_STATUS_UTILS_H_
#define MISES_BROWSER_WEB_APPLICATIONS_EXTENSION_STATUS_UTILS_H_

#include "src/chrome/browser/web_applications/extension_status_utils.h"

class Profile;

namespace content {
class BrowserContext;
}

namespace extensions {

#if BUILDFLAG(IS_ANDROID)
// Returns whether |extension_id| is a Chrome App and should be blocked by the
// Chrome Apps Deprecation. Policy installed Chrome Apps are still allowed, and
// all apps are allowed if the deprecation feature flag is not enabled.
bool IsExtensionUnsupportedDeprecatedApp(content::BrowserContext* context,
                                         const std::string& extension_id);
#endif


}  // namespace extensions

#endif  // CHROME_BROWSER_WEB_APPLICATIONS_EXTENSION_STATUS_UTILS_H_
