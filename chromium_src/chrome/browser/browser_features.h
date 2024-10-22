#ifndef MISES_BROWSER_BROWSER_FEATURES_H_
#define MISES_BROWSER_BROWSER_FEATURES_H_

#include "src/chrome/browser/browser_features.h"

namespace features {

#if BUILDFLAG(IS_ANDROID)
BASE_DECLARE_FEATURE(kReadAnythingPermanentAccessibility);
BASE_DECLARE_FEATURE(kMuteNotificationSnoozeAction);
#endif

}  // namespace features

#endif  // CHROME_BROWSER_BROWSER_FEATURES_H_
