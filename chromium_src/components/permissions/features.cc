#include "src/components/permissions/features.cc"

namespace permissions {
namespace features {


#if BUILDFLAG(IS_ANDROID)

BASE_FEATURE(kPermissionsPromptSurvey,
             "PermissionsPromptSurvey",
             base::FEATURE_DISABLED_BY_DEFAULT);

#endif  // BUILDFLAG(IS_ANDROID)

}  // namespace features
namespace feature_params {


#if BUILDFLAG(IS_ANDROID)

const base::FeatureParam<std::string> kPermissionsPromptSurveyTriggerId{
    &permissions::features::kPermissionsPromptSurvey, "trigger_id", ""};

const base::FeatureParam<std::string> kPermissionsPromptSurveyRequestTypeFilter{
    &permissions::features::kPermissionsPromptSurvey, "request_type_filter",
    ""};

const base::FeatureParam<std::string> kPermissionsPromptSurveyActionFilter{
    &permissions::features::kPermissionsPromptSurvey, "action_filter", ""};

#endif  // !BUILDFLAG(IS_ANDROID)

}  // namespace feature_params
}  // namespace permissions
