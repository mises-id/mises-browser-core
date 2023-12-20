#ifndef MISES_BROWSER_UI_WEBUI_VERSION_VERSION_UI_H_
#define MISES_BROWSER_UI_WEBUI_VERSION_VERSION_UI_H_

#include "build/build_config.h"
#include "content/public/browser/web_ui_controller.h"
#include "content/public/browser/web_ui_data_source.h"

#if BUILDFLAG(IS_ANDROID)

#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (0)


#include "src/chrome/browser/ui/webui/version/version_ui.h"
#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (1)

#else

#include "src/chrome/browser/ui/webui/version/version_ui.h"


#endif



#endif  // CHROME_BROWSER_UI_SIGNIN_VIEW_CONTROLLER_H_


