#include "build/build_config.h"
#include "mises/browser/ui/webui/mises_web_ui_controller_factory.h"
#include "build/chromeos_buildflags.h"

#if !BUILDFLAG(IS_CHROMEOS_ASH)
// NOLINTNEXTLINE
#define CHROME_BROWSER_WEB_APPLICATIONS_SYSTEM_WEB_APPS_SYSTEM_WEB_APP_MANAGER_H_
#define CHROME_BROWSER_WEB_APPLICATIONS_WEB_APP_PROVIDER_H_
#endif  // !BUILDFLAG(IS_CHROMEOS_ASH)

#define MISES_CHROME_WEBUI_CONTROLLER_FACTORY \
  return MisesWebUIControllerFactory::GetInstance();

#if BUILDFLAG(IS_ANDROID)
#include "chrome/browser/ui/webui/devtools/devtools_ui.h"

  #define MISES_BROWSER_UI_WEBUI_CHROME_WEB_UI_CONTROLLER_FACTORY \
     if (url.host_piece() == chrome::kChromeUIExtensionsHost) \
        return &NewWebUI<extensions::ExtensionsUI>; \
      if (url.SchemeIs(content::kChromeDevToolsScheme)) { \
        if (!DevToolsUIBindings::IsValidFrontendURL(url)) \
          return nullptr; \
        return &NewWebUI<DevToolsUI>;\
      }
#else
  #define MISES_BROWSER_UI_WEBUI_CHROME_WEB_UI_CONTROLLER_FACTORY 
#endif

#include "src/chrome/browser/ui/webui/chrome_web_ui_controller_factory.cc"

#undef MISES_BROWSER_UI_WEBUI_CHROME_WEB_UI_CONTROLLER_FACTORY

#undef MISES_CHROME_WEBUI_CONTROLLER_FACTORY

