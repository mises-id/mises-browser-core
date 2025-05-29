#include "third_party/blink/renderer/modules/webgl/gpu_fingerprint.h"

#include "base/command_line.h"
#include "base/strings/string_number_conversions.h"
#include "base/strings/string_util.h"
#include "mises/components/ungoogled/ungoogled_switches.h"
#include "third_party/blink/renderer/modules/webgl/gpu_info.h"


// https://download.nvidia.com/XFree86/Linux-x86_64/570.144/README/supportedchips.html
// https://deviceandbrowserinfo.com/data/fingerprints/attribute/webGLRenderer
// https://devicehunt.com/view/type/pci/vendor/10DE

namespace blink {

namespace {

// Returns the appropriate GL_VENDOR string based on platform
std::string GetGLVendorString(const std::string& platform) {
  if (platform == "macos") {
    return "Google Inc. (Apple)";
  } else if (platform == "linux") {
    return "Google Inc. (NVIDIA Corporation)";
  } else {
    // Windows
    return "Google Inc. (NVIDIA)";
  }
}

// Returns a GL_RENDERER string based on platform and fingerprint
std::string GetGLRendererString(const std::string& platform, uint32_t fingerprint) {
  if (platform == "macos") {
    // Use helper function to get macOS GPU string
    return GetMacosGpuString(fingerprint % kMacosGpuModelCount);
  } else if (platform == "linux") {
    // For Linux, get the basic GPU model but format for Linux
    size_t model_index = fingerprint % GetGpuCount();
    // Get the Windows GPU info to extract the model name
    const GpuInfo& gpu_info = GetGpuInfo(model_index);
    // Format for Linux (no device ID, different suffix)
    return GetLinuxGpuString(gpu_info.model_name);
  } else {
    // Default to Windows format
    return GetGpuInfo(fingerprint % GetGpuCount()).renderer_string;
  }
}

}  // namespace

// Public functions that will be used in WebGL code
std::string GetGLVendorStringForFingerprint() {
  const base::CommandLine* command_line = base::CommandLine::ForCurrentProcess();
  std::string platform = "windows";  // Default platform
  
  if (command_line->HasSwitch(switches::kFingerprintPlatform)) {
    platform = base::ToLowerASCII(
        command_line->GetSwitchValueASCII(switches::kFingerprintPlatform));
  }
  
  return GetGLVendorString(platform);
}

std::string GetGLRendererStringForFingerprint() {
  const base::CommandLine* command_line = base::CommandLine::ForCurrentProcess();
  std::string platform = "windows";  // Default platform
  uint32_t fingerprint = 0;  // Default fingerprint
  
  if (command_line->HasSwitch(switches::kFingerprintPlatform)) {
    platform = base::ToLowerASCII(
        command_line->GetSwitchValueASCII(switches::kFingerprintPlatform));
  }
  
  if (command_line->HasSwitch(switches::kFingerprint)) {
    std::string fingerprint_str = 
        command_line->GetSwitchValueASCII(switches::kFingerprint);
    base::StringToUint(fingerprint_str, &fingerprint);
  }
  
  return GetGLRendererString(platform, fingerprint);
}

bool GLFingerprintEnabled() {
  const base::CommandLine* command_line = base::CommandLine::ForCurrentProcess();
  return command_line->HasSwitch(switches::kFingerprint);

}

}  // namespace blink