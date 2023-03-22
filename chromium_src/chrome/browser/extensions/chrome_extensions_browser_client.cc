#include "src/chrome/browser/extensions/chrome_extensions_browser_client.cc"

#if BUILDFLAG(IS_ANDROID)

#include "services/network/public/cpp/shared_url_loader_factory.h"
#include "chrome/browser/safe_browsing/extension_telemetry/extension_signal_processor.h"
#include "components/safe_browsing/core/common/proto/csd.pb.h"
#include "chrome/browser/safe_browsing/extension_telemetry/extension_telemetry_persister.h"
#include "chrome/browser/safe_browsing/extension_telemetry/extension_telemetry_uploader.h"
#include "chrome/browser/safe_browsing/extension_telemetry/extension_telemetry_config_manager.h"
namespace safe_browsing {

ExtensionTelemetryService::~ExtensionTelemetryService() = default;

ExtensionTelemetryService::ExtensionTelemetryService(
    Profile* profile,
    scoped_refptr<network::SharedURLLoaderFactory> url_loader_factory,
    extensions::ExtensionRegistry* extension_registry,
    extensions::ExtensionPrefs* extension_prefs)
    : profile_(profile),
      url_loader_factory_(url_loader_factory),
      extension_registry_(extension_registry),
      extension_prefs_(extension_prefs),
      enabled_(false),
      current_reporting_interval_(
          base::Seconds(kExtensionTelemetryUploadIntervalSeconds.Get())) {
  // Register for SB preference change notifications.
  
}

void ExtensionTelemetryService::AddSignal(
    std::unique_ptr<ExtensionSignal> signal) {
}
void ExtensionTelemetryService::Shutdown() {
}

}
#endif