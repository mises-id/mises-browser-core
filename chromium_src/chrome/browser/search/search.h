#ifndef MISES_CHROME_BROWSER_SEARCH_SEARCH_H_
#define MISES_CHROME_BROWSER_SEARCH_SEARCH_H_

#include "build/build_config.h"

#if BUILDFLAG(IS_ANDROID)

#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (0)


#include "src/chrome/browser/search/search.h"
#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (1)

#else

#include "src/chrome/browser/search/search.h"


#endif




#endif  // CHROME_BROWSER_SEARCH_SEARCH_H_
