#include "src/chrome/browser/browser_features.cc"


namespace features {

#if BUILDFLAG(IS_ANDROID)
BASE_FEATURE(kMuteNotificationSnoozeAction,
             "MuteNotificationSnoozeAction",
             base::FEATURE_DISABLED_BY_DEFAULT);
BASE_FEATURE(kReadAnythingPermanentAccessibility,
             "ReadAnythingPermanentAccessibility",
             base::FEATURE_DISABLED_BY_DEFAULT);
#endif

}  // namespace features
