#ifndef MISES_CHROMIUM_SRC_COMPONENTS_SYNC_PREFERENCES_PREF_SERVICE_SYNCABLE_H_
#define MISES_CHROMIUM_SRC_COMPONENTS_SYNC_PREFERENCES_PREF_SERVICE_SYNCABLE_H_

#include "components/prefs/pref_service.h"

#define UpdateCommandLinePrefStore                                           \
  UpdateExtensionPrefStore(PrefStore* extension_prefs) override; \
  void UpdateCommandLinePrefStore


#include "src/components/sync_preferences/pref_service_syncable.h"


#undef UpdateCommandLinePrefStore

#endif  // MISES_CHROMIUM_SRC_COMPONENTS_SYNC_PREFERENCES_PREF_SERVICE_SYNCABLE_H_
