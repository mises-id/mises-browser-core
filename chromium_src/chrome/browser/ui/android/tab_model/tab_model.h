#ifndef MISES_BROWSER_UI_ANDROID_TAB_MODEL_TAB_MODEL_H_
#define MISES_BROWSER_UI_ANDROID_TAB_MODEL_TAB_MODEL_H_

#include <memory>

#include "base/android/scoped_java_ref.h"
#include "base/memory/raw_ptr.h"
#include "chrome/browser/flags/android/chrome_session_state.h"
#include "chrome/browser/ui/android/tab_model/android_live_tab_context.h"
#include "components/omnibox/browser/location_bar_model.h"
#include "components/omnibox/browser/location_bar_model_delegate.h"
#include "components/sessions/core/session_id.h"
#include "components/sync_sessions/synced_window_delegate.h"


#define GetActiveIndex\
  GetLastNonExtensionActiveIndex() const = 0;\
  virtual content::WebContents* CreateNewTabForExtension(const std::string& extension_id, \
                                                 const GURL& url, \
                                                 const SessionID::id_type session_window_id)  = 0;\
  virtual int GetActiveIndex
#include "src/chrome/browser/ui/android/tab_model/tab_model.h"
#undef GetActiveIndex


#endif  // CHROME_BROWSER_UI_ANDROID_TAB_MODEL_TAB_MODEL_H_
