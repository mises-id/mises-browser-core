#include "src/chrome/browser/extensions/chrome_extensions_browser_client.cc"

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

//  base::TimeDelta kUploadIntervalSeconds = base::Seconds(3600);
//  constexpr int kNumChecksPerUploadInterval = 1;
//  base::TimeDelta kOffstoreFileDataCollectionDurationLimitSeconds =
//      base::Seconds(60);

// ExtensionTelemetryFileProcessor::~ExtensionTelemetryFileProcessor() = default;

// ExtensionTelemetryFileProcessor::ExtensionTelemetryFileProcessor()
//     : max_files_to_process_(kExtensionTelemetryFileDataMaxFilesToProcess.Get()),
//       max_file_size_(kExtensionTelemetryFileDataMaxFileSizeBytes.Get()),
//       max_files_to_read_(1000) {}

//  ExtensionTelemetryService::~ExtensionTelemetryService() = default;

// // // static
// ExtensionTelemetryService* ExtensionTelemetryService::Get(Profile* profile) {
//   return ExtensionTelemetryServiceFactory::GetInstance()->GetForProfile(
//       profile);
// }


// ExtensionTelemetryService::ExtensionTelemetryService(
//     Profile* profile,
//     scoped_refptr<network::SharedURLLoaderFactory> url_loader_factory)
//     : profile_(profile),
//       url_loader_factory_(url_loader_factory),
//       extension_registry_(extensions::ExtensionRegistry::Get(profile)),
//       extension_prefs_(extensions::ExtensionPrefs::Get(profile)),
//       enabled_(false),
//       current_reporting_interval_(kUploadIntervalSeconds),
//       num_checks_per_upload_interval_(kNumChecksPerUploadInterval),
//       offstore_file_data_collection_duration_limit_(
//           kOffstoreFileDataCollectionDurationLimitSeconds) {
//   // Register for SB preference change notifications.
  
// }

// void ExtensionTelemetryService::AddSignal(
//     std::unique_ptr<ExtensionSignal> signal) {
// }
// void ExtensionTelemetryService::Shutdown() {
// }

}
#endif