
#include <algorithm>
#include <cctype>
#include <string>
 
#include "base/command_line.h"
#include "base/strings/string_util.h"
#include "components/ungoogled/ungoogled_switches.h"

namespace content {
  std::string GetFingerprintUserAgentPlatform() {
    const base::CommandLine* command_line = base::CommandLine::ForCurrentProcess();
    if (command_line->HasSwitch(switches::kFingerprintPlatform)) {
      std::string platform_value = base::ToLowerASCII(command_line->GetSwitchValueASCII(switches::kFingerprintPlatform));

      // 判断自定义平台
      if (platform_value == "windows") {
        return "";
      } else if (platform_value == "linux") {
        return "X11; ";
      } else if (platform_value == "macos") {
        return "Macintosh; ";
      }
    }
    return "";
  }

  std::string GetFingerprintUnifiedPlatform() {
    const base::CommandLine* command_line = base::CommandLine::ForCurrentProcess();
    if (command_line->HasSwitch(switches::kFingerprintPlatform)) {
      std::string platform_value = base::ToLowerASCII(command_line->GetSwitchValueASCII(switches::kFingerprintPlatform));

      if (platform_value == "windows") {
        return "Windows NT 10.0; Win64; x64";
      } else if (platform_value == "linux") {
        return "X11; Linux x86_64";
      } else if (platform_value == "macos") {
        return "Macintosh; Intel Mac OS X 10_15_7";
      }
    }
    return "";

  }

}


#include "src/content/common/user_agent.cc"
