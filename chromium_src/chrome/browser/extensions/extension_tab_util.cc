#include "chrome/browser/extensions/extension_tab_util.h"

#if BUILDFLAG(IS_ANDROID)
#include "chrome/browser/android/tab_android.h"
#include "chrome/browser/ui/android/tab_model/tab_model.h"
#include "chrome/browser/ui/android/tab_model/tab_model_list.h"
#endif

#include "src/chrome/browser/extensions/extension_tab_util.cc"

namespace extensions {


#if BUILDFLAG(IS_ANDROID) 
void CreateTabObjectAndroid(   
    api::tabs::Tab* tab_object,
    WebContents* contents,
    const Extension* extension,
    int tab_index) {
  TabModel *tab_model = nullptr;
  if (!TabModelList::models().empty())
    tab_model = *(TabModelList::models().begin());
  if (tab_model) {
    int openingTab = (tab_model->GetLastNonExtensionActiveIndex());
    if (extension && extension->id() == "mooikfkahbdckldjjndioackbalphokd")
      openingTab = (tab_model->GetActiveIndex());
    if (openingTab == -1)
      openingTab = 0;
    if (tab_index == openingTab) {
      tab_object->active = true;
    }
    for (int i = 0; i < tab_model->GetTabCount(); ++i) {
      openingTab = (tab_model->GetLastNonExtensionActiveIndex());
      if (openingTab == -1)
        openingTab = 0;
      if (i == openingTab && tab_model->GetWebContentsAt(i) == contents) {
        tab_object->active = true;
      }

    }
    TabAndroid* tab_android = tab_model->GetTabAt(tab_index);
    if(tab_android) {
      tab_object->window_id = tab_android->window_id().id();
      if (tab_android->ExtensionWindowID() != -1) {
        tab_object->window_id = tab_android->ExtensionWindowID();
      }
    }
  }
}


void CreateTabListAndroid(
    const Browser* browser,
    const Extension* extension,
    Feature::Context context,
    base::Value::List& tab_list) {
  TabModel *tab_strip = nullptr;
  if (!TabModelList::models().empty())
    tab_strip = *(TabModelList::models().begin());
  if (tab_strip) {
    int window_id = ExtensionTabUtil::GetWindowId(browser);
    bool is_normal = ExtensionTabUtil::GetBrowserWindowTypeText(*browser) == tabs_constants::kWindowTypeValueNormal;
    for (int i = 0; i < tab_strip->GetTabCount(); ++i) {
      TabAndroid *tab_android = tab_strip->GetTabAt(i);
      WebContents* web_contents = tab_strip->GetWebContentsAt(i);
      if (!tab_android || !web_contents) {
        continue;
      }
      if (tab_android->ExtensionWindowID() == window_id ||
          (is_normal && (tab_android->ExtensionWindowID() == -1))) {
            ExtensionTabUtil::ScrubTabBehavior scrub_tab_behavior =
              ExtensionTabUtil::GetScrubTabBehavior(extension, context, web_contents);
                tab_list.Append(ExtensionTabUtil::CreateTabObject(web_contents, scrub_tab_behavior, extension, nullptr, i).ToValue());
      }
    }
  }
}

bool GetTabByIdAndroid(int tab_id, WebContents** contents, int* tab_index) {
  if (!TabModelList::models().empty()) {
    TabModel * my_tab_strip = *(TabModelList::models().begin());
    //LOG(INFO) << "ExtensionTabUtil::GetTabById" << "check profile " << profile << " target_model " << my_tab_strip << " target_profile " << my_tab_strip->GetProfile();
    for (int i = 0; i < my_tab_strip->GetTabCount(); ++i) {
      WebContents* target_contents = my_tab_strip->GetWebContentsAt(i);
      //LOG(INFO) << "ExtensionTabUtil::GetTabById" << "check model tab " << sessions::SessionTabHelper::IdForTab(target_contents).id();
      if (sessions::SessionTabHelper::IdForTab(target_contents).id() == tab_id) {
        if (contents)
          *contents = target_contents;
        if (tab_index)   
          *tab_index = i;
        return true;
      }
    }
  }
  return false;
}
base::Value::Dict CreateDummyWindowValueForExtension(
		                    ExtensionTabUtil::PopulateTabBehavior populate_tab_behavior) {
  base::Value::Dict dict;
  dict.Set(tabs_constants::kIdKey, -1);
  dict.Set(tabs_constants::kWindowTypeKey, "");
  dict.Set(tabs_constants::kFocusedKey, false);
  dict.Set(tabs_constants::kIncognitoKey, false);
  dict.Set(tabs_constants::kAlwaysOnTopKey, false);

  dict.Set(tabs_constants::kShowStateKey, tabs_constants::kShowStateValueNormal);
  dict.Set(tabs_constants::kLeftKey, 0);
  dict.Set(tabs_constants::kTopKey, 0);
  dict.Set(tabs_constants::kWidthKey, 1920);
  dict.Set(tabs_constants::kHeightKey, 1080);

  if (populate_tab_behavior == ExtensionTabUtil::kPopulateTabs) {
    dict.Set(tabs_constants::kTabsKey,base::Value::List());
  }
  return dict;
}

Browser* FindBrowserForWindowAndroid(Profile* profile, int window_id) {
  for (const TabModel* tab_model : TabModelList::models()) {
    if (tab_model->GetProfile() != profile)
      continue;
    if (tab_model->GetSessionId().id() == window_id) {
      return chrome::FindBrowserWithProfile(profile);
    }
    
  }

  return nullptr;
}

void OpenSingleExtensionTab(   
    const Extension* extension,
    const GURL &url,
    const SessionID::id_type session_window_id) {
  if (!TabModelList::models().empty()){
      TabModel* tab_model = TabModelList::models()[0];
      if (tab_model) {
        bool found = false;
        for (int i = 0; i < tab_model->GetTabCount(); ++i) {
          TabAndroid *tab_android = tab_model->GetTabAt(i);
          if (tab_android) {
            GURL tab_url = tab_android->GetURL();
            if (tab_url == url) {
              tab_model->SetActiveIndex(i);
              found = true;
            }

          }
          
        }
        if (!found) {
          tab_model->CreateNewTabForExtension(extension->id(), url, session_window_id);
        }
        
      }
        
  }
}
#endif
}  // namespace extensions
