
#include "build/build_config.h"
#include "chrome/browser/ui/browser_commands.h"
#if BUILDFLAG(IS_ANDROID)
#define active_window nullptr
#define GetKeyboardFocusedTabIndex GetKeyboardFocusedTabIndex_Unused
#endif
#include "src/chrome/browser/ui/views/browser_commands_views.cc"

#if BUILDFLAG(IS_ANDROID)
#undef active_window
#undef GetKeyboardFocusedTabIndex
#endif