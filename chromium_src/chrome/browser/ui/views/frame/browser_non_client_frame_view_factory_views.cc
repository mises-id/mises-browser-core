#include "build/build_config.h"
#include "chrome/browser/ui/views/frame/opaque_browser_frame_view.h"
#if BUILDFLAG(IS_ANDROID)
#define  InitViews ShouldDrawRestoredFrameShadow
#include "src/chrome/browser/ui/views/frame/browser_non_client_frame_view_factory_views.cc"
#undef InitViews
#else
#include "src/chrome/browser/ui/views/frame/browser_non_client_frame_view_factory_views.cc"
#endif
