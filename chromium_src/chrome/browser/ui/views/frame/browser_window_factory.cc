#include "build/build_config.h"
#if BUILDFLAG(IS_ANDROID)
#include <memory>
#include "chrome/browser/ui/views/frame/browser_frame.h"
#include "chrome/browser/ui/views/frame/browser_view.h"
// static
BrowserWindow* BrowserWindow::CreateBrowserWindow(
    std::unique_ptr<Browser> browser,
    bool user_gesture,
    bool in_tab_dragging) {

  // Create the view and the frame. The frame will attach itself via the view
  // so we don't need to do anything with the pointer.
  BrowserView* view = new BrowserView(std::move(browser));
  #if BUILDFLAG(IS_ANDROID) 
  view->SetOwnedByWidget(true);
  #endif
  BrowserFrame* browser_frame = nullptr;
  if (!browser_frame)
    browser_frame = new BrowserFrame(view);
  if (in_tab_dragging)
    browser_frame->SetTabDragKind(TabDragKind::kAllTabs);
  browser_frame->InitBrowserFrame();

  return view;
}

#else

#include "src/chrome/browser/ui/views/frame/browser_window_factory.cc"
#endif

