#include "chrome/browser/devtools/devtools_window.h"


#if BUILDFLAG(IS_ANDROID)
#include "chrome/browser/ui/android/tab_model/tab_model.h"
#include "chrome/browser/ui/android/tab_model/tab_model_list.h"
#include "content/public/browser/web_contents.h"
#include "chrome/browser/android/tab_android.h"

namespace {
  void CreateTabAndroid(content::WebContents* web_contents) {
      if (TabModelList::models().size() > 0) {
        TabModel* tab_model = *(TabModelList::models().begin());
        TabAndroid* tab = tab_model->GetTabAt(tab_model->GetActiveIndex());
        if (tab && web_contents) {
          tab_model->CreateTab(tab, web_contents, /*select=*/true);
        }
      }
  }
}
#endif

#include "src/chrome/browser/devtools/devtools_window.cc"
