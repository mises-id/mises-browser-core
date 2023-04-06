#ifndef MISES_COMPONENTS_PERFORMANCE_MANAGER_PUBLIC_FEATURES_H_
#define MISES_COMPONENTS_PERFORMANCE_MANAGER_PUBLIC_FEATURES_H_

#include "base/feature_list.h"
#include "base/metrics/field_trial_params.h"
#include "base/time/time.h"
#include "build/build_config.h"


#if BUILDFLAG(IS_ANDROID)

#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (0)


#include "src/components/performance_manager/public/features.h"
#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (1)

#else

#include "src/components/performance_manager/public/features.h"


#endif


#endif  // COMPONENTS_PERFORMANCE_MANAGER_PUBLIC_FEATURES_H_
