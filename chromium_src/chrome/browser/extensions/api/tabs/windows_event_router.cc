#include "chrome/browser/extensions/api/tabs/windows_event_router.h"


#if BUILDFLAG(IS_ANDROID)
#include "chrome/browser/ui/browser.h"
#include "chrome/browser/ui/browser_list.h"
#include "chrome/browser/ui/browser_window.h"
#include "chrome/browser/extensions/browser_extension_window_controller.h"
#include "chrome/browser/ui/android/tab_model/tab_model.h"
#include "chrome/browser/ui/android/tab_model/tab_model_list.h"
#endif

#include "src/chrome/browser/extensions/api/tabs/windows_event_router.cc"



using content::BrowserContext;

namespace extensions {

namespace windows = extensions::api::windows;


#if BUILDFLAG(IS_ANDROID)
void WindowsEventRouter::OnTabModelAdded() {
  LOG(INFO) << "WindowsEventRouter::OnTabModelAdded ";
  // add a dummuy browser for extension api
  if (BrowserList::GetInstance()->size() == 0) {
    Browser::Create(Browser::CreateParams(profile_, false));
  }
  if (!observed_tab_model_) {
    TabModel* model = *(TabModelList::models().begin());
    observed_tab_model_ = model;
    observed_tab_model_->AddObserver(this);
  }

}

void WindowsEventRouter::DidAddTab(TabAndroid* tab,
                                 TabModel::TabLaunchType type) {
  LOG(INFO) << "WindowsEventRouter::DidAddTab";
}

void WindowsEventRouter::OnTabModelRemoved() {
   LOG(INFO) << "WindowsEventRouter::OnTabModelRemoved";
   if (!observed_tab_model_)
      return;

    for (const TabModel* remaining_model : TabModelList::models()) {
      if (observed_tab_model_ == remaining_model)
        return;
    }
    observed_tab_model_->RemoveObserver(this);
    observed_tab_model_ = nullptr;
}
void WindowsEventRouter::WillCloseTab(TabAndroid* tab, bool animate) {
  LOG(INFO) << "WindowsEventRouter::WillCloseTab step - 1";
  SessionID::id_type window_id = tab->ExtensionWindowID();
  if (window_id == -1) {
    LOG(INFO) << "WindowsEventRouter::WillCloseTab step - 1a";
    return;
  }
  Browser* browser_to_remove = nullptr;
  for (auto* browser : *BrowserList::GetInstance()) {
    if (browser->session_id().id() == window_id){
      browser_to_remove = browser;
      break;
    }
  }
  LOG(INFO) << "WindowsEventRouter::WillCloseTab step - 2";
  if(browser_to_remove) {
    WindowController* controller = browser_to_remove->extension_window_controller();
    LOG(INFO) << "WindowsEventRouter::WillCloseTab step - 3";
    if (controller) {
        LOG(INFO) << "WindowsEventRouter::WillCloseTab step - 4";
        controller->window()->Close();
    }
  }
}
#endif
}  // namespace extensions
