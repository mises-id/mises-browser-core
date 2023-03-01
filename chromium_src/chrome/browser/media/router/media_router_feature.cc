#include "build/build_config.h"

#if BUILDFLAG(IS_ANDROID)

#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (0)

#undef ANDROID

#include "src/chrome/browser/media/router/media_router_feature.cc"
#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (1)

#define ANDROID 1

#else

#include "src/chrome/browser/media/router/media_router_feature.cc"


#endif



