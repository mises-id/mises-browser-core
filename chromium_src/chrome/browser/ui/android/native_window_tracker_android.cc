#include "chrome/browser/ui/android/native_window_tracker_android.h"
#include "ui/android/window_android.h"

NativeWindowTrackerAndroid::NativeWindowTrackerAndroid(
    gfx::NativeWindow window)
    : window_(window) {
}

NativeWindowTrackerAndroid::~NativeWindowTrackerAndroid() {
}

bool NativeWindowTrackerAndroid::WasNativeWindowClosed() const {
  return window_ == nullptr;
}


// static
std::unique_ptr<NativeWindowTracker> NativeWindowTracker::Create(
    gfx::NativeWindow window) {
  return std::unique_ptr<NativeWindowTracker>(
      new NativeWindowTrackerAndroid(window));
}
