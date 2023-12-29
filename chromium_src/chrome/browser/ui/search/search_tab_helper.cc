#include "chrome/browser/ui/search/search_tab_helper.h"
#include "components/sessions/content/session_tab_helper.h"
#define NavigationEntryCommitted NavigationEntryCommitted_Chromium
#include "src/chrome/browser/ui/search/search_tab_helper.cc"
#undef NavigationEntryCommitted

#if BUILDFLAG(IS_ANDROID)
#include "base/android/sys_utils.h"
#include "base/strings/string_util.h"
#include "base/strings/utf_string_conversions.h"
#endif


void SearchTabHelper::NavigationEntryCommitted(
    const content::LoadCommittedDetails& load_details) {
  LOG(INFO) << "[Mises] SearchTabHelper::NavigationEntryCommitted";
  SearchTabHelper::NavigationEntryCommitted_Chromium(load_details);

  // if (search::IsInstantNTP(web_contents()) && instant_service_) {
  //     instant_service_->OnNewTabPageOpened();
  // }
}

