#ifndef MISES_COMPONENTS_PASSWORD_MANAGER_CORE_BROWSER_FEATURES_PASSWORD_FEATURES_H_
#define MISES_COMPONENTS_PASSWORD_MANAGER_CORE_BROWSER_FEATURES_PASSWORD_FEATURES_H_

#include "src/components/password_manager/core/browser/features/password_features.h"

namespace password_manager::features {

#if BUILDFLAG(IS_ANDROID) 
BASE_DECLARE_FEATURE(kNewConfirmationBubbleForGeneratedPasswords);
#endif  // !BUILDFLAG(IS_ANDROID) && !BUILDFLAG(IS_IOS)

}

#endif