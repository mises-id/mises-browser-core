#ifndef MISES_BROWSER_SIGNIN_ACCOUNT_CONSISTENCY_MODE_MANAGER_H_
#define MISES_BROWSER_SIGNIN_ACCOUNT_CONSISTENCY_MODE_MANAGER_H_

#include "base/feature_list.h"
#include "base/gtest_prod_util.h"
#include "base/memory/raw_ptr.h"
#include "build/buildflag.h"
#include "components/keyed_service/core/keyed_service.h"
#include "components/prefs/pref_member.h"
#include "components/signin/public/base/account_consistency_method.h"
#include "components/signin/public/base/signin_buildflags.h"


#if BUILDFLAG(IS_ANDROID)

#undef BUILDFLAG_INTERNAL_ENABLE_DICE_SUPPORT
#define BUILDFLAG_INTERNAL_ENABLE_DICE_SUPPORT() (1)


#include "src/chrome/browser/signin/account_consistency_mode_manager.h"
#undef BUILDFLAG_INTERNAL_ENABLE_DICE_SUPPORT
#define BUILDFLAG_INTERNAL_ENABLE_DICE_SUPPORT() (0)

#else

#include "src/chrome/browser/signin/account_consistency_mode_manager.h"


#endif


#endif  // CHROME_BROWSER_SIGNIN_ACCOUNT_CONSISTENCY_MODE_MANAGER_H_
