#ifndef MISES_PASSWORD_MANAGER_CORE_BROWSER_PASSWORD_FEATURE_MANAGER_IMPL_H_
#define MISES_PASSWORD_MANAGER_CORE_BROWSER_PASSWORD_FEATURE_MANAGER_IMPL_H_

#include <string>

#include "build/build_config.h"


#if BUILDFLAG(IS_ANDROID)

#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (0)
#undef ANDROID

#include "src/components/password_manager/core/browser/password_feature_manager_impl.h"
#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (1)

#define ANDROID 1
#else

#include "src/components/password_manager/core/browser/password_feature_manager_impl.h"


#endif


#endif  // COMPONENTS_LIVE_CAPTION_PREF_NAMES_H_

