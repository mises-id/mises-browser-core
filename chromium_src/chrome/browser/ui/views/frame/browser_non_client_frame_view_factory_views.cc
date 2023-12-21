#include "build/build_config.h"
#include "chrome/browser/ui/views/frame/opaque_browser_frame_view.h"
#include "chrome/browser/ui/views/frame/picture_in_picture_browser_frame_view.h"

#if BUILDFLAG(IS_ANDROID)


class BrowserNonClientFrameViewAndroid : public BrowserNonClientFrameView {
public:
  BrowserNonClientFrameViewAndroid(BrowserFrame* frame, BrowserView* browser_view) 
    : BrowserNonClientFrameView(frame, browser_view) {

  }
  gfx::Rect GetBoundsForTabStripRegion(
  const gfx::Size& tabstrip_minimum_size) const override {
    return gfx::Rect(size());
  }
  gfx::Rect GetBoundsForWebAppFrameToolbar(
  const gfx::Size& toolbar_preferred_size) const override {
    return gfx::Rect(size());
  }
  void LayoutWebAppWindowTitle(const gfx::Rect& available_space,
                            views::Label& window_title_label) const override{}
  int GetTopInset(bool restored) const override {return 0;}
  void UpdateThrobber(bool running) override {}
};

LocationIconView* PictureInPictureBrowserFrameView::GetLocationIconView() {
  return nullptr;
}

#define  InitViews ShouldDrawRestoredFrameShadow
#define PictureInPictureBrowserFrameView BrowserNonClientFrameViewAndroid
#include "src/chrome/browser/ui/views/frame/browser_non_client_frame_view_factory_views.cc"
#undef InitViews
#undef PictureInPictureBrowserFrameView
#else
#include "src/chrome/browser/ui/views/frame/browser_non_client_frame_view_factory_views.cc"
#endif
