#include "build/build_config.h"

#if BUILDFLAG(IS_ANDROID)

#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (0)


#include "src/chrome/browser/lifetime/application_lifetime.h"
#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (1)


#else

#include "src/chrome/browser/lifetime/application_lifetime.h"


#endif

