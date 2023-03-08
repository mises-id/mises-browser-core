#ifndef MISES_CHROME_BROWSER_FIRST_RUN_UPGRADE_UTIL_H_
#define MISES_CHROME_BROWSER_FIRST_RUN_UPGRADE_UTIL_H_

#include <memory>

#include "base/callback_forward.h"
#include "build/build_config.h"
#include "build/chromeos_buildflags.h"


#if BUILDFLAG(IS_ANDROID)

#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (0)


#include "src/chrome/browser/first_run/upgrade_util.h"
#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (1)

#else

#include "src/chrome/browser/first_run/upgrade_util.h"


#endif

#endif  // CHROME_BROWSER_FIRST_RUN_UPGRADE_UTIL_H_
