#include "extensions/renderer/bindings/api_binding_util.h"
#define GetPlatformString GetPlatformString_Chromium
#include "src/extensions/renderer/bindings/api_binding_util.cc"
#undef GetPlatformString

namespace extensions {
namespace binding {
  std::string GetPlatformString() {
  #if BUILDFLAG(IS_ANDROID)
    return "android";
  #else
    return GetPlatformString_Chromium();
  #endif
  }
}
}
