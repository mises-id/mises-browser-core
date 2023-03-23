#include "build/build_config.h"

#if BUILDFLAG(IS_ANDROID)
#include "base/callback_list.h"
#include "base/functional/callback.h"
#include "src/chrome/browser/lifetime/application_lifetime_android.h"

namespace chrome {
  void OnAppExiting();
  void CloseAllBrowsers();
  void OnClosingAllBrowsers(bool);
  base::CallbackListSubscription AddClosingAllBrowsersCallback(
    base::RepeatingCallback<void(bool)> closing_all_browsers_callback);
}

#else

#include "src/chrome/browser/lifetime/application_lifetime_desktop.h"


#endif

