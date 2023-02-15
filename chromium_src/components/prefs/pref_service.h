#ifndef MISES_CHROMIUM_SRC_COMPONENTS_PREFS_PREF_SERVICE_H_
#define MISES_CHROMIUM_SRC_COMPONENTS_PREFS_PREF_SERVICE_H_

#include "components/prefs/pref_value_store.h"

#define UpdateCommandLinePrefStore                                           \
  UpdateExtensionPrefStore(PrefStore* extension_prefs); \
  virtual void UpdateCommandLinePrefStore


#include "src/components/prefs/pref_service.h"


#undef UpdateCommandLinePrefStore

#endif  // MISES_CHROMIUM_SRC_COMPONENTS_PREFS_SERVICE_H_
