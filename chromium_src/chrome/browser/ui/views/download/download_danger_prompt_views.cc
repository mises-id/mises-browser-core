
#include "build/build_config.h"
#include "chrome/browser/download/download_item_model.h"
#include "chrome/browser/download/download_ui_safe_browsing_util.h"


#if !BUILDFLAG(FULL_SAFE_BROWSING)
namespace {
    void SendSafeBrowsingDownloadReport_unused(ClientSafeBrowsingReportRequest::ReportType report_type) {

    }
}
#define SendSafeBrowsingDownloadReport(A, B, C) SendSafeBrowsingDownloadReport_unused(A)
#include "src/chrome/browser/ui/views/download/download_danger_prompt_views.cc"
#undef SendSafeBrowsingDownloadReport
#else
#include "src/chrome/browser/ui/views/download/download_danger_prompt_views.cc"
#endif



#if BUILDFLAG(IS_ANDROID)
void DownloadDangerPrompt::RecordDownloadWarningEvent(
    Action action,
    download::DownloadItem* download) {

}
#endif
