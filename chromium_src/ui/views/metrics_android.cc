#include "ui/views/metrics.h"

namespace views {

int GetDoubleClickInterval() {
  // TODO(jennyz): This value may need to be adjusted on different platforms.
  const int kDefaultDoubleClickIntervalMs = 500;
  return kDefaultDoubleClickIntervalMs;
}

int GetMenuShowDelay() {
  return 0;
}

}  // namespace views

