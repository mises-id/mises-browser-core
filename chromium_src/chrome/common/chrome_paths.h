#ifndef MISES_COMMON_CHROME_PATHS_H__
#define MISES_COMMON_CHROME_PATHS_H__

#include "build/branding_buildflags.h"
#include "build/build_config.h"
#include "build/chromeos_buildflags.h"
#include "third_party/widevine/cdm/buildflags.h"


#if BUILDFLAG(IS_ANDROID)

#undef BUILDFLAG_INTERNAL_IS_LINUX
#define BUILDFLAG_INTERNAL_IS_LINUX() (1)


#include "src/chrome/common/chrome_paths.h"
#undef BUILDFLAG_INTERNAL_IS_LINUX
#define BUILDFLAG_INTERNAL_IS_LINUX() (0)

#else

#include "src/chrome/common/chrome_paths.h"


#endif


#endif  // CHROME_COMMON_CHROME_PATHS_H__
