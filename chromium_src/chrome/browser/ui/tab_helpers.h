#ifndef MISES_BROWSER_UI_TAB_HELPERS_H_
#define MISES_BROWSER_UI_TAB_HELPERS_H_

#include "build/build_config.h"

#if BUILDFLAG(IS_ANDROID)
  namespace chrome {
    class BrowserTabStripModelDelegate;
  }
  #define TabAndroid\
    Browser;\
    friend class chrome::BrowserTabStripModelDelegate;\
    friend class  TabAndroid
  #include "src/chrome/browser/ui/tab_helpers.h"
  #undef TabAndroid
#else
  #include "src/chrome/browser/ui/tab_helpers.h"
#endif


#endif  // CHROME_BROWSER_UI_TAB_HELPERS_H_
