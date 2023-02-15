#include "src/components/sync_preferences/pref_service_syncable.cc"

namespace sync_preferences {

void PrefServiceSyncable::UpdateExtensionPrefStore(
    PrefStore* extension_store) {
  // If |pref_service_forked_| is true, then this PrefService and the forked
  // copies will be out of sync.
  DCHECK(!pref_service_forked_);
  PrefService::UpdateExtensionPrefStore(extension_store);
}

}