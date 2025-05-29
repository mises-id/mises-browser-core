#ifndef THIRD_PARTY_BLINK_RENDERER_MODULES_WEBGL_GPU_INFO_H_
#define THIRD_PARTY_BLINK_RENDERER_MODULES_WEBGL_GPU_INFO_H_

#include <string>
#include <vector>

namespace blink {

// Structure to hold GPU information
struct GpuInfo {
  std::string model_name;
  std::string device_id;
  std::string renderer_string;
};

// Structure for basic GPU model info
struct GpuModelInfo {
  const char* model_name;
  const char* device_id;  // Only used for Windows
};

// MacOS GPU models - can be expanded in the future
extern const char* kMacosGpuModels[];
extern const size_t kMacosGpuModelCount;

// GPU Vendor strings
extern const char* kWindowsVendorString;  // For Windows renderer
extern const char* kLinuxVendorString;    // For Linux renderer

// Platform-specific suffix strings
extern const char* kWindowsGpuSuffix;
extern const char* kLinuxGpuSuffix;

// Returns the number of available GPUs in our database
size_t GetGpuCount();

// Returns GPU info for a given index
const GpuInfo& GetGpuInfo(size_t index);

// Helper function to get a macOS GPU model string
std::string GetMacosGpuString(size_t index);

// Helper function to get a Linux GPU renderer string
std::string GetLinuxGpuString(const std::string& model_name);

// Generate Windows GPU info for a specific index
GpuInfo GetWindowsGpuInfo(size_t index);

// Access to all Windows GPU info
const std::vector<GpuInfo>& GetWindowsGpuInfoList();

}  // namespace blink

#endif  // THIRD_PARTY_BLINK_RENDERER_MODULES_WEBGL_GPU_INFO_H_