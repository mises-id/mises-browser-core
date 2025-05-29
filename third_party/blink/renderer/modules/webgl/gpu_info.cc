#include "third_party/blink/renderer/modules/webgl/gpu_info.h"

#include "base/strings/stringprintf.h"

namespace blink {

// Common GPU suffix strings
const char* kWindowsGpuSuffix = "Direct3D11 vs_5_0 ps_5_0, D3D11";
const char* kLinuxGpuSuffix = "/PCIe/SSE2, OpenGL 4.5.0";

// GPU Vendor strings by platform
const char* kWindowsVendorString = "NVIDIA";  // Windows vendor in renderer
const char* kLinuxVendorString = "NVIDIA Corporation";  // Linux vendor in renderer

// MacOS GPU models
const char* kMacosGpuModels[] = {
  "M1",
  "M1 Pro",
  "M2",
  "M2 Max",
  "M2 Pro",
  "M3",
  "M3 Max",
  "M3 Pro",
  "M4",
  "M4 Max",
  "M4 Pro"
};

const size_t kMacosGpuModelCount = sizeof(kMacosGpuModels) / sizeof(kMacosGpuModels[0]);

// Windows/Linux GPU models - shared between platforms
const GpuModelInfo kGpuModels[] = {
  {"GeForce RTX 3050", "0x00002507"},
  {"GeForce RTX 3050", "0x00002582"},
  {"GeForce RTX 3050 6GB Laptop GPU", "0x000025EC"},
  {"GeForce RTX 3050 Laptop GPU", "0x000025A2"},
  {"GeForce RTX 3050 Ti Laptop GPU", "0x000025A0"},
  {"GeForce RTX 3060", "0x00002487"},
  {"GeForce RTX 3060", "0x00002503"},
  {"GeForce RTX 3060", "0x00002504"},
  {"GeForce RTX 3060 Laptop GPU", "0x00002520"},
  {"GeForce RTX 3060 Laptop GPU", "0x00002560"},
  {"GeForce RTX 3060 Ti", "0x00002486"},
  {"GeForce RTX 3060 Ti", "0x00002489"},
  {"GeForce RTX 3060 Ti", "0x000024C9"},
  {"GeForce RTX 3070", "0x00002484"},
  {"GeForce RTX 3070", "0x00002488"},
  {"GeForce RTX 3070 Ti", "0x00002482"},
  {"GeForce RTX 3070 Ti Laptop GPU", "0x000024A0"},
  {"GeForce RTX 3080", "0x00002206"},
  {"GeForce RTX 3080", "0x0000220A"},
  {"GeForce RTX 3080", "0x00002216"},
  {"GeForce RTX 3080 Laptop GPU", "0x0000249C"},
  {"GeForce RTX 3080 Laptop GPU", "0x000024DC"},
  {"GeForce RTX 3080 Ti", "0x00002208"},
  {"GeForce RTX 3080 Ti Laptop GPU", "0x00002420"},
  {"GeForce RTX 3080 Ti Laptop GPU", "0x00002460"},
  {"GeForce RTX 3090", "0x00002204"},
  {"GeForce RTX 3090 Ti", "0x00002203"},
  {"GeForce RTX 4050 Laptop GPU", "0x000028A1"},
  {"GeForce RTX 4050 Laptop GPU", "0x000028E1"},
  {"GeForce RTX 4060", "0x00002882"},
  {"GeForce RTX 4060 Laptop GPU", "0x000028A0"},
  {"GeForce RTX 4060 Laptop GPU", "0x000028E0"},
  {"GeForce RTX 4060 Ti", "0x00002803"},
  {"GeForce RTX 4060 Ti", "0x00002805"},
  {"GeForce RTX 4070", "0x00002786"},
  {"GeForce RTX 4070 Laptop GPU", "0x00002820"},
  {"GeForce RTX 4070 Laptop GPU", "0x00002860"},
  {"GeForce RTX 4070 SUPER", "0x00002783"},
  {"GeForce RTX 4070 Ti", "0x00002782"},
  {"GeForce RTX 4070 Ti SUPER", "0x00002705"},
  {"GeForce RTX 4080", "0x00002704"},
  {"GeForce RTX 4080 Laptop GPU", "0x000027A0"},
  {"GeForce RTX 4080 Laptop GPU", "0x000027E0"},
  {"GeForce RTX 4080 SUPER", "0x00002702"},
  {"GeForce RTX 4090", "0x00002684"},
  {"GeForce RTX 4090 Laptop GPU", "0x00002717"},
  {"GeForce RTX 4090 Laptop GPU", "0x00002757"},
  {"GeForce RTX 5070", "0x00002F04"},
  {"GeForce RTX 5070 Ti", "0x00002C05"},
  {"GeForce RTX 5070 Ti Laptop GPU", "0x00002F18"},
  {"GeForce RTX 5070 Ti Laptop GPU", "0x00002F58"},
  {"GeForce RTX 5080", "0x00002C02"},
  {"GeForce RTX 5080 Laptop GPU", "0x00002C19"},
  {"GeForce RTX 5080 Laptop GPU", "0x00002C59"},
  {"GeForce RTX 5090", "0x00002B85"},
  {"GeForce RTX 5090 Laptop GPU", "0x00002C18"},
  {"GeForce RTX 5090 Laptop GPU", "0x00002C58"},
};

const size_t kGpuModelCount = sizeof(kGpuModels) / sizeof(kGpuModels[0]);

// Generate full Windows GPU info on demand
GpuInfo GetWindowsGpuInfo(size_t index) {
  if (index >= kGpuModelCount) {
    // Default to last one (RTX 4090) if out of bounds
    index = kGpuModelCount - 1;
  }
  
  const GpuModelInfo& model = kGpuModels[index];
  GpuInfo info;
  info.model_name = model.model_name;
  info.device_id = model.device_id;
  
  // Build the Windows renderer string
  std::string device_id_part = (model.device_id && model.device_id[0]) ? 
    " (" + std::string(model.device_id) + ")" : "";
  
  info.renderer_string = "ANGLE (" + std::string(kWindowsVendorString) + 
                         ", NVIDIA " + info.model_name + 
                         device_id_part + " " + kWindowsGpuSuffix + ")";
  
  return info;
}

// All Windows GPU info list - generated from kGpuModels
std::vector<GpuInfo> GetAllWindowsGpuInfo() {
  std::vector<GpuInfo> result;
  result.reserve(kGpuModelCount);
  
  for (size_t i = 0; i < kGpuModelCount; ++i) {
    result.push_back(GetWindowsGpuInfo(i));
  }
  
  return result;
}

// Lazy-initialized list of Windows GPU info
const std::vector<GpuInfo>& GetWindowsGpuInfoList() {
  static const std::vector<GpuInfo>* windows_gpu_info = nullptr;
  if (!windows_gpu_info) {
    windows_gpu_info = new std::vector<GpuInfo>(GetAllWindowsGpuInfo());
  }
  return *windows_gpu_info;
}

// Implementation of the functions declared in the header
size_t GetGpuCount() {
  return kGpuModelCount;
}

const GpuInfo& GetGpuInfo(size_t index) {
  // Use the Windows GPU info list
  const std::vector<GpuInfo>& windows_list = GetWindowsGpuInfoList();
  
  // Ensure index is in bounds
  if (index >= windows_list.size()) {
    return windows_list.back();
  }
  
  return windows_list[index];
}

// Helper function to get a macOS GPU model string
std::string GetMacosGpuString(size_t index) {
  if (index >= kMacosGpuModelCount) {
    // Default to M3 if out of bounds
    index = kMacosGpuModelCount - 1;  // Index of M3 in the array
  }
  
  return base::StringPrintf("ANGLE (Apple, ANGLE Metal Renderer: Apple %s, Unspecified Version)",
                         kMacosGpuModels[index]);
}

// Helper function to get a Linux GPU renderer string
std::string GetLinuxGpuString(const std::string& model_name) {
  // Note the difference: no device ID and no space before /PCIe
  // Also using the Linux-specific vendor string
  return base::StringPrintf("ANGLE (%s, NVIDIA %s%s)",
                         kLinuxVendorString,
                         model_name.c_str(),
                         kLinuxGpuSuffix);
}

}  // namespace blink