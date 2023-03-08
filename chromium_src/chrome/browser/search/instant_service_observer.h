#ifndef MISES_BROWSER_SEARCH_INSTANT_SERVICE_OBSERVER_H_
#define MISES_BROWSER_SEARCH_INSTANT_SERVICE_OBSERVER_H_

#include "build/build_config.h"
#include "chrome/common/search/instant_types.h"


#if BUILDFLAG(IS_ANDROID)

#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (0)


#include "src/chrome/browser/search/instant_service_observer.h"
#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (1)

#else

#include "src/chrome/browser/search/instant_service_observer.h"


#endif


#endif  // CHROME_BROWSER_SEARCH_INSTANT_SERVICE_OBSERVER_H_
