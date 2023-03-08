#ifndef MISES_BROWSER_UI_SIGNIN_VIEW_CONTROLLER_H_
#define MISES_BROWSER_UI_SIGNIN_VIEW_CONTROLLER_H_

#include <string>

#include "base/callback.h"
#include "base/gtest_prod_util.h"
#include "base/memory/raw_ptr.h"
#include "base/memory/weak_ptr.h"
#include "build/build_config.h"
#include "build/chromeos_buildflags.h"
#include "chrome/browser/ui/profile_chooser_constants.h"
#include "chrome/browser/ui/signin_modal_dialog.h"
#include "chrome/browser/ui/webui/signin/signin_utils.h"
#include "components/signin/public/base/signin_buildflags.h"
#include "third_party/skia/include/core/SkColor.h"
#include "url/gurl.h"

#if BUILDFLAG(ENABLE_DICE_SUPPORT) || BUILDFLAG(IS_CHROMEOS_LACROS)
#include "chrome/browser/ui/webui/signin/signin_email_confirmation_dialog.h"
#endif


#if BUILDFLAG(IS_ANDROID)

#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (0)


#include "src/chrome/browser/ui/signin_view_controller.h"
#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (1)

#else

#include "src/chrome/browser/ui/signin_view_controller.h"


#endif



#endif  // CHROME_BROWSER_UI_SIGNIN_VIEW_CONTROLLER_H_
