#include "survey_config.h"
#include "base/feature_list.h"
#include "base/features.h"
#if BUILDFLAG(IS_ANDROID)
#include "base/no_destructor.h"
#include "components/permissions/constants.h"  
#include "components/permissions/permission_hats_trigger_helper.h"
#include "chrome/browser/ui/hats/trust_safety_sentiment_service_factory.h"
namespace permissions {

}

TrustSafetySentimentService* TrustSafetySentimentServiceFactory::GetForProfile(
    Profile* profile) {
  return nullptr;
}

TrustSafetySentimentServiceFactory::TrustSafetySentimentServiceFactory()
    : ProfileKeyedServiceFactory(
          "TrustSafetySentimentService",
          ProfileSelections::Builder()
              .WithRegular(ProfileSelection::kOriginalOnly)
              // TODO(crbug.com/40257657): Check if this service is needed in
              // Guest mode.
              .WithGuest(ProfileSelection::kOriginalOnly)
              // TODO(crbug.com/41488885): Check if this service is needed for
              // Ash Internals.
              .WithAshInternals(ProfileSelection::kOriginalOnly)
              .Build()) {
  //DependsOn(HatsServiceFactory::GetInstance());
  //DependsOn(HostContentSettingsMapFactory::GetInstance());
}

TrustSafetySentimentServiceFactory*
TrustSafetySentimentServiceFactory::GetInstance() {
  static base::NoDestructor<TrustSafetySentimentServiceFactory> instance;
  return instance.get();
}

KeyedService* TrustSafetySentimentServiceFactory::BuildServiceInstanceFor(
    content::BrowserContext* context) const {
  return nullptr;
}


#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (0)


#include "src/chrome/browser/ui/hats/survey_config.cc"
#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (1)


constexpr char kHatsSurveyTriggerAndroidStartupSurvey[] = "startup_survey";
constexpr char kHatsSurveyTriggerQuickDelete[] = "quick_delete_survey";
constexpr char kHatsSurveyTriggerSafetyHubAndroid[] =
    "safety_hub_android_survey";

#else

#include "src/chrome/browser/ui/hats/survey_config.cc"


#endif

