#include "build/build_config.h"

#if BUILDFLAG(IS_ANDROID)
#include "chrome/browser/ui/views/media_router/media_router_dialog_controller_views.h"

namespace media_router {

class MediaRouterDialogControllerViews_Mises {
public:
  MediaRouterDialogControllerViews_Mises(
      content::WebContents* web_contents) {
  }
  ~MediaRouterDialogControllerViews_Mises() {

  }

  static MediaRouterDialogControllerViews *FromWebContents(content::WebContents* contents) {
    return nullptr;
  }

  static void CreateForWebContents(content::WebContents* contents) {

  }

  
};




}

#define MediaRouterDialogControllerViews MediaRouterDialogControllerViews_Mises



#endif

#include "src/chrome/browser/ui/views/chrome_browser_main_extra_parts_views.cc"
