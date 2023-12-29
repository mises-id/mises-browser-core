#ifndef MISES_BROWSER_UI_TABS_TAB_MODEL_H_
#define MISES_BROWSER_UI_TABS_TAB_MODEL_H_


#include "build/build_config.h"


#if BUILDFLAG(IS_ANDROID)

#define TabModel TabModelDesktop

#endif

#include "src/chrome/browser/ui/tabs/tab_model.h"

#if BUILDFLAG(IS_ANDROID)


#undef TabModel

#endif


#endif