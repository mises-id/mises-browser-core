#include "src/components/prefs/pref_service.cc"

void PrefService::UpdateExtensionPrefStore(PrefStore* extension_prefs) {
  pref_value_store_->UpdateExtensionPrefStore(extension_prefs);
}
