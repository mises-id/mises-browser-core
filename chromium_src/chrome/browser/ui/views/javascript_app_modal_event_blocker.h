#ifndef MISES_BROWSER_UI_VIEWS_JAVASCRIPT_APP_MODAL_EVENT_BLOCKER_H_
#define MISES_BROWSER_UI_VIEWS_JAVASCRIPT_APP_MODAL_EVENT_BLOCKER_H_

#include "build/build_config.h"

#if  BUILDFLAG(IS_ANDROID)
#include "chrome/browser/ui/views/javascript_app_modal_event_blocker_android.h"

using JavascriptAppModalEventBlocker = JavascriptAppModalEventBlockerAndroid;

#else

#include "src/chrome/browser/ui/views/javascript_app_modal_event_blocker.h"

#endif

#endif  // CHROME_BROWSER_UI_VIEWS_JAVASCRIPT_APP_MODAL_EVENT_BLOCKER_H_
