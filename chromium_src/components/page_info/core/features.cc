#include "src/components/page_info/core/features.cc"

namespace page_info {

#if BUILDFLAG(IS_ANDROID)
const base::Feature kPageInfoHistoryDesktop{"PageInfoHistoryDesktop",
                                            base::FEATURE_DISABLED_BY_DEFAULT};

const base::Feature kPageInfoHideSiteSettings{
    "PageInfoHideSiteSettings", base::FEATURE_DISABLED_BY_DEFAULT};
#endif

}  // namespace page_info
