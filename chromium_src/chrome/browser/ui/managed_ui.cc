
#include "src/chrome/browser/ui/managed_ui.cc"


namespace chrome {

#if BUILDFLAG(IS_ANDROID)

std::u16string GetManagedUiMenuItemLabel(Profile* profile) {
  absl::optional<std::string> account_manager =
      GetAccountManagerIdentity(profile);

  int string_id = IDS_MANAGED;
  std::vector<std::u16string> replacements;
  if (account_manager) {
    string_id = IDS_MANAGED_BY;
    replacements.push_back(base::UTF8ToUTF16(*account_manager));
  }

  return l10n_util::GetStringFUTF16(string_id, replacements, nullptr);
}

std::u16string GetManagedUiWebUILabel(Profile* profile) {
  absl::optional<std::string> account_manager =
      GetAccountManagerIdentity(profile);

  int string_id = IDS_MANAGED_WITH_HYPERLINK;
  std::vector<std::u16string> replacements;
  replacements.push_back(base::UTF8ToUTF16(chrome::kChromeUIManagementURL));
  if (account_manager) {
    string_id = IDS_MANAGED_BY_WITH_HYPERLINK;
    replacements.push_back(base::UTF8ToUTF16(*account_manager));
  }

  return l10n_util::GetStringFUTF16(string_id, replacements, nullptr);
}

#endif  // !BUILDFLAG(IS_ANDROID)


}  // namespace chrome
