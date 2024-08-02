#ifndef CHROME_BROWSER_ANDROID_MISES_MISES_CONTROLLER_H_
#define CHROME_BROWSER_ANDROID_MISES_MISES_CONTROLLER_H_

#include <string>
#include <map>
#include <vector>
#include "base/functional/callback.h"
#include "base/functional/callback_helpers.h"

namespace base {
template <typename T>
struct DefaultSingletonTraits;
}

namespace chrome {
namespace android {


enum MisesControllerDialogType {
  kPhishingDetected,
  kTOS,
};

class MisesController {
 public:
  // Returns a singleton instance of MisesController.
  static MisesController* GetInstance();

  void setMisesUserInfo(const std::string& info);
  std::string getMisesUserInfo();

  using NotifyDialogCallback = base::OnceCallback<void(int)>;
  using NotifyDialogCallbackVector = std::vector<NotifyDialogCallback>;
  void showNotifyDialog(MisesControllerDialogType type, const std::string& param, NotifyDialogCallback callback);
  void callbackNotifyDialog(const std::string& param, int action);
  void recordEvent(const std::string& params);
 private:
  friend struct base::DefaultSingletonTraits<MisesController>;

  std::map<std::string, NotifyDialogCallbackVector> callback_map_;

  MisesController();
  ~MisesController();
  MisesController(const MisesController&) = delete;
  MisesController& operator=(const MisesController&) = delete;
};

}  // namespace android
}
#endif
