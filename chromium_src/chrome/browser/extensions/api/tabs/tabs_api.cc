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
namespace extensions {
  bool HighlightTabAndroid(const api::tabs::Highlight::Params::HighlightInfo &highlight_info);
  content::WebContents* GetActiveWebContentsAndroid();
  void GetTabListValueAndroid(base::Value::List& result, const Extension* extension, Feature::Context context);
  int GetSelectedTabIndexAndroid(content::WebContents** contents);
  int GetSelectedTabIdAndroid();
  void CloseAllExtensionTabsAndroid();
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
WebContents* GetActiveWebContentsAndroid() {
  WebContents* contents = NULL;
  TabModel *tab_strip = nullptr;
  if (!TabModelList::models().empty())
    tab_strip = *(TabModelList::models().begin());
  if (tab_strip) {
    for (int i = 0; i < tab_strip->GetTabCount(); ++i) {
        int openingTab = (tab_strip->GetLastNonExtensionActiveIndex());
        if (openingTab == -1)
          openingTab = 0;

        if (i != openingTab)
          continue;

        contents = tab_strip->GetWebContentsAt(i);
    }
  }
  return contents;
}
void GetTabListValueAndroid(base::Value::List& result, const Extension* extension, Feature::Context context) {
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
void CloseAllExtensionTabsAndroid() {
  LOG(INFO) << "extensions::CloseAllExtensionTabsAndroid";
   // simply close all extension tabs
  TabModel *tab_strip = nullptr;
  if (!TabModelList::models().empty())
    tab_strip = *(TabModelList::models().begin());
  if (tab_strip) {
    for (int i = 0; i < tab_strip->GetTabCount(); ++i) {
      WebContents* web_contents = tab_strip->GetWebContentsAt(i);

      int openingTab = (tab_strip->GetLastNonExtensionActiveIndex());
      if (openingTab == -1)
        openingTab = 0;

      if (i == openingTab)
        continue;

      if (!web_contents) {
        continue;
      }
      TabAndroid *tab_android = tab_strip->GetTabAt(i);
      if (!tab_android) {
        continue;
      }
      if (!tab_android->GetURL().SchemeIs(extensions::kExtensionScheme)) {
        continue;
      }
      tab_strip->CloseTabAt(i);
    }
  }
}
#endif

}  // namespace extensions
