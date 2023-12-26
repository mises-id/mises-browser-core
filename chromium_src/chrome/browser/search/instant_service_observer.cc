#include "src/chrome/browser/search/instant_service_observer.cc"
#if BUILDFLAG(IS_ANDROID)
#include "chrome/browser/search/instant_service_factory.h"

#include "base/feature_list.h"
#include "base/trace_event/trace_event.h"
#include "chrome/browser/profiles/profile.h"

InstantService* InstantServiceFactory::GetForProfile(Profile* profile) {
  return nullptr;
}




#endif

