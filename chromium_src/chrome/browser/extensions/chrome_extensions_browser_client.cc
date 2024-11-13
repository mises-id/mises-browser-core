#include "mises/browser/extensions/updater/mises_update_client_config.h"
#include "chrome/browser/extensions/updater/chrome_update_client_config.h"

#define ChromeUpdateClientConfig MisesUpdateClientConfig
#include "src/chrome/browser/extensions/chrome_extensions_browser_client.cc"
#undef ChromeUpdateClientConfig

#if BUILDFLAG(IS_ANDROID)

#include "services/network/public/cpp/shared_url_loader_factory.h"
#include "chrome/browser/safe_browsing/extension_telemetry/extension_signal_processor.h"
#include "components/safe_browsing/core/common/proto/csd.pb.h"
#include "chrome/browser/safe_browsing/extension_telemetry/extension_telemetry_persister.h"
#include "chrome/browser/safe_browsing/extension_telemetry/extension_telemetry_uploader.h"
#include "chrome/browser/safe_browsing/extension_telemetry/extension_telemetry_config_manager.h"
#include "chrome/browser/safe_browsing/extension_telemetry/extension_telemetry_file_processor.h"
#include "chrome/browser/safe_browsing/download_protection/download_protection_service.h"
#include "components/safe_browsing/core/common/features.h"
namespace safe_browsing {

void DownloadProtectionService::UploadForConsumerDeepScanning(
      download::DownloadItem* item,
      DownloadItemWarningData::DeepScanTrigger trigger,
      base::optional_ref<const std::string> password) {}

ClientDownloadResponse::TailoredVerdict
DownloadProtectionService::GetDownloadProtectionTailoredVerdict(
    const download::DownloadItem* item) {
    return ClientDownloadResponse::TailoredVerdict();
}

}
#endif