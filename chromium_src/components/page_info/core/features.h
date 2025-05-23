#ifndef MISES_COMPONENTS_PAGE_INFO_CORE_FEATURES_H_
#define MISES_COMPONENTS_PAGE_INFO_CORE_FEATURES_H_

#include "src/components/page_info/core/features.h"


namespace base {
struct Feature;
}  // namespace base

namespace page_info {

#if BUILDFLAG(IS_ANDROID)

// Enables the history section for Page Info on desktop.
BASE_DECLARE_FEATURE(kPageInfoHistoryDesktop);

// Hides site settings row.
BASE_DECLARE_FEATURE(kPageInfoHideSiteSettings);

#endif

}  // namespace page_info

#endif  // COMPONENTS_PAGE_INFO_CORE_FEATURES_H_
