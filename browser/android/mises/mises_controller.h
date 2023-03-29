#ifndef CHROME_BROWSER_ANDROID_MISES_MISES_CONTROLLER_H_
#define CHROME_BROWSER_ANDROID_MISES_MISES_CONTROLLER_H_

#include <string>
#include <map>
#include <vector>
#include "base/callback.h"
#include "base/callback_helpers.h"

namespace base {
template <typename T>
struct DefaultSingletonTraits;
}

namespace android {

class MisesController {
 public:
  // Returns a singleton instance of MisesController.
  static MisesController* GetInstance();

  void setMisesUserInfo(const std::string& info);
  std::string getMisesUserInfo();

  using NotifyPhishingDetectedCallback = base::OnceCallback<void(int)>;
  using NotifyPhishingDetectedCallbackVector =
    std::vector<NotifyPhishingDetectedCallback>;
  void notifyPhishingDetected(const std::string& address, NotifyPhishingDetectedCallback callback);
  void callbackPhishingDetected(const std::string& address, int action);
  void recordEvent(const std::string& params);
 private:
  friend struct base::DefaultSingletonTraits<MisesController>;

  std::map<std::string, NotifyPhishingDetectedCallbackVector> callback_map_;

  MisesController();
  ~MisesController();
  MisesController(const MisesController&) = delete;
  MisesController& operator=(const MisesController&) = delete;
};

}  // namespace android

#endif
