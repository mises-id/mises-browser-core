#ifndef CHROME_BROWSER_ANDROID_MISES_MISES_CONTROLLER_H_
#define CHROME_BROWSER_ANDROID_MISES_MISES_CONTROLLER_H_

#include <string>

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
 private:
  friend struct base::DefaultSingletonTraits<MisesController>;

  MisesController();
  ~MisesController();
  MisesController(const MisesController&) = delete;
  MisesController& operator=(const MisesController&) = delete;
};

}  // namespace android

#endif
