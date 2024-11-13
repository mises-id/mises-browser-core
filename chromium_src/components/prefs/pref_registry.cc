#include "components/prefs/pref_registry.h"
#include "base/logging.h"

#define RegisterPreference RegisterPreference_Chromium
#include "src/components/prefs/pref_registry.cc"
#undef RegisterPreference


void PrefRegistry::RegisterPreference(std::string_view path,
                                      base::Value default_value,
                                      uint32_t flags) {
  if (defaults_->GetValue(path, nullptr) || base::Contains(registration_flags_, path)) {
    LOG(INFO) << "PrefRegistry::RegisterPreference exists for " << path;
    return;
  }

  RegisterPreference_Chromium(path, std::move(default_value), flags);
}
