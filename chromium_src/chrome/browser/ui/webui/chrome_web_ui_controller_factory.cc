#include "build/build_config.h"

#if BUILDFLAG(IS_ANDROID)
#include "chrome/browser/ui/webui/devtools_ui.h"

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

