#include "src/components/prefs/pref_value_store.cc"

void PrefValueStore::UpdateExtensionPrefStore(PrefStore* extension_prefs) {
  InitPrefStore(EXTENSION_STORE, extension_prefs);
}

bool PrefValueStore::DummyHasPrefStore() {
  return false;
}
