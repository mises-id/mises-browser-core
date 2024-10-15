#include "src/components/permissions/features.cc"

namespace permissions {
namespace features {


BASE_FEATURE(kPermissionLifetime,
             "PermissionLifetime",
             base::FEATURE_ENABLED_BY_DEFAULT);
             
#if BUILDFLAG(IS_ANDROID)

#endif  // BUILDFLAG(IS_ANDROID)

}  // namespace features
namespace feature_params {


#if BUILDFLAG(IS_ANDROID)


#endif  // !BUILDFLAG(IS_ANDROID)

}  // namespace feature_params
}  // namespace permissions
