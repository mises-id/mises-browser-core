#include "survey_config.h"
#include "base/feature_list.h"
#include "base/features.h"
#if BUILDFLAG(IS_ANDROID)
#include "base/no_destructor.h"
#include "components/permissions/constants.h"  
#include "components/permissions/permission_hats_trigger_helper.h"
#include "chrome/browser/ui/hats/trust_safety_sentiment_service_factory.h"
namespace permissions {
// static
std::vector<std::pair<std::string, std::string>>&
PermissionHatsTriggerHelper::GetPermissionPromptTriggerIdPairs(
    const std::string& trigger_name_base) {
  static base::NoDestructor<std::vector<std::pair<std::string, std::string>>>
      trigger_id_pairs([trigger_name_base] {
        std::vector<std::pair<std::string, std::string>> pairs;
        return pairs;
      }());
  return *trigger_id_pairs;
}
}

TrustSafetySentimentService* TrustSafetySentimentServiceFactory::GetForProfile(
    Profile* profile) {
  return nullptr;
}

#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (0)


#include "src/chrome/browser/ui/hats/survey_config.cc"
#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (1)

#else

#include "src/chrome/browser/ui/hats/survey_config.cc"


#endif

