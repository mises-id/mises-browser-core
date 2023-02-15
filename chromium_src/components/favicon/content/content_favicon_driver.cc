#include "build/build_config.h"
#include "src/components/favicon/core/favicon_driver_observer.h"
#if BUILDFLAG(IS_ANDROID)
#define NON_TOUCH_16_DIP TOUCH_LARGEST || notification_icon_type == FaviconDriverObserver::NON_TOUCH_LARGEST
#endif

#include "src/components/favicon/content/content_favicon_driver.cc"

#if BUILDFLAG(IS_ANDROID)
#undef NON_TOUCH_16_DIP
#endif
