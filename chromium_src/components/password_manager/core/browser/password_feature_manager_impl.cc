#include "src/components/password_manager/core/browser/password_feature_manager_impl.cc"


#if BUILDFLAG(IS_ANDROID)
namespace password_manager {
void PasswordFeatureManagerImpl::OptInToAccountStorage() {
  //features_util::OptInToAccountStorage(pref_service_, sync_service_);
}

void PasswordFeatureManagerImpl::OptOutOfAccountStorage() {
  //features_util::OptOutOfAccountStorage(pref_service_, sync_service_);
}

void PasswordFeatureManagerImpl::OptOutOfAccountStorageAndClearSettings() {
  //features_util::OptOutOfAccountStorageAndClearSettings(pref_service_,
  //                                                      sync_service_);
}

void PasswordFeatureManagerImpl::SetDefaultPasswordStore(
    const PasswordForm::Store& store) {
  //features_util::SetDefaultPasswordStore(pref_service_, sync_service_, store);
}

bool PasswordFeatureManagerImpl::
    ShouldOfferOptInAndMoveToAccountStoreAfterSavingLocally() const {
  return ShouldShowAccountStorageOptIn() && !IsDefaultPasswordStoreSet();
}

bool PasswordFeatureManagerImpl::ShouldChangeDefaultPasswordStore() const {
  return IsOptedInForAccountStorage() && IsDefaultPasswordStoreSet() &&
         GetDefaultPasswordStore() == PasswordForm::Store::kProfileStore;
}
}

#endif



