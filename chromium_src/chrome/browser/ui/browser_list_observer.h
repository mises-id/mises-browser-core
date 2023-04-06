#ifndef MISES_BROWSER_UI_BROWSER_LIST_OBSERVER_H_
#define MISES_BROWSER_UI_BROWSER_LIST_OBSERVER_H_

#include "build/build_config.h"



#if BUILDFLAG(IS_ANDROID)

#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (0)


#include "src/chrome/browser/ui/browser_list_observer.h"
#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (1)

#else

#include "src/chrome/browser/ui/browser_list_observer.h"


#endif



#endif  // CHROME_BROWSER_UI_BROWSER_LIST_OBSERVER_H_
