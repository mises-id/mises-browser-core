#include "build/build_config.h"
#include "base/strings/utf_string_conversions.h"
#if BUILDFLAG(IS_ANDROID)
#include "mises/browser/android/mises/mises_controller.h"
#endif

#include "chrome/browser/ui/search/search_ipc_router.h"

#define SendMostVisitedInfo SendMostVisitedInfo_Chromium
#include "src/chrome/browser/ui/search/search_ipc_router.cc"
#undef SendMostVisitedInfo


void SearchIPCRouter::SendMostVisitedInfo(
    const InstantMostVisitedInfo& most_visited_info) {
  LOG(INFO) << "SearchIPCRouter::SendMostVisitedInfo step - 1";
  OnMisesInfoChanged();
  if (!embedded_search_client())
    return;
  LOG(INFO) << "SearchIPCRouter::SendMostVisitedInfo step - 2";
  SendMostVisitedInfo_Chromium(most_visited_info);
}


void SearchIPCRouter::OnMisesInfoChanged() {
  if (!embedded_search_client())
    return;
#if BUILDFLAG(IS_ANDROID)
  std::string info = android::MisesController::GetInstance()->getMisesUserInfo();
  std::u16string result =  base::UTF8ToUTF16(info.c_str());
  embedded_search_client()->MisesInfoChanged(result);
#endif
}

void SearchIPCRouter::OpenExtension( const GURL& url) {
  delegate_->OnOpenExtension(url);
}

void SearchIPCRouter::ShowRewardAd() {
}

void SearchIPCRouter::LogEvent(const std::u16string &event_type, const std::u16string &key,const std::u16string &value) {
  delegate_->OnLogEvent( event_type, key, value);
}

