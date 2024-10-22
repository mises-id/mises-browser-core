#ifndef MISES_COMPONENTS_SUPERVISED_USER_CORE_COMMON_FEATURES_H_
#define MISES_COMPONENTS_SUPERVISED_USER_CORE_COMMON_FEATURES_H_


#include "src/components/supervised_user/core/common/features.h"


namespace supervised_user {

#if BUILDFLAG(IS_ANDROID)
BASE_DECLARE_FEATURE(kEnableExtensionsPermissionsForSupervisedUsersOnDesktop);
#endif

}  // namespace supervised_user

#endif  // COMPONENTS_SUPERVISED_USER_CORE_COMMON_FEATURES_H_