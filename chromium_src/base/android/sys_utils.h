#ifndef MISES_BASE_ANDROID_SYS_UTILS_H_
#define MISES_BASE_ANDROID_SYS_UTILS_H_


#include "base/functional/callback.h"
#include "base/functional/callback_helpers.h"

#include "src/base/android/sys_utils.h"

namespace base {
namespace android {

class BASE_EXPORT MisesSysUtils{
 public:
  static long FirstInstallDateFromJni();
  static std::string ReferrerStringFromJni();
  static std::string NightModeSettingsFromJni();

  using ShowRewardAdCallback =
    base::OnceCallback<void(int code, const std::string& error_message)>;
  static void ShowRewardAdFromJni(ShowRewardAdCallback callback);
  static void CancelRewardAdFromJni();
  static void OpenVpnFromJni();
  static void LogEventFromJni(const std::string& name, const std::string& key, const std::string& value);
  static void LogEventFromJni(const std::string& name, const std::string& key, const std::string& value, const std::string& key1, const std::string& value1);
};

}  // namespace android
}  // namespace base

#endif  // MISES_BASE_ANDROID_SYS_UTILS_H_
