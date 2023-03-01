
#ifndef MISES_BROWSER_MEDIA_ROUTER_DISCOVERY_ACCESS_CODE_ACCESS_CODE_CAST_FEATURE_H_
#define MISES_BROWSER_MEDIA_ROUTER_DISCOVERY_ACCESS_CODE_ACCESS_CODE_CAST_FEATURE_H_

#include "build/build_config.h"
#if BUILDFLAG(IS_ANDROID)
#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (0)

#include "src/chrome/browser/media/router/discovery/access_code/access_code_cast_feature.h"
#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (1)

#else

#include "src/chrome/browser/media/router/discovery/access_code/access_code_cast_feature.h"

#endif





#endif