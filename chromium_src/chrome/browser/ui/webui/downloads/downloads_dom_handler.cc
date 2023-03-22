#include "build/build_config.h"
#include "chrome/browser/download/download_item_model.h"

#if !BUILDFLAG(FULL_SAFE_BROWSING)
#define  CompleteSafeBrowsingScan  IsMalicious
#define ReviewScanningVerdict(A)  IsMalicious()
#define SendDownloadReport(A, B, C, D) enabled_by_prefs()
#include "src/chrome/browser/ui/webui/downloads/downloads_dom_handler.cc"
#undef CompleteSafeBrowsingScan
#undef ReviewScanningVerdict
#undef SendDownloadReport
#else
#include "src/chrome/browser/ui/webui/downloads/downloads_dom_handler.cc"
#endif
