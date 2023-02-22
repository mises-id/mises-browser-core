#include "src/chrome/common/chrome_switches.cc"
#if BUILDFLAG(IS_ANDROID)
namespace switches {
    const char kEnableNewAppMenuIcon[] = "enable-new-app-menu-icon";
    // Causes the browser to launch directly in guest mode.
    const char kGuest[] = "guest";
}
#endif