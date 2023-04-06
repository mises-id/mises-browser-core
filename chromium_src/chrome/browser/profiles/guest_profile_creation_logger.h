#ifndef MISES_BROWSER_PROFILES_GUEST_PROFILE_CREATION_LOGGER_H_
#define MISES_BROWSER_PROFILES_GUEST_PROFILE_CREATION_LOGGER_H_

#include "build/build_config.h"


#if BUILDFLAG(IS_ANDROID)

#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (0)


#include "src/chrome/browser/profiles/guest_profile_creation_logger.h"
#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (1)

#else

#include "src/chrome/browser/profiles/guest_profile_creation_logger.h"


#endif


#endif  // CHROME_BROWSER_PROFILES_GUEST_PROFILE_CREATION_LOGGER_H_
