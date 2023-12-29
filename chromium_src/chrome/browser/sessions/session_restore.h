#ifndef MISES_BROWSER_SESSIONS_SESSION_RESTORE_H_
#define MISES_BROWSER_SESSIONS_SESSION_RESTORE_H_
#define OpenStartupPagesAfterCrash OpenStartupPagesAfterCrash_chromium(Browser* browser); \
  static std::vector<Browser*> RestoreForeignSessionWindows_chromium( \
      Profile* profile, \
      std::vector<const sessions::SessionWindow*>::const_iterator begin,\
      std::vector<const sessions::SessionWindow*>::const_iterator end);\
  static content::WebContents* RestoreForeignSessionTab_chromium(\
      content::WebContents* source_web_contents,\
      const sessions::SessionTab& tab,\
      WindowOpenDisposition disposition, bool skip_renderer_creation = false);\
static void OpenStartupPagesAfterCrash

#include "src/chrome/browser/sessions/session_restore.h"

#undef  OpenStartupPagesAfterCrash

#endif

