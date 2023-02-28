#include "src/components/password_manager/core/browser/ui/insecure_credentials_manager.cc"
#if BUILDFLAG(IS_ANDROID) 
#include "components/password_manager/core/browser/ui/weak_check_utility.h"
#endif

namespace password_manager {

namespace {
// The function is only used by the weak check.
#if BUILDFLAG(IS_ANDROID)
base::flat_set<std::u16string> ExtractPasswords(
    SavedPasswordsPresenter::SavedPasswordsView password_forms) {
  return base::MakeFlatSet<std::u16string>(password_forms, {},
                                           &PasswordForm::password_value);
}
#endif  // !BUILDFLAG(IS_ANDROID) && !BUILDFLAG(IS_IOS)

}  // namespace


#if BUILDFLAG(IS_ANDROID)
void InsecureCredentialsManager::StartWeakCheck(
    base::OnceClosure on_check_done) {
  base::ThreadPool::PostTaskAndReplyWithResult(
      FROM_HERE, {base::MayBlock(), base::TaskPriority::USER_VISIBLE},
      base::BindOnce(&BulkWeakCheck,
                     ExtractPasswords(presenter_->GetSavedPasswords())),
      base::BindOnce(&InsecureCredentialsManager::OnWeakCheckDone,
                     weak_ptr_factory_.GetWeakPtr(), base::ElapsedTimer())
          .Then(std::move(on_check_done)));
}
#endif  // !BUILDFLAG(IS_ANDROID) && !BUILDFLAG(IS_IOS)


}  // namespace password_manager
