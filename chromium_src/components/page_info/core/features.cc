#include "src/components/page_info/core/features.cc"

namespace page_info {

#if BUILDFLAG(IS_ANDROID)


BASE_FEATURE(kPageInfoHistoryDesktop,
             "PageInfoHistoryDesktop",
             base::FEATURE_DISABLED_BY_DEFAULT);

BASE_FEATURE(kPageInfoHideSiteSettings,
             "PageInfoHideSiteSettings",
             base::FEATURE_DISABLED_BY_DEFAULT);


#endif

}  // namespace page_info
