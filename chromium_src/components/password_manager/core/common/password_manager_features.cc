#include "src/components/password_manager/core/common/password_manager_features.cc"


namespace password_manager::features {

#if BUILDFLAG(IS_ANDROID) 
BASE_FEATURE(kRevampedPasswordManagementBubble,
             "RevampedPasswordManagementBubble",
             base::FEATURE_DISABLED_BY_DEFAULT);
BASE_FEATURE(kMemoryMapWeaknessCheckDictionaries,
             "MemoryMapWeaknessCheckDictionaries",
             base::FEATURE_DISABLED_BY_DEFAULT);
BASE_FEATURE(kPasswordManagerRedesign,
             "PasswordManagerRedesign",
             base::FEATURE_DISABLED_BY_DEFAULT);
#endif

}  // namespace password_manager::features

