#ifndef MISES_BROWSER_SHARE_SHARE_FEATURES_H_
#define MISES_BROWSER_SHARE_SHARE_FEATURES_H_

#include "base/feature_list.h"
#include "base/metrics/field_trial_params.h"
#include "build/build_config.h"
#include "build/buildflag.h"


#if BUILDFLAG(IS_ANDROID)

#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (0)


#include "src/chrome/browser/share/share_features.h"
#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (1)

#else

#include "src/chrome/browser/share/share_features.h"


#endif


#endif  // CHROME_BROWSER_SHARE_SHARE_FEATURES_H_
