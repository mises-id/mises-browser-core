#ifndef MISES_COMPONENTS_PERMISSIONS_FEATURES_H_
#define MISES_COMPONENTS_PERMISSIONS_FEATURES_H_

#include "src/components/permissions/features.h"
#include "base/feature_list.h"
#include "base/metrics/field_trial_params.h"
#include "build/build_config.h"

namespace permissions {
namespace features {

#if BUILDFLAG(IS_ANDROID)
COMPONENT_EXPORT(PERMISSIONS_COMMON)
extern const base::Feature kPermissionsPostPromptSurvey;

#endif  // BUILDFLAG(IS_ANDROID)

}  // namespace features
namespace feature_params {


#if BUILDFLAG(IS_ANDROID)
COMPONENT_EXPORT(PERMISSIONS_COMMON)
extern const base::FeatureParam<std::string>
    kPermissionsPostPromptSurveyTriggerId;

COMPONENT_EXPORT(PERMISSIONS_COMMON)
extern const base::FeatureParam<std::string>
    kPermissionsPostPromptSurveyRequestTypeFilter;

COMPONENT_EXPORT(PERMISSIONS_COMMON)
extern const base::FeatureParam<std::string>
    kPermissionsPostPromptSurveyActionFilter;
#endif

}  // namespace feature_params
}  // namespace permissions

#endif  // COMPONENTS_PERMISSIONS_FEATURES_H_
