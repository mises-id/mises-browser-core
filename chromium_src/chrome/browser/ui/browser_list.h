#ifndef MISES_BROWSER_UI_BROWSER_LIST_H_
#define MISES_BROWSER_UI_BROWSER_LIST_H_

#include <stddef.h>

#include <vector>

#include "base/callback_forward.h"
#include "base/containers/flat_set.h"
#include "base/lazy_instance.h"
#include "base/observer_list.h"
#include "build/build_config.h"

#if BUILDFLAG(IS_ANDROID)

#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (0)


#include "src/chrome/browser/ui/browser_list.h"
#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (1)

#else

#include "src/chrome/browser/ui/browser_list.h"


#endif


#endif  // CHROME_BROWSER_UI_BROWSER_LIST_H_
