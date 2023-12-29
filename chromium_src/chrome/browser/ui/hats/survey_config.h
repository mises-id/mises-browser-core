#ifndef MISES_BROWSER_UI_HATS_SURVEY_CONFIG_H_
#define MISES_BROWSER_UI_HATS_SURVEY_CONFIG_H_


#include <string>
#include <vector>

#include "base/feature_list.h"


#if BUILDFLAG(IS_ANDROID)

#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (0)


#include "src/chrome/browser/ui/hats/survey_config.h"
#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (1)

#else

#include "src/chrome/browser/ui/hats/survey_config.h"


#endif

#endif  // CHROME_BROWSER_UI_HATS_SURVEY_CONFIG_H_
