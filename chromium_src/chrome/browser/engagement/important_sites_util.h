#ifndef MISES_BROWSER_ENGAGEMENT_IMPORTANT_SITES_UTIL_H_
#define MISES_BROWSER_ENGAGEMENT_IMPORTANT_SITES_UTIL_H_

#include <set>
#include <string>
#include <vector>

#include "build/build_config.h"
#include "components/browsing_data/core/browsing_data_utils.h"
#include <optional>
#include "url/gurl.h"



#if BUILDFLAG(IS_ANDROID)

#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (0)


#include "src/chrome/browser/engagement/important_sites_util.h"
#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (1)

#else

#include "src/chrome/browser/engagement/important_sites_util.h"


#endif


#endif  // CHROME_BROWSER_ENGAGEMENT_IMPORTANT_SITES_UTIL_H_
