#ifndef MISES_BROWSER_UI_ANDROID_NATIVE_WINDOW_TRACKER_ANDROID_H_
#define MISES_BROWSER_UI_ANDROID_NATIVE_WINDOW_TRACKER_ANDROID_H_

#include "base/memory/raw_ptr.h"
#include "chrome/browser/ui/native_window_tracker.h"
#include "ui/android/window_android.h"

class NativeWindowTrackerAndroid : public NativeWindowTracker {
 public:
  explicit NativeWindowTrackerAndroid(gfx::NativeWindow window);
  NativeWindowTrackerAndroid(const NativeWindowTrackerAndroid&) = delete;
  NativeWindowTrackerAndroid& operator=(const NativeWindowTrackerAndroid&) = delete;
  ~NativeWindowTrackerAndroid() override;

  bool WasNativeWindowClosed() const override;

 private:

  gfx::NativeWindow window_;

};

#endif
