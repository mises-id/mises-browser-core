#include "content/public/common/content_features.h"

#if BUILDFLAG(IS_ANDROID)
#define kProactivelySwapBrowsingInstance kProactivelySwapBrowsingInstance_Chromium
#define kReloadHiddenTabsWithCrashedSubframes kReloadHiddenTabsWithCrashedSubframes_Chromium
#define kRequestDesktopSiteExceptions kRequestDesktopSiteExceptions_Chromium
#include "src/content/public/common/content_features.cc"
#undef kProactivelySwapBrowsingInstance
#undef kReloadHiddenTabsWithCrashedSubframes
#undef kRequestDesktopSiteExceptions

namespace features {
    const base::Feature kProactivelySwapBrowsingInstance{
    "ProactivelySwapBrowsingInstance", base::FEATURE_ENABLED_BY_DEFAULT};
    const base::Feature kReloadHiddenTabsWithCrashedSubframes {
    "ReloadHiddenTabsWithCrashedSubframes", base::FEATURE_DISABLED_BY_DEFAULT};
    const base::Feature kRequestDesktopSiteExceptions{
    "RequestDesktopSiteExceptions", base::FEATURE_ENABLED_BY_DEFAULT};
}

#else

#include "src/content/public/common/content_features.cc"

#endif
