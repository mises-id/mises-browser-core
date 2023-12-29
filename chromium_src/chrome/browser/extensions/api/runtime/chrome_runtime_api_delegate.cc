#include "build/build_config.h"
#include "extensions/browser/api/runtime/runtime_api.h"
#include "extensions/browser/api/runtime/runtime_api_delegate.h"

#include "chrome/browser/extensions/api/runtime/chrome_runtime_api_delegate.h"

#define GetPlatformInfo GetPlatformInfo_Chromium
#include "src/chrome/browser/extensions/api/runtime/chrome_runtime_api_delegate.cc"
#undef GetPlatformInfo

bool ChromeRuntimeAPIDelegate::GetPlatformInfo(PlatformInfo* info) {
#if BUILDFLAG(IS_ANDROID)
  info->os = extensions::api::runtime::PlatformOs::kAndroid;;
  const char* arch = update_client::UpdateQueryParams::GetArch();
  if (strcmp(arch, "arm") == 0) {
    info->arch = extensions::api::runtime::PlatformArch::kArm;
  } else if (strcmp(arch, "arm64") == 0) {
    info->arch = extensions::api::runtime::PlatformArch::kArm64;
  } else {
    info->arch = extensions::api::runtime::PlatformArch::kArm;
  }
  info->nacl_arch = extensions::api::runtime::PlatformNaclArch::kArm;
  return true;
#else 
  return GetPlatformInfo_Chromium(info);
#endif

}
