#include "build/build_config.h"
#include "chrome/browser/download/download_item_model.h"
#if !BUILDFLAG(FULL_SAFE_BROWSING)
#define  CompleteSafeBrowsingScan  IsMalicious
#include "src/chrome/browser/ui/views/download/download_item_view.cc"
#undef CompleteSafeBrowsingScan
namespace safe_browsing {
absl::optional<enterprise_connectors::AnalysisSettings>
DeepScanningRequest::ShouldUploadBinary(download::DownloadItem* item){
  return absl::nullopt;
}
}
#else
#include "src/chrome/browser/ui/views/download/download_item_view.cc"
#endif
