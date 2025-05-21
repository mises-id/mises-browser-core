#include "base/command_line.h"
#include "components/ungoogled/ungoogled_switches.h"

#include "src/third_party/blink/common/user_agent/user_agent_metadata.cc"


namespace blink {


void UpdateUserAgentMetadataFingerprint(blink::UserAgentMetadata* metadata) {
  if (!metadata)
    return;

  const base::CommandLine* command_line = base::CommandLine::ForCurrentProcess();

  // Handle brand information
  std::string display_brand;
  std::string version;
  std::string main_version;

  if (command_line->HasSwitch(switches::kFingerprintBrand)) {
    std::string custom_brand = command_line->GetSwitchValueASCII(switches::kFingerprintBrand);
    std::string custom_version = command_line->HasSwitch(switches::kFingerprintBrandVersion)
        ? command_line->GetSwitchValueASCII(switches::kFingerprintBrandVersion)
        : "";

    if (custom_brand == "Chrome") {
      display_brand = "Google Chrome";
      version = custom_version.empty()? metadata->full_version : custom_version;
      main_version = version.substr(0, version.find('.'));

      for (auto& brand_full_version : metadata->brand_full_version_list) {
        if (brand_full_version.brand == "Chromium") {
          brand_full_version.version = version;
          break;
        }
      }

      for (auto& brand : metadata->brand_version_list) {
        if (brand.brand == "Chromium") {
          brand.version = main_version;
          break;
        }
      }
    } else if (custom_brand == "Edge") {
      display_brand = "Microsoft Edge";
      version = custom_version.empty() ? "130.0.6723.91" : custom_version;
    } else if (custom_brand == "Opera") {
      display_brand = "Opera";
      version = custom_version.empty() ? "116.0.0.0" : custom_version;
    } else if (custom_brand == "Vivaldi") {
      display_brand = "Vivaldi";
      version = custom_version.empty() ? "7.0.3495.29" : custom_version;
    } else {
      display_brand = custom_brand;
      version = custom_version.empty() ? metadata->full_version : custom_version;
    }
    main_version = version.substr(0, version.find('.'));
  } else {
    display_brand = "Google Chrome";
    version = metadata->full_version;
    main_version = metadata->full_version.substr(0, metadata->full_version.find('.'));
  }

  // Add brand information to metadata
  metadata->brand_version_list.push_back({display_brand, main_version});
  metadata->brand_full_version_list.push_back({display_brand, version});
  metadata->full_version = version;

  // Handle platform information
  if (command_line->HasSwitch(switches::kFingerprintPlatform)) {
    std::string platform_value = command_line->GetSwitchValueASCII(switches::kFingerprintPlatform);

    if (platform_value == "windows") {
      metadata->platform = "Windows";
      metadata->platform_version = "19.0.0";
    } else if (platform_value == "linux") {
      metadata->platform = "Linux";
      metadata->platform_version = "6.8.0";
    } else if (platform_value == "macos") {
      metadata->platform = "macOS";
      metadata->platform_version = "15.2.0";
      metadata->architecture = "arm";
    }

    if (command_line->HasSwitch(switches::kFingerprintPlatformVersion)) {
      std::string version_value = command_line->GetSwitchValueASCII(
          switches::kFingerprintPlatformVersion);
      if (!version_value.empty()) {
        metadata->platform_version = version_value;
      }
    }
  }
}

std::string GetUserAgentFingerprintBrandInfo() {
  const base::CommandLine* command_line = base::CommandLine::ForCurrentProcess();

  if (!command_line->HasSwitch(switches::kFingerprintBrand)) {
    return "";
  }

  std::string brand = command_line->GetSwitchValueASCII(switches::kFingerprintBrand);
  std::string version = command_line->HasSwitch(switches::kFingerprintBrandVersion)
      ? command_line->GetSwitchValueASCII(switches::kFingerprintBrandVersion)
      : "";

  if (brand == "Chrome") {
    return "";
  } else if (brand == "Edge") {
    return " Edg/" + (version.empty() ? "130.0.6723.91" : version);
  } else if (brand == "Opera") {
    return " OPR/" + (version.empty() ? "116.0.0.0" : version);
  } else if (brand == "Vivaldi") {
    return " Vivaldi/" + (version.empty() ? "7.0.3495.29" : version);
  } else if (!brand.empty()) {
    return " " + brand + "/" + (version.empty() ? brand : version);
  }

  return "";
}

 }  // namespace blink