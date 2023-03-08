#ifndef MISES_BROWSER_UI_ANDROID_TAB_MODEL_TAB_MODEL_JNI_BRIDGE_H_
#define MISES_BROWSER_UI_ANDROID_TAB_MODEL_TAB_MODEL_JNI_BRIDGE_H_

#include <jni.h>
#include <vector>

#include "base/android/jni_weak_ref.h"
#include "base/android/scoped_java_ref.h"
#include "chrome/browser/flags/android/chrome_session_state.h"
#include "chrome/browser/ui/android/tab_model/tab_model.h"

#define GetActiveIndex\
  GetLastNonExtensionActiveIndex() const override;\
  content::WebContents* CreateNewTabForExtension(const std::string& extension_id, \
                                                 const GURL& url, \
                                                 const SessionID::id_type session_window_id) override;\
  SessionID::id_type extension_window_id_ = -1;\
  std::string extension_id_;\
  int GetActiveIndex
#include "src/chrome/browser/ui/android/tab_model/tab_model_jni_bridge.h"
#undef GetActiveIndex


#endif  // CHROME_BROWSER_UI_ANDROID_TAB_MODEL_TAB_MODEL_JNI_BRIDGE_H_
