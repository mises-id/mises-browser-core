#include "build/build_config.h"
#include "chrome/common/url_constants.h"
#if BUILDFLAG(IS_ANDROID)
namespace chrome {
  const char kMisesNewTabURL[] = "chrome-search://local-ntp/local-ntp.html";
}
#define kChromeUINativeNewTabURL kMisesNewTabURL
#endif
#include "src/chrome/browser/sessions/chrome_serialized_navigation_driver.cc"
