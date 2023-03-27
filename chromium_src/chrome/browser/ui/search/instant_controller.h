#ifndef MISES_BROWSER_UI_SEARCH_INSTANT_CONTROLLER_H_
#define MISES_BROWSER_UI_SEARCH_INSTANT_CONTROLLER_H_

#include <memory>

#include "base/gtest_prod_util.h"
#include "base/memory/raw_ptr.h"
#include "build/build_config.h"
#include "chrome/browser/ui/tabs/tab_strip_model_observer.h"


#if BUILDFLAG(IS_ANDROID)

#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (0)


#include "src/chrome/browser/ui/search/instant_controller.h"
#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (1)

#else

#include "src/chrome/browser/ui/search/instant_controller.h"


#endif

#endif  // CHROME_BROWSER_UI_SEARCH_INSTANT_CONTROLLER_H_
