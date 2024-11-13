#include "build/build_config.h"
#include "chrome/browser/download/download_item_model.h"
#include "chrome/browser/download/download_ui_safe_browsing_util.h"
#if !BUILDFLAG(FULL_SAFE_BROWSING)
namespace {
    void SendSafeBrowsingDownloadReport_unused() {

    }
}

#define CompleteSafeBrowsingScan  IsMalicious
#define ReviewScanningVerdict(A)  IsMalicious()
#define SendSafeBrowsingDownloadReport(A, B, C) SendSafeBrowsingDownloadReport_unused()
#include "src/chrome/browser/ui/webui/downloads/downloads_dom_handler.cc"
#undef CompleteSafeBrowsingScan
#undef ReviewScanningVerdict
#undef SendSafeBrowsingDownloadReport
#else
#include "src/chrome/browser/ui/webui/downloads/downloads_dom_handler.cc"
#endif
