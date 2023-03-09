#ifndef MISES_BROWSER_MEDIA_ROUTER_MEDIA_ROUTER_FEATURE_H_
#define MISES_BROWSER_MEDIA_ROUTER_MEDIA_ROUTER_FEATURE_H_

#include "base/feature_list.h"
#include "base/time/time.h"
#include "build/build_config.h"
#include "third_party/abseil-cpp/absl/types/optional.h"


#if BUILDFLAG(IS_ANDROID)

#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (0)


#include "src/chrome/browser/media/router/media_router_feature.h"
#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (1)

#else

#include "src/chrome/browser/media/router/media_router_feature.h"


#endif


#endif  // CHROME_BROWSER_MEDIA_ROUTER_MEDIA_ROUTER_FEATURE_H_
