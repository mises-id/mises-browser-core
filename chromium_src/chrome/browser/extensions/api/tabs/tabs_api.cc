#include "chrome/browser/extensions/api/tabs/tabs_api.h"
#include "base/values.h"
#include "base/logging.h"
#include "chrome/common/extensions/api/tabs.h"
#if BUILDFLAG(IS_ANDROID)
#include "chrome/browser/ui/android/tab_model/tab_model.h"
#include "chrome/browser/ui/android/tab_model/tab_model_list.h"
#include "content/public/browser/web_contents.h"
#include "chrome/browser/android/tab_android.h"
#endif
#include "components/safe_browsing/buildflags.h"
namespace extensions {
  bool HighlightTabAndroid(const api::tabs::Highlight::Params::HighlightInfo &highlight_info);
  void GetTabListValueAndroid(base::Value::List& result, const Extension* extension, extensions::mojom::ContextType context);
  int GetSelectedTabIndexAndroid(content::WebContents** contents);
  int GetSelectedTabIdAndroid();
  void CloseAllExtensionTabsAndroid(const Extension* extension);
}
#include "src/chrome/browser/extensions/api/tabs/tabs_api.cc"


namespace extensions {

namespace windows = api::windows;
namespace tabs = api::tabs;

#if BUILDFLAG(IS_ANDROID)
bool HighlightTabAndroid(const tabs::Highlight::Params::HighlightInfo &highlight_info) {

  TabModel *tab_strip_android = nullptr;
  if (!TabModelList::models().empty())
    tab_strip_android = *(TabModelList::models().begin());
  if (!tab_strip_android)
    return false;

  if (highlight_info.tabs.as_integers) {
    const std::vector<int>& tab_indices = *highlight_info.tabs.as_integers;
    // Create a new selection model as we read the list of tab indices.
    for (size_t i = 0; i < tab_indices.size(); ++i) {
      int tab_index = tab_indices[i];
      if (tab_strip_android->GetActiveIndex() != tab_index) {
        tab_strip_android->SetActiveIndex(tab_index);
      }
    }
  } else if (highlight_info.tabs.as_integer) {
    int tab_index = *highlight_info.tabs.as_integer;
    if (tab_strip_android->GetActiveIndex() != tab_index) {
      tab_strip_android->SetActiveIndex(tab_index);
    }
  }
  return true;
}

void GetTabListValueAndroid(base::Value::List& result, const Extension* extension, extensions::mojom::ContextType context) {
  TabModel *tab_strip = nullptr;
  if (!TabModelList::models().empty())
    tab_strip = *(TabModelList::models().begin());
  if (tab_strip) {
    for (int i = 0; i < tab_strip->GetTabCount(); ++i) {
      WebContents* web_contents = tab_strip->GetWebContentsAt(i);
      if (!web_contents) {
        continue;
      }
      result.Append(CreateTabObjectHelper(
                         web_contents, extension, context,
                         nullptr, i).ToValue());
    }
  }
}

int GetSelectedTabIndexAndroid(WebContents** contents) {
  int tab_index = -1;
  TabModel *tab_strip = nullptr;
  if (!TabModelList::models().empty())
    tab_strip = *(TabModelList::models().begin());
  if (tab_strip) {
    for (int i = 0; i < tab_strip->GetTabCount(); ++i) {
      WebContents* web_contents = tab_strip->GetWebContentsAt(i);

      int openingTab = (tab_strip->GetLastNonExtensionActiveIndex());
      if (openingTab == -1)
        openingTab = 0;

      if (i != openingTab)
        continue;
      
      if (web_contents) {
        *contents = web_contents;
        tab_index = i;
        break;
      }
    }
  }

  return tab_index;
}

int GetSelectedTabIdAndroid() {
  int tab_id = -1;
  TabModel *tab_strip = nullptr;
  if (!TabModelList::models().empty())
    tab_strip = *(TabModelList::models().begin());
  if (tab_strip) {
    for (int i = 0; i < tab_strip->GetTabCount(); ++i) {
      WebContents* web_contents = tab_strip->GetWebContentsAt(i);

      int openingTab = (tab_strip->GetLastNonExtensionActiveIndex());
      if (openingTab == -1)
        openingTab = 0;

      if (i != openingTab)
        continue;
      
      if (web_contents && ExtensionTabUtil::GetTabId(web_contents) >= 0) {
        tab_id = ExtensionTabUtil::GetTabId(web_contents);
        break;
      }
    }
  }

  return tab_id;
}
void CloseAllExtensionTabsAndroid(const Extension* extension) {
  LOG(INFO) << "extensions::CloseAllExtensionTabsAndroid";
   // simply close all extension tabs
  TabModel *tab_strip = nullptr;
  if (!TabModelList::models().empty())
    tab_strip = *(TabModelList::models().begin());
  if (tab_strip) {
    int tab_count = tab_strip->GetTabCount();
    //this method is a bit strange, by using extra tab_index to track the tabs when CloseTabAt in loop
    int tab_index = 0;
    for (int i = 0; i < tab_count; ++i) {
        
      WebContents* web_contents = tab_strip->GetWebContentsAt(tab_index);
      if (!web_contents) {
        tab_index++;
        continue;
      }
      TabAndroid *tab_android = tab_strip->GetTabAt(tab_index);
      if (!tab_android) {
        tab_index++;
        continue;
      }
      if (!tab_android->GetURL().SchemeIs(extensions::kExtensionScheme)) {
        tab_index++;
        continue;
      }
      if (tab_android->ExtensionWindowID() == -1) {
        tab_index++;
        continue;
      }
      if (!extension || extension->id() != tab_android->ExtensionID()) {
        tab_index++;
        continue;
      }

      tab_strip->CloseTabAt(tab_index);
    }
    tab_strip->CloseTabForExtension(extension->id());
  }
}
#endif

}  // namespace extensions
