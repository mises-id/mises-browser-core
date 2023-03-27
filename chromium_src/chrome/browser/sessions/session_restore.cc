#include "build/build_config.h"
#if BUILDFLAG(IS_ANDROID)
#include "chrome/browser/sessions/session_restore.h"
#define OpenStartupPagesAfterCrash OpenStartupPagesAfterCrash_chromium
#define RestoreForeignSessionWindows RestoreForeignSessionWindows_chromium
#define RestoreForeignSessionTab RestoreForeignSessionTab_chromium
#include "src/chrome/browser/sessions/session_restore.cc"
#undef OpenStartupPagesAfterCrash

// static
void SessionRestore::OpenStartupPagesAfterCrash(Browser* browser) {

}

#else
#include "src/chrome/browser/sessions/session_restore.cc"
#endif

