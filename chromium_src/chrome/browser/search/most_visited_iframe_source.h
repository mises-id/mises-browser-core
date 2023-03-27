#ifndef MISES_BROWSER_SEARCH_MOST_VISITED_IFRAME_SOURCE_H_
#define MISES_BROWSER_SEARCH_MOST_VISITED_IFRAME_SOURCE_H_

#include "build/build_config.h"
#include "content/public/browser/url_data_source.h"




#if BUILDFLAG(IS_ANDROID)

#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (0)


#include "src/chrome/browser/search/most_visited_iframe_source.h"
#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (1)

#else

#include "src/chrome/browser/search/most_visited_iframe_source.h"


#endif


#endif  // CHROME_BROWSER_SEARCH_MOST_VISITED_IFRAME_SOURCE_H_
