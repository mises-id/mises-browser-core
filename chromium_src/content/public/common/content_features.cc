#include "content/public/common/content_features.h"

#define kProactivelySwapBrowsingInstance kProactivelySwapBrowsingInstance_chromium
#define kReloadHiddenTabsWithCrashedSubframes kReloadHiddenTabsWithCrashedSubframes_chromium
#define kRequestDesktopSiteExceptions kRequestDesktopSiteExceptions_chromium
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
