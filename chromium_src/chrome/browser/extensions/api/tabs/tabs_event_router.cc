#include "url/url_constants.h"
#include "src/chrome/browser/extensions/api/tabs/tabs_event_router.cc"

namespace extensions {



void TabsEventRouter::TabEntry::DidStopLoading (){
#if BUILDFLAG(IS_ANDROID)
  WebContents* contents = web_contents();
  // notify tab changed when the WebContents is not destroying, 
  // and is still attaching to the tab
  if (contents && contents->GetDelegate()) {
    const GURL &gurl = contents->GetURL();
    if (gurl.SchemeIs(url::kHttpScheme) || gurl.SchemeIs(url::kHttpsScheme)) {

      LOG(INFO) << "TabsEventRouter:::TabEntry::DidStopLoading " << contents;
      router_->TabChangedAt(contents, -1, TabChangeType::kLoadingOnly);
    }
  }
    
#endif
}

#if BUILDFLAG(IS_ANDROID)

void TabsEventRouter::MaybeRegisterForTabNotifications(TabAndroid* tab) {
  if (tab && tab->web_contents()) {
    int tab_id = ExtensionTabUtil::GetTabId(tab->web_contents());
    if (tab_entries_.find(tab_id) == tab_entries_.end()) {
      RegisterForTabNotifications(tab->web_contents());
    }
  }
}
// void TabsEventRouter::OnInitWebContents(TabAndroid* tab)  {
//   MaybeRegisterForTabNotifications(tab);
// }
void TabsEventRouter::OnTabModelAdded() {
  LOG(INFO) << "TabsEventRouter::OnTabModelAdded ";
  if (!observed_tab_model_) {
    TabModel* model =  *(TabModelList::models().begin());
    observed_tab_model_ = model;
    observed_tab_model_->AddObserver(this);
  }

  if (observed_tab_model_) {
      int tab_count = observed_tab_model_->GetTabCount();
      for (int i =  0; i < tab_count; ++i) {
        TabAndroid* tab = observed_tab_model_->GetTabAt(i);
        if (tab) {
          //tab->AddObserver(this);
          MaybeRegisterForTabNotifications(tab);
        }
      }

    }

}

void TabsEventRouter::DidSelectTab(TabAndroid* tab,
                                 TabModel::TabSelectionType type) {
  LOG(INFO) << "TabsEventRouter::DidSelectTab " << tab->web_contents();
  if (!tab->web_contents())
    return;
  MaybeRegisterForTabNotifications(tab);
  if (tab->ExtensionWindowID() == -1) {
    DispatchActiveTabChanged(nullptr, tab->web_contents());
  }
  
}
void TabsEventRouter::WillCloseTab(TabAndroid* tab, bool animate) {
  LOG(INFO) << "TabsEventRouter::WillCloseTab " << tab->web_contents();
  //tab->RemoveObserver(this);
  if (!tab->web_contents())
    return;
  DispatchTabClosingAt(nullptr, tab->web_contents(), tab->window_id().id());
}
void TabsEventRouter::DidAddTab(TabAndroid* tab, TabModel::TabLaunchType type) {
  LOG(INFO) << "TabsEventRouter::DidAddTab " << tab->web_contents();
  //tab->AddObserver(this);
  if (!tab->web_contents())
    return;
  DispatchTabInsertedAt(nullptr, tab->web_contents(), tab->window_id().id(), !tab->IsHidden());
}
void TabsEventRouter::OnTabModelRemoved() {
   LOG(INFO) << "TabsEventRouter::OnTabModelRemoved";
   if (!observed_tab_model_)
      return;

    for (const TabModel* remaining_model : TabModelList::models()) {
      if (observed_tab_model_ == remaining_model)
        return;
    }
    observed_tab_model_->RemoveObserver(this);
    observed_tab_model_ = nullptr;
}
#endif

}  // namespace extensions
