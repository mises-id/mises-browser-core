#ifndef MISES_EXTENSIONS_COMMON_FEATURES_FEATURE_DEVELOPER_MODE_ONLY_H_
#define MISES_EXTENSIONS_COMMON_FEATURES_FEATURE_DEVELOPER_MODE_ONLY_H_

#include <string>
#include "src/extensions/common/features/feature_developer_mode_only.h"

namespace content {
  class BrowserContext;
}

namespace extensions {

std::string GetDefaultEVMWalletID(int context_id);
std::string GetDefaultEVMWalletKeyProperty(int context_id);

void SetDefaultEVMWallet(int context_id, const std::string& id, const std::string& key_property);


void SetDefaultEVMWalletForBrowserContext(content::BrowserContext*  context, const std::string& id, const std::string& key_property);
std::string GetDefaultEVMWalletForBrowserContext(content::BrowserContext*  context);

}  // namespace extensions

#endif  // EXTENSIONS_COMMON_FEATURES_FEATURE_DEVELOPER_MODE_ONLY_H_

