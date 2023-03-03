#include "chrome/browser/ui/exclusive_access/fullscreen_controller.h"

#if BUILDFLAG(IS_ANDROID)
#define is_tab_fullscreen_for_testing_ (is_tab_fullscreen_for_testing_ || true)
#endif
#include "src/chrome/browser/ui/exclusive_access/fullscreen_controller.cc"
