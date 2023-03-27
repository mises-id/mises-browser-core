#ifndef MISES_BROWSER_SEARCH_INSTANT_SERVICE_FACTORY_H_
#define MISES_BROWSER_SEARCH_INSTANT_SERVICE_FACTORY_H_

#include "base/memory/singleton.h"
#include "build/build_config.h"
#include "components/keyed_service/content/browser_context_keyed_service_factory.h"


#if BUILDFLAG(IS_ANDROID)

#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (0)


#include "src/chrome/browser/search/instant_service_factory.h"
#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (1)

#else

#include "src/chrome/browser/search/instant_service_factory.h"


#endif



#endif  // CHROME_BROWSER_SEARCH_INSTANT_SERVICE_FACTORY_H_
