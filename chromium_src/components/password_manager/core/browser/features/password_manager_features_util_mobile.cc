#include "src/components/password_manager/core/browser/features/password_manager_features_util_mobile.cc"


namespace password_manager::features_util {

void OptInToAccountStorage(PrefService* pref_service,
                           const syncer::SyncService* sync_service) {}
void OptOutOfAccountStorageAndClearSettings(PrefService* pref_service,
                                            const syncer::SyncService* sync_service) {}
void SetDefaultPasswordStore(PrefService* pref_service,
                             const syncer::SyncService* sync_service,
                             PasswordForm::Store default_store) {}

void RecordMoveOfferedToNonOptedInUser(
    PrefService* pref_service,
    const syncer::SyncService* sync_service) {

}

int GetMoveOfferedToNonOptedInUserCount(
    const PrefService* pref_service,
    const syncer::SyncService* sync_service) {
  return 0;
}

bool AreAccountStorageOptInPromosAllowed() {
  return false;
}

bool ShouldShowAccountStorageSettingToggle(
    const PrefService* pref_service,
    const syncer::SyncService* sync_service) {
  return false;
}

}