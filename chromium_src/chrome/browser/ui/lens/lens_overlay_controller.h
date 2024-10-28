#ifndef MISES_BROWSER_UI_LENS_LENS_OVERLAY_CONTROLLER_H_
#define MISES_BROWSER_UI_LENS_LENS_OVERLAY_CONTROLLER_H_
#include "build/build_config.h"

#if BUILDFLAG(IS_ANDROID)

#include "base/memory/raw_ptr.h"
#include "base/memory/weak_ptr.h"
#include "base/scoped_observation.h"
#include "base/time/time.h"
#include "chrome/browser/lens/core/mojom/geometry.mojom.h"
#include "chrome/browser/lens/core/mojom/lens.mojom.h"
#include "chrome/browser/lens/core/mojom/overlay_object.mojom.h"
#include "chrome/browser/lens/core/mojom/text.mojom.h"
#include "chrome/browser/themes/theme_service.h"
#include "chrome/browser/ui/exclusive_access/fullscreen_controller.h"
#include "chrome/browser/ui/exclusive_access/fullscreen_observer.h"
#include "chrome/browser/ui/lens/lens_overlay_colors.h"
#include "chrome/browser/ui/lens/lens_overlay_dismissal_source.h"
#include "chrome/browser/ui/lens/lens_overlay_invocation_source.h"
#include "chrome/browser/ui/lens/lens_overlay_query_controller.h"
#include "chrome/browser/ui/lens/lens_preselection_bubble.h"
#include "chrome/browser/ui/omnibox/omnibox_tab_helper.h"
#include "chrome/browser/ui/tabs/public/tab_interface.h"
#include "chrome/browser/ui/views/side_panel/side_panel_coordinator.h"
#include "chrome/browser/ui/views/side_panel/side_panel_view_state_observer.h"
#include "chrome/browser/ui/webui/searchbox/lens_searchbox_client.h"
#include "chrome/browser/ui/webui/searchbox/realbox_handler.h"
#include "chrome/common/chrome_render_frame.mojom.h"
#include "components/find_in_page/find_result_observer.h"
#include "components/lens/proto/server/lens_overlay_response.pb.h"
#include "components/omnibox/browser/autocomplete_match_type.h"
#include "components/sessions/core/session_id.h"
#include "components/viz/common/frame_timing_details.h"
#include "content/public/browser/render_process_host_observer.h"
#include "content/public/browser/web_contents_delegate.h"
#include "mojo/public/cpp/bindings/associated_remote.h"
#include "mojo/public/cpp/bindings/pending_receiver.h"
#include "mojo/public/cpp/bindings/pending_remote.h"
#include "mojo/public/cpp/bindings/receiver.h"
#include "mojo/public/cpp/bindings/remote.h"
#include "third_party/skia/include/core/SkBitmap.h"
#include "ui/base/interaction/element_identifier.h"
#include "ui/base/mojom/window_open_disposition.mojom.h"
#include "ui/views/view_observer.h"

namespace lens {
class LensOverlayQueryController;
class LensOverlaySidePanelCoordinator;
class LensPermissionBubbleController;
class LensSearchBubbleController;
class LensOverlayEventHandler;
}  // namespace lens

namespace views {
class View;
class WebView;
}  // namespace views

namespace content {
class WebUI;
}  // namespace content

namespace signin {
class IdentityManager;
}  // namespace signin

namespace syncer {
class SyncService;
}  // namespace syncer

namespace variations {
class VariationsClient;
}  // namespace variations



class LensOverlayController {
  public:
  // Observer of LensOverlayController events.
  class Observer : public base::CheckedObserver {
   public:
    // Called after showing the Lens Overlay.
    virtual void OnLensOverlayDidShow() {}

    // Called after closing the Lens Overlay.
    virtual void OnLensOverlayDidClose() {}

    // Called when the controller is destroyed.
    virtual void OnLensOverlayControllerDestroyed() {}
  };
  LensOverlayController(tabs::TabInterface* tab,
                        variations::VariationsClient* variations_client,
                        signin::IdentityManager* identity_manager,
                        PrefService* pref_service,
                        syncer::SyncService* sync_service,
                        ThemeService* theme_service);
  ~LensOverlayController();

  void CloseUIAsync(
    lens::LensOverlayDismissalSource dismissal_source);
  static LensOverlayController* GetController(
      content::WebUI* web_ui);
  static LensOverlayController* GetController(
      content::WebContents* tab_contents);

  bool IsOverlayShowing();
  void ShowUI(
      lens::LensOverlayInvocationSource invocation_source);
};

#else
#include "src/chrome/browser/ui/lens/lens_overlay_controller.h"
#endif


#endif
