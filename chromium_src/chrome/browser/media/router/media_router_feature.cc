#include "build/build_config.h"

#if BUILDFLAG(IS_ANDROID)

 
#include "chrome/browser/media/router/media_router_feature.h"

#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (0)


#include "src/chrome/browser/media/router/media_router_feature.cc"
#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (1)



namespace media_router {

BASE_FEATURE(kCafMRPDeferredDiscovery,
             "CafMRPDeferredDiscovery",
             base::FEATURE_ENABLED_BY_DEFAULT);



}


#else

#include "src/chrome/browser/media/router/media_router_feature.cc"


#endif



