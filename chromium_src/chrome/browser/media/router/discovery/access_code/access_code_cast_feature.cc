
#include "build/build_config.h"

#if BUILDFLAG(IS_ANDROID)

#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (0)

#include "src/chrome/browser/media/router/discovery/access_code/access_code_cast_feature.cc"
#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (1)


#else

#include "src/chrome/browser/media/router/discovery/access_code/access_code_cast_feature.cc"


#endif