#ifndef MISES_COMPONENTS_LIVE_CAPTION_PREF_NAMES_H_
#define MISES_COMPONENTS_LIVE_CAPTION_PREF_NAMES_H_

#include <string>

#include "build/build_config.h"


#if BUILDFLAG(IS_ANDROID)

#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (0)
#undef ANDROID

#include "src/components/live_caption/pref_names.h"
#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (1)

#define ANDROID 1
#else

#include "src/components/live_caption/pref_names.h"


#endif


#endif  // COMPONENTS_LIVE_CAPTION_PREF_NAMES_H_
