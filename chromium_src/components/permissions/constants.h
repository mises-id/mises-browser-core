#ifndef MISES_COMPONENTS_PERMISSIONS_CONSTANTS_H_
#define MISES_COMPONENTS_PERMISSIONS_CONSTANTS_H_

#include "base/component_export.h"
#include "build/build_config.h"


#if BUILDFLAG(IS_ANDROID)

#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (0)


#include "src/components/permissions/constants.h"
#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (1)

#else

#include "src/components/permissions/constants.h"


#endif



#endif  // COMPONENTS_PERMISSIONS_CONSTANTS_H_
