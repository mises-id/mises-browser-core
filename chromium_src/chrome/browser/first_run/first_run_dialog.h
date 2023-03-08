#ifndef MISES_BROWSER_FIRST_RUN_FIRST_RUN_DIALOG_H_
#define MISES_BROWSER_FIRST_RUN_FIRST_RUN_DIALOG_H_

#include "base/callback_forward.h"
#include "build/build_config.h"
#include "build/chromeos_buildflags.h"


#if BUILDFLAG(IS_ANDROID)

#undef BUILDFLAG_INTERNAL_IS_LINUX
#define BUILDFLAG_INTERNAL_IS_LINUX() (1)


#include "src/chrome/browser/first_run/first_run_dialog.h"
#undef BUILDFLAG_INTERNAL_IS_LINUX
#define BUILDFLAG_INTERNAL_IS_LINUX() (0)

#else

#include "src/chrome/browser/first_run/first_run_dialog.h"


#endif

#endif  // CHROME_BROWSER_FIRST_RUN_FIRST_RUN_DIALOG_H_
