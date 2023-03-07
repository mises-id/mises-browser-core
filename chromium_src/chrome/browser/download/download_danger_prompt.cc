#include "build/build_config.h"
#include "chrome/browser/download/download_danger_prompt.h"
#if !BUILDFLAG(IS_ANDROID)

#include "src/chrome/browser/download/download_danger_prompt.cc"


#else 

void DownloadDangerPrompt::SendSafeBrowsingDownloadReport(
    safe_browsing::ClientSafeBrowsingReportRequest::ReportType report_type,
    bool did_proceed,
    const download::DownloadItem& download) {
}
void DownloadDangerPrompt::RecordDownloadDangerPrompt(
    bool did_proceed,
    const download::DownloadItem& download) {
}

#endif
