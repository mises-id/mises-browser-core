#include "build/build_config.h"

#if BUILDFLAG(IS_ANDROID)
#include "chrome/browser/ui/views/media_router/media_router_dialog_controller_views.h"
#include "components/media_router/browser/media_router_dialog_controller.h"
namespace media_router {

class MediaRouterDialogController_Mises;
class MediaRouterDialogControllerViews_Mises {
public:
  MediaRouterDialogControllerViews_Mises(
      content::WebContents* web_contents) {
  }
  ~MediaRouterDialogControllerViews_Mises() {

  }

  static MediaRouterDialogController_Mises *FromWebContents(content::WebContents* contents) {
    return nullptr;
  }

  static void CreateForWebContents(content::WebContents* contents) {

  }

  
};

class MediaRouterDialogController_Mises {
public:
using GetOrCreate = base::RepeatingCallback<MediaRouterDialogController_Mises*(
      content::WebContents*)>;
static void SetGetOrCreate(
    const MediaRouterDialogController_Mises::GetOrCreate& get_or_create) {

}

};

}

#define MediaRouterDialogControllerViews MediaRouterDialogControllerViews_Mises
#define MediaRouterDialogController MediaRouterDialogController_Mises


#endif

#include "src/chrome/browser/ui/views/chrome_browser_main_extra_parts_views.cc"
