
#ifndef MISES_BROWSER_PRIVACY_SANDBOX_PRIVACY_SANDBOX_SURVEY_DESKTOP_CONTROLLER_H_
#define MISES_BROWSER_PRIVACY_SANDBOX_PRIVACY_SANDBOX_SURVEY_DESKTOP_CONTROLLER_H_

#include "build/build_config.h"
#include "chrome/browser/profiles/profile.h"
#include "components/keyed_service/core/keyed_service.h"
#include "components/privacy_sandbox/privacy_sandbox_survey_service.h"


#if BUILDFLAG(IS_ANDROID)

#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (0)


#include "src/chrome/browser/privacy_sandbox/privacy_sandbox_survey_desktop_controller.h"
#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (1)

#else

#include "src/chrome/browser/privacy_sandbox/privacy_sandbox_survey_desktop_controller.h"


#endif

#endif