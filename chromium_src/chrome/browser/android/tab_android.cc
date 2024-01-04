#include "src/chrome/browser/android/tab_android.cc"


#if BUILDFLAG(IS_ANDROID)
namespace {
  TabModel * get_tab_strip_android() {
      TabModel *tab_strip = nullptr;
      if (!TabModelList::models().empty()) {
        tab_strip = *(TabModelList::models().begin());
      }
      return tab_strip;
  }
}
content::WebContents* GetActiveWebContentsAndroid() {
  content::WebContents* contents = NULL;
  TabModel *tab_strip = get_tab_strip_android();
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
content::WebContents* GetWebContentsAtAndroid(int tab_idx) {
  content::WebContents* contents = NULL;
  TabModel *tab_strip = get_tab_strip_android();
  if (tab_strip) {
    contents = tab_strip->GetWebContentsAt(tab_idx);
  }
  return contents;
}

int GetActiveTabIndexAndroid() {
  TabModel *tab_strip = get_tab_strip_android();
  if (tab_strip) {
    return tab_strip->GetLastNonExtensionActiveIndex();
  }
  return 0;
}
int GetTabsCountAndroid() {
  TabModel *tab_strip = get_tab_strip_android();
  if (tab_strip) {
    return tab_strip->GetTabCount();
  }
  return 0;
}
#endif
