#ifndef MISES_BROWSER_UI_BROWSER_INSTANT_CONTROLLER_H_
#define MISES_BROWSER_UI_BROWSER_INSTANT_CONTROLLER_H_

#include <memory>

#include "base/memory/raw_ptr.h"
#include "build/build_config.h"
#include "chrome/browser/search/search_engine_base_url_tracker.h"
#include "chrome/browser/ui/search/instant_controller.h"


#if BUILDFLAG(IS_ANDROID)

#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (0)


#include "src/chrome/browser/ui/browser_instant_controller.h"
#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (1)

#else

#include "src/chrome/browser/ui/browser_instant_controller.h"


#endif


#endif  // CHROME_BROWSER_UI_BROWSER_INSTANT_CONTROLLER_H_
