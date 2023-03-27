#ifndef MISES_COMPONENTS_URL_FORMATTER_ELIDE_URL_H_
#define MISES_COMPONENTS_URL_FORMATTER_ELIDE_URL_H_

#include <string>

#include "build/build_config.h"


#if BUILDFLAG(IS_ANDROID)

#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (0)


#include "src/components/url_formatter/elide_url.h"
#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (1)

#else

#include "src/components/url_formatter/elide_url.h"


#endif


#endif  // COMPONENTS_URL_FORMATTER_ELIDE_URL_H_
