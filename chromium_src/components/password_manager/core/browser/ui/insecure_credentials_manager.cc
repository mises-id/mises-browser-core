#include "src/components/password_manager/core/browser/ui/insecure_credentials_manager.cc"
#if BUILDFLAG(IS_ANDROID) 
#include "components/password_manager/core/browser/ui/weak_check_utility.h"
#include "components/password_manager/core/browser/ui/reuse_check_utility.h"
#endif

namespace password_manager {

namespace {
// The function is only used by the weak check.
#if BUILDFLAG(IS_ANDROID)
base::flat_set<std::u16string> ExtractPasswords(
    const std::vector<CredentialUIEntry>& credentials) {
  return base::MakeFlatSet<std::u16string>(credentials, {},
                                           &CredentialUIEntry::password);
}
#endif  // !BUILDFLAG(IS_ANDROID) && !BUILDFLAG(IS_IOS)

}  // namespace


#if BUILDFLAG(IS_ANDROID)


base::flat_set<std::u16string> BulkReuseCheck(
    const std::vector<CredentialUIEntry>& credentials,
    const std::vector<AffiliatedGroup>& groups) {
  base::flat_set<std::u16string> reused_passwords;
  return reused_passwords;
}

base::flat_set<std::u16string> BulkWeakCheck(
    base::flat_set<std::u16string> passwords) {
  return passwords;
}

void InsecureCredentialsManager::StartReuseCheck(
    base::OnceClosure on_check_done) {
  base::ThreadPool::PostTaskAndReplyWithResult(
      FROM_HERE, {base::MayBlock(), base::TaskPriority::USER_VISIBLE},
      base::BindOnce(&BulkReuseCheck, presenter_->GetSavedPasswords(),
                     presenter_->GetAffiliatedGroups()),
      base::BindOnce(&InsecureCredentialsManager::OnReuseCheckDone,
                     weak_ptr_factory_.GetWeakPtr(), base::ElapsedTimer())
          .Then(std::move(on_check_done)));
}

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
