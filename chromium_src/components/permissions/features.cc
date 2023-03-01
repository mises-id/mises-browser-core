#include "src/components/permissions/features.cc"

namespace permissions {
namespace features {


#if BUILDFLAG(IS_ANDROID)

// Controls whether to trigger showing a HaTS survey, with the given
// `probability` and `trigger_id`, immediately after the user has taken the
// action specified in `action_filter` on a permission prompt for the capability
// specified in `request_type_filter`. All of the above-mentioned params are
// required and should be coming from field trial params of the same name. The
// `probability` parameter is an odd-one out and is defined and handled by the
// HatsService itself.
const base::Feature kPermissionsPostPromptSurvey{
    "PermissionsPostPromptSurvey", base::FEATURE_DISABLED_BY_DEFAULT};

#endif  // BUILDFLAG(IS_ANDROID)

}  // namespace features
namespace feature_params {


#if BUILDFLAG(IS_ANDROID)
// Specifies the `trigger_id` of the HaTS survey to trigger immediately after
// the user has interacted with a permission prompt.
const base::FeatureParam<std::string> kPermissionsPostPromptSurveyTriggerId{
    &permissions::features::kPermissionsPostPromptSurvey, "trigger_id", ""};

// Specifies the type of permission request for which the post-prompt HaTS
// survey is triggered. For any given user, there is a single request type for
// which they may see a survey. Valid values are the return values of
// `GetPermissionRequestString`. An invalid or empty value will result in the
// user not seeing any post-prompt survey.
const base::FeatureParam<std::string>
    kPermissionsPostPromptSurveyRequestTypeFilter{
        &permissions::features::kPermissionsPostPromptSurvey,
        "request_type_filter", ""};

// Specifies the action for which the post-prompt HaTS survey is triggered. For
// any given user, there is a single permission action for which they may see a
// survey, of those listed in RetuPermissionUmaUtil::GetPermissionActionString.
// An invalid or empty value will result in the user not seeing any post-prompt
// survey.
const base::FeatureParam<std::string> kPermissionsPostPromptSurveyActionFilter{
    &permissions::features::kPermissionsPostPromptSurvey, "action_filter", ""};
#endif  // !BUILDFLAG(IS_ANDROID)

}  // namespace feature_params
}  // namespace permissions
