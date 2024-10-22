#include "src/components/supervised_user/core/common/features.cc"


namespace supervised_user {

#if BUILDFLAG(IS_ANDROID) 
BASE_FEATURE(kEnableExtensionsPermissionsForSupervisedUsersOnDesktop,
             "EnableExtensionsPermissionsForSupervisedUsersOnDesktop",
             base::FEATURE_DISABLED_BY_DEFAULT);
#endif
}