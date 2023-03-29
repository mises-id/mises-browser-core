#ifndef MISES_CHROMIUM_SRC_COMPONENTS_PREFS_PREF_VALUE_STORE_H_
#define MISES_CHROMIUM_SRC_COMPONENTS_PREFS_PREF_VALUE_STORE_H_

#include "components/prefs/json_pref_store.h"
#define IsInitializationComplete                                           \
  DummyIsInitializationComplete(); \
  void UpdateExtensionPrefStore(PrefStore* extension_prefs); \
  bool IsInitializationComplete


#include "src/components/prefs/pref_value_store.h"


#undef IsInitializationComplete

#endif  // MISES_CHROMIUM_SRC_COMPONENTS_PREFS_PREF_VALUE_STORE_H_
