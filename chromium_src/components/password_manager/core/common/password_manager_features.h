#ifndef MISES_COMPONENTS_PASSWORD_MANAGER_CORE_COMMON_PASSWORD_MANAGER_FEATURES_H_
#define MISES_COMPONENTS_PASSWORD_MANAGER_CORE_COMMON_PASSWORD_MANAGER_FEATURES_H_

#include "src/components/password_manager/core/common/password_manager_features.h"


namespace password_manager::features {

#if BUILDFLAG(IS_ANDROID) 
BASE_DECLARE_FEATURE(kRevampedPasswordManagementBubble);
BASE_DECLARE_FEATURE(kMemoryMapWeaknessCheckDictionaries);
BASE_DECLARE_FEATURE(kPasswordManagerRedesign);
#endif

}  // namespace password_manager::features

#endif  // COMPONENTS_PASSWORD_MANAGER_CORE_COMMON_PASSWORD_MANAGER_FEATURES_H_
