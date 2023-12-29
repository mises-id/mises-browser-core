
#include "src/components/password_manager/core/browser/features/password_features.cc"

namespace password_manager::features {

#if BUILDFLAG(IS_ANDROID) 
BASE_FEATURE(kNewConfirmationBubbleForGeneratedPasswords,
             "NewConfirmationBubbleForGeneratedPasswords",
             base::FEATURE_DISABLED_BY_DEFAULT);
#endif  // !BUILDFLAG(IS_ANDROID) && !BUILDFLAG(IS_IOS)

}
