#ifndef MISES_BROWSER_SIGNIN_SIGNIN_UTIL_H_
#define MISES_BROWSER_SIGNIN_SIGNIN_UTIL_H_

#include <string>

#include "base/files/file_path.h"
#include "base/supports_user_data.h"
#include "build/build_config.h"
#include "build/chromeos_buildflags.h"
#include "components/signin/public/base/signin_metrics.h"
#include "components/signin/public/identity_manager/tribool.h"



#if BUILDFLAG(IS_ANDROID)

#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (0)


#include "src/chrome/browser/signin/signin_util.h"
#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (1)

#else

#include "src/chrome/browser/signin/signin_util.h"


#endif


#endif  // CHROME_BROWSER_SIGNIN_SIGNIN_UTIL_H_
