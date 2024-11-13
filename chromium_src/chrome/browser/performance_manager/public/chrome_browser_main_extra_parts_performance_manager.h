#ifndef MISES_BROWSER_PERFORMANCE_MANAGER_PUBLIC_CHROME_BROWSER_MAIN_EXTRA_PARTS_PERFORMANCE_MANAGER_H_
#define MISES_BROWSER_PERFORMANCE_MANAGER_PUBLIC_CHROME_BROWSER_MAIN_EXTRA_PARTS_PERFORMANCE_MANAGER_H_

#include <memory>

#include "base/scoped_multi_source_observation.h"
#include "build/build_config.h"
#include "chrome/browser/chrome_browser_main_extra_parts.h"
#include "chrome/browser/profiles/profile.h"
#include "chrome/browser/profiles/profile_manager_observer.h"
#include "chrome/browser/profiles/profile_observer.h"
#include "extensions/buildflags/buildflags.h"


#if BUILDFLAG(IS_ANDROID)

#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (0)


#include "src/chrome/browser/performance_manager/public/chrome_browser_main_extra_parts_performance_manager.h"
#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (1)


#else

#include "src/chrome/browser/performance_manager/public/chrome_browser_main_extra_parts_performance_manager.h"


#endif

#endif  // CHROME_BROWSER_UI_BROWSER_DIALOGS_H_
