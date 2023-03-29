#include "chrome/browser/ui/search/search_tab_helper.h"
#include "components/sessions/content/session_tab_helper.h"
#define NavigationEntryCommitted NavigationEntryCommitted_Chromium
#include "src/chrome/browser/ui/search/search_tab_helper.cc"
#undef NavigationEntryCommitted

void SearchTabHelper::OnOpenExtension(const GURL& url) {
  DCHECK(!url.is_empty());
  if (instant_service_)
    instant_service_->OpenExtension(&GetWebContents(), url);
}

void SearchTabHelper::NavigationEntryCommitted(
    const content::LoadCommittedDetails& load_details) {
  LOG(INFO) << "[Mises] SearchTabHelper::NavigationEntryCommitted";
  SearchTabHelper::NavigationEntryCommitted_Chromium(load_details);

  if (search::IsInstantNTP(web_contents()) && instant_service_) {
      instant_service_->OnNewTabPageOpened();
  }
}

