#ifndef MISES_CHROMIUM_SRC_COMPONENTS_PREFS_PREF_VALUE_STORE_H_
#define MISES_CHROMIUM_SRC_COMPONENTS_PREFS_PREF_VALUE_STORE_H_

#define HasPrefStore                                           \
  DummyHasPrefStore(); \
  void UpdateExtensionPrefStore(PrefStore* extension_prefs); \
  bool HasPrefStore


#include "src/components/prefs/pref_value_store.h"


#undef HasPrefStore

#endif  // MISES_CHROMIUM_SRC_COMPONENTS_PREFS_PREF_VALUE_STORE_H_
