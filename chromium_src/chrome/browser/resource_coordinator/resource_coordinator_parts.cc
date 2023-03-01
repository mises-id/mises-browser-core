
#include "build/build_config.h"

#include "chrome/browser/resource_coordinator/tab_manager.h"
#if BUILDFLAG(IS_ANDROID)

#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (0)

#undef ANDROID

#include "src/chrome/browser/resource_coordinator/resource_coordinator_parts.cc"
#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (1)

#define ANDROID 1

#else

#include "src/chrome/browser/resource_coordinator/resource_coordinator_parts.cc"


#endif




