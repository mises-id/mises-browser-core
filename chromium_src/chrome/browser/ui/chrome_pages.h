#ifndef MISES_BROWSER_UI_CHROME_PAGES_H_
#define MISES_BROWSER_UI_CHROME_PAGES_H_

#include <stdint.h>

#include <string>

#include "build/branding_buildflags.h"
#include "build/build_config.h"
#include "build/chromeos_buildflags.h"
#include "components/content_settings/core/common/content_settings_types.h"
#include "components/services/app_service/public/cpp/app_launch_util.h"
#include "components/signin/public/base/signin_buildflags.h"
#include "url/gurl.h"

#if !BUILDFLAG(IS_ANDROID)
#include "chrome/browser/signin/signin_promo.h"
#endif

#if BUILDFLAG(IS_CHROMEOS_ASH)
#include "chrome/browser/ui/webui/settings/ash/app_management/app_management_uma.h"
#endif


#if BUILDFLAG(IS_ANDROID)

#undef BUILDFLAG_INTERNAL_IS_LINUX
#define BUILDFLAG_INTERNAL_IS_LINUX() (1)


#include "src/chrome/browser/ui/chrome_pages.h"
#undef BUILDFLAG_INTERNAL_IS_LINUX
#define BUILDFLAG_INTERNAL_IS_LINUX() (0)

#else

#include "src/chrome/browser/ui/chrome_pages.h"


#endif



#endif  // CHROME_BROWSER_UI_CHROME_PAGES_H_
