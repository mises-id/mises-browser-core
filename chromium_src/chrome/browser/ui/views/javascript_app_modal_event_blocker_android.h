#ifndef CHROME_BROWSER_UI_VIEWS_JAVASCRIPT_APP_MODAL_EVENT_BLOCKER_ANDROID_H_
#define CHROME_BROWSER_UI_VIEWS_JAVASCRIPT_APP_MODAL_EVENT_BLOCKER_ANDROID_H_

#include "ui/gfx/native_widget_types.h"

// TODO(weili): Implement the proper app modal behaviors.
class JavascriptAppModalEventBlockerAndroid {
 public:
  explicit JavascriptAppModalEventBlockerAndroid(
      gfx::NativeWindow app_modal_window) {}
  JavascriptAppModalEventBlockerAndroid(const JavascriptAppModalEventBlockerAndroid&) =
      delete;
  JavascriptAppModalEventBlockerAndroid& operator=(
      const JavascriptAppModalEventBlockerAndroid&) = delete;
  ~JavascriptAppModalEventBlockerAndroid() = default;
};

#endif  // CHROME_BROWSER_UI_VIEWS_JAVASCRIPT_APP_MODAL_EVENT_BLOCKER_MAC_H_
