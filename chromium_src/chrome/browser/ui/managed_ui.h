#ifndef MISES_BROWSER_UI_MANAGED_UI_H_
#define MISES_BROWSER_UI_MANAGED_UI_H_

#include <string>

#include "build/build_config.h"
#include "build/chromeos_buildflags.h"
#include "third_party/abseil-cpp/absl/types/optional.h"



#if BUILDFLAG(IS_ANDROID)

#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (0)


#include "src/chrome/browser/ui/managed_ui.h"
#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (1)

#else

#include "src/chrome/browser/ui/managed_ui.h"


#endif

#endif  // CHROME_BROWSER_UI_MANAGED_UI_H_
