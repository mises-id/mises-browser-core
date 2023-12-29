#ifndef MISES_BROWSER_UI_SIGNIN_VIEW_CONTROLLER_H_
#define MISES_BROWSER_UI_SIGNIN_VIEW_CONTROLLER_H_

#include "build/build_config.h"

#include "base/functional/callback.h"
#include "base/gtest_prod_util.h"
#include "base/memory/raw_ptr.h"
#include "base/memory/weak_ptr.h"
#include "build/build_config.h"
#include "build/chromeos_buildflags.h"
#include "chrome/browser/ui/signin/signin_modal_dialog.h"
#include "chrome/browser/ui/webui/signin/signin_utils.h"
#include "chrome/common/url_constants.h"
#include "components/signin/public/base/signin_buildflags.h"
#include "url/gurl.h"

#if BUILDFLAG(IS_ANDROID)

#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (0)


#include "src/chrome/browser/ui/signin/signin_view_controller.h"
#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (1)

#else

#include "src/chrome/browser/ui/signin/signin_view_controller.h"


#endif



#endif  // CHROME_BROWSER_UI_SIGNIN_VIEW_CONTROLLER_H_
