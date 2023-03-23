#include "base/logging.h"
#include "base/notreached.h"
#include "chrome/browser/shell_integration.h"

namespace shell_integration {

// TODO: crbug/115375 to track implementation for following methods.
bool SetAsDefaultBrowser() {
  LOG(ERROR) << "shell_integration_android::SetAsDefaultBrowser";
  return false;
}

bool SetAsDefaultProtocolClient(const std::string& protocol) {
  LOG(ERROR) << "shell_integration_android::SetAsDefaultProtocolClient" << protocol;
  return false;
}

DefaultWebClientSetPermission GetDefaultWebClientSetPermission() {
  LOG(ERROR) << "shell_integration_android::GetDefaultWebClientSetPermission";
  return SET_DEFAULT_NOT_ALLOWED;
}

std::u16string GetApplicationNameForProtocol(const GURL& url) {
  LOG(ERROR) << "shell_integration_android::GetApplicationNameForProtocol";
  return std::u16string();
}

DefaultWebClientState GetDefaultBrowser() {
  LOG(ERROR) << "shell_integration_android::GetDefaultBrowser";
  return UNKNOWN_DEFAULT;
}

bool IsFirefoxDefaultBrowser() {
	LOG(ERROR) << "shell_integration_android::IsFirefoxDefaultBrowser";
  return false;
}

DefaultWebClientState IsDefaultProtocolClient(const std::string& protocol) {
  LOG(ERROR) << "shell_integration_android::IsDefaultProtocolClient";
  return UNKNOWN_DEFAULT;
}

std::u16string GetApplicationNameForScheme(const GURL& url) {
  return std::u16string();
}
DefaultWebClientState IsDefaultClientForScheme(const std::string& scheme) {
  return UNKNOWN_DEFAULT;
}

bool SetAsDefaultClientForScheme(const std::string& scheme) {
  return false;
}

namespace internal {

DefaultWebClientSetPermission GetPlatformSpecificDefaultWebClientSetPermission(
    WebClientSetMethod method) {
  return SET_DEFAULT_UNATTENDED;
}

} 

}  // namespace shell_integration
