#include "build/build_config.h"
#include "chrome/common/url_constants.h"
namespace chrome {
  const char kMisesNewTabURL[] = "chrome-search://local-ntp/local-ntp.html";
}
#define kChromeUINativeNewTabURL kMisesNewTabURL
#include "src/chrome/browser/sessions/chrome_serialized_navigation_driver.cc"
