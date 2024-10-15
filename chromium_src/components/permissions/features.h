#ifndef MISES_COMPONENTS_PERMISSIONS_FEATURES_H_
#define MISES_COMPONENTS_PERMISSIONS_FEATURES_H_

#include "src/components/permissions/features.h"
#include "base/feature_list.h"
#include "base/metrics/field_trial_params.h"
#include "build/build_config.h"

namespace permissions {
namespace features {

COMPONENT_EXPORT(PERMISSIONS_COMMON)
BASE_DECLARE_FEATURE(kPermissionLifetime);

#if BUILDFLAG(IS_ANDROID)


#endif  // BUILDFLAG(IS_ANDROID)

}  // namespace features
namespace feature_params {



}  // namespace feature_params
}  // namespace permissions

#endif  // COMPONENTS_PERMISSIONS_FEATURES_H_
