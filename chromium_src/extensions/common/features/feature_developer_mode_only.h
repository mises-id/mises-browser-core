#ifndef MISES_EXTENSIONS_COMMON_FEATURES_FEATURE_DEVELOPER_MODE_ONLY_H_
#define MISES_EXTENSIONS_COMMON_FEATURES_FEATURE_DEVELOPER_MODE_ONLY_H_

#include "src/extensions/common/features/feature_developer_mode_only.h"

namespace extensions {

std::string GetDefaultEVMWallet(int context_id);

void SetDefaultEVMWallet(int context_id, const std::string& id);

}  // namespace extensions

#endif  // EXTENSIONS_COMMON_FEATURES_FEATURE_DEVELOPER_MODE_ONLY_H_

