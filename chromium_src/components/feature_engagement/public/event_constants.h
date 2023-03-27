#ifndef MISES_COMPONENTS_FEATURE_ENGAGEMENT_PUBLIC_EVENT_CONSTANTS_H_
#define MISES_COMPONENTS_FEATURE_ENGAGEMENT_PUBLIC_EVENT_CONSTANTS_H_

#include "build/build_config.h"


#if BUILDFLAG(IS_ANDROID)

#undef BUILDFLAG_INTERNAL_IS_LINUX
#define BUILDFLAG_INTERNAL_IS_LINUX() (1)


#include "src/components/feature_engagement/public/event_constants.h"
#undef BUILDFLAG_INTERNAL_IS_LINUX
#define BUILDFLAG_INTERNAL_IS_LINUX() (0)

#else

#include "src/components/feature_engagement/public/event_constants.h"


#endif


#endif  // COMPONENTS_FEATURE_ENGAGEMENT_PUBLIC_EVENT_CONSTANTS_H_
