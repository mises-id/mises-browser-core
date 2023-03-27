
#ifndef MISES_BROWSER_PAGE_INFO_PAGE_INFO_FEATURES_H_
#define MISES_BROWSER_PAGE_INFO_PAGE_INFO_FEATURES_H_

#include "base/feature_list.h"

#if BUILDFLAG(IS_ANDROID)

#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (0)


#include "src/chrome/browser/page_info/page_info_features.h"
#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (1)

#else

#include "src/chrome/browser/page_info/page_info_features.h"


#endif

#endif 