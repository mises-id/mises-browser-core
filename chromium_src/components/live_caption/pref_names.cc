
#include "build/build_config.h"

#if BUILDFLAG(IS_ANDROID)

#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (0)

#undef ANDROID

#include "src/components/live_caption/pref_names.cc"
#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (1)

#define ANDROID 1

#else

#include "src/components/live_caption/pref_names.cc"


#endif


