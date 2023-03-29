#ifndef MISES_BROWSER_EXTENSIONS_API_TABS_WINDOWS_EVENT_ROUTER_H_
#define MISES_BROWSER_EXTENSIONS_API_TABS_WINDOWS_EVENT_ROUTER_H_

#include "build/build_config.h"
#if BUILDFLAG(IS_ANDROID)
#include "chrome/browser/ui/android/tab_model/tab_model_list_observer.h"
#include "chrome/browser/ui/android/tab_model/tab_model.h"
#include "chrome/browser/ui/android/tab_model/tab_model_list.h"
#include "chrome/browser/ui/android/tab_model/tab_model_observer.h"
#include "chrome/browser/android/tab_android.h"
#endif

#include "src/chrome/browser/extensions/api/tabs/windows_event_router.h"


#endif  // CHROME_BROWSER_EXTENSIONS_API_TABS_WINDOWS_EVENT_ROUTER_H_
