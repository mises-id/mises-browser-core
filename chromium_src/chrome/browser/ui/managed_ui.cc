
#include "src/chrome/browser/ui/managed_ui.cc"


namespace chrome {
#if BUILDFLAG(IS_ANDROID)

GURL GetManagedUiUrl(Profile* profile) {
  if (enterprise_util::IsBrowserManaged(profile)) {
    return GURL(kChromeUIManagementURL);
  }

#if BUILDFLAG(ENABLE_SUPERVISED_USERS)
  if (ShouldDisplayManagedByParentUi(profile)) {
    return GURL(supervised_user::kManagedByParentUiMoreInfoUrl.Get());
  }
#endif

  return GURL();
}

const gfx::VectorIcon& GetManagedUiIcon(Profile* profile) {
  CHECK(ShouldDisplayManagedUi(profile));

  if (enterprise_util::IsBrowserManaged(profile)) {
    return features::IsChromeRefresh2023()
               ? vector_icons::kBusinessChromeRefreshIcon
               : vector_icons::kBusinessIcon;
  }

  CHECK(ShouldDisplayManagedByParentUi(profile));
  return vector_icons::kFamilyLinkIcon;
}

std::u16string GetManagedUiMenuItemLabel(Profile* profile) {
  CHECK(ShouldDisplayManagedUi(profile));
#if BUILDFLAG(ENABLE_SUPERVISED_USERS)
  if (!enterprise_util::IsBrowserManaged(profile)) {
    CHECK(ShouldDisplayManagedByParentUi(profile));
  }
#endif  // BUILDFLAG(ENABLE_SUPERVISED_USERS)
  std::optional<std::string> account_manager =
      GetAccountManagerIdentity(profile);
  std::optional<std::string> device_manager = GetDeviceManagerIdentity();
  switch (GetManagementStringType(profile)) {
    case BROWSER_MANAGED:
      return l10n_util::GetStringUTF16(IDS_MANAGED);
    case BROWSER_MANAGED_BY:
    case BROWSER_PROFILE_SAME_MANAGED_BY:
      return l10n_util::GetStringFUTF16(IDS_MANAGED_BY,
                                        base::UTF8ToUTF16(*device_manager));
    case BROWSER_PROFILE_DIFFERENT_MANAGED_BY:
    case BROWSER_MANAGED_PROFILE_MANAGED_BY:
      return l10n_util::GetStringUTF16(IDS_BROWSER_PROFILE_MANAGED);
    case PROFILE_MANAGED_BY:
      return l10n_util::GetStringFUTF16(IDS_PROFILE_MANAGED_BY,
                                        base::UTF8ToUTF16(*account_manager));
    case SUPERVISED:
      return l10n_util::GetStringUTF16(IDS_MANAGED_BY_PARENT);
    case NOT_MANAGED:
      return std::u16string();
  }
  return std::u16string();
}

std::u16string GetManagedUiMenuItemTooltip(Profile* profile) {
  CHECK(ShouldDisplayManagedUi(profile));
  std::optional<std::string> account_manager =
      GetAccountManagerIdentity(profile);
  std::optional<std::string> device_manager = GetDeviceManagerIdentity();
  switch (GetManagementStringType(profile)) {
    case BROWSER_PROFILE_DIFFERENT_MANAGED_BY:
      return l10n_util::GetStringFUTF16(
          IDS_BROWSER_AND_PROFILE_DIFFERENT_MANAGED_BY_TOOLTIP,
          base::UTF8ToUTF16(*device_manager),
          base::UTF8ToUTF16(*account_manager));
    case BROWSER_MANAGED_PROFILE_MANAGED_BY:
      return l10n_util::GetStringFUTF16(
          IDS_BROWSER_MANAGED_AND_PROFILE_MANAGED_BY_TOOLTIP,
          base::UTF8ToUTF16(*account_manager));
    case BROWSER_MANAGED:
    case BROWSER_MANAGED_BY:
    case BROWSER_PROFILE_SAME_MANAGED_BY:
    case PROFILE_MANAGED_BY:
    case SUPERVISED:
    case NOT_MANAGED:
      return std::u16string();
  }
  return std::u16string();
}

std::string GetManagedUiWebUIIcon(Profile* profile) {
  if (enterprise_util::IsBrowserManaged(profile)) {
    return "cr:domain";
  }

#if BUILDFLAG(ENABLE_SUPERVISED_USERS)
  if (ShouldDisplayManagedByParentUi(profile)) {
    // The Family Link "kite" icon.
    return "cr20:kite";
  }
#endif

  // This method can be called even if we shouldn't display the managed UI.
  return std::string();
}

std::u16string GetManagedUiWebUILabel(Profile* profile) {
  std::optional<std::string> account_manager =
      GetAccountManagerIdentity(profile);
  std::optional<std::string> device_manager = GetDeviceManagerIdentity();

  switch (GetManagementStringType(profile)) {
    case BROWSER_MANAGED:
      return l10n_util::GetStringFUTF16(
          IDS_MANAGED_WITH_HYPERLINK,
          base::UTF8ToUTF16(chrome::kChromeUIManagementURL));
    case BROWSER_MANAGED_BY:
      return l10n_util::GetStringFUTF16(
          IDS_MANAGED_BY_WITH_HYPERLINK,
          base::UTF8ToUTF16(chrome::kChromeUIManagementURL),
          base::UTF8ToUTF16(*device_manager));
    case BROWSER_PROFILE_SAME_MANAGED_BY:
      return l10n_util::GetStringFUTF16(
          IDS_BROWSER_AND_PROFILE_SAME_MANAGED_BY_WITH_HYPERLINK,
          base::UTF8ToUTF16(chrome::kChromeUIManagementURL),
          base::UTF8ToUTF16(*device_manager));
    case BROWSER_PROFILE_DIFFERENT_MANAGED_BY:
      return l10n_util::GetStringFUTF16(
          IDS_BROWSER_AND_PROFILE_DIFFERENT_MANAGED_BY_WITH_HYPERLINK,
          base::UTF8ToUTF16(chrome::kChromeUIManagementURL),
          base::UTF8ToUTF16(*device_manager),
          base::UTF8ToUTF16(*account_manager));
    case BROWSER_MANAGED_PROFILE_MANAGED_BY:
      return l10n_util::GetStringFUTF16(
          IDS_BROWSER_MANAGED_AND_PROFILE_MANAGED_BY_WITH_HYPERLINK,
          base::UTF8ToUTF16(chrome::kChromeUIManagementURL),
          base::UTF8ToUTF16(*account_manager));
    case PROFILE_MANAGED_BY:
      return l10n_util::GetStringFUTF16(
          IDS_PROFILE_MANAGED_BY_WITH_HYPERLINK,
          base::UTF8ToUTF16(chrome::kChromeUIManagementURL),
          base::UTF8ToUTF16(*account_manager));
    case SUPERVISED:
#if BUILDFLAG(ENABLE_SUPERVISED_USERS)
      return l10n_util::GetStringFUTF16(
          IDS_MANAGED_BY_PARENT_WITH_HYPERLINK,
          base::UTF8ToUTF16(
              supervised_user::kManagedByParentUiMoreInfoUrl.Get()));
#else
      break;
#endif
    case NOT_MANAGED:
      return std::u16string();
  }
  return std::u16string();
}

std::u16string GetDeviceManagedUiHelpLabel(Profile* profile) {
#if BUILDFLAG(IS_CHROMEOS_ASH)
  return ManagementUI::GetManagementPageSubtitle(profile);
#else
  if (enterprise_util::IsBrowserManaged(profile)) {
    std::optional<std::string> manager = GetAccountManagerIdentity(profile);
    if (!manager &&
        base::FeatureList::IsEnabled(features::kFlexOrgManagementDisclosure)) {
      manager = GetDeviceManagerIdentity();
    }
    return manager && !manager->empty()
               ? l10n_util::GetStringFUTF16(IDS_MANAGEMENT_SUBTITLE_MANAGED_BY,
                                            base::UTF8ToUTF16(*manager))
               : l10n_util::GetStringUTF16(IDS_MANAGEMENT_SUBTITLE);
  }

// #if BUILDFLAG(ENABLE_SUPERVISED_USERS)
//   if (ShouldDisplayManagedByParentUi(profile)) {
//     return l10n_util::GetStringUTF16(IDS_HELP_MANAGED_BY_YOUR_PARENT);
//   }
// #endif

  return l10n_util::GetStringUTF16(IDS_MANAGEMENT_NOT_MANAGED_SUBTITLE);
#endif  // BUILDFLAG(IS_CHROMEOS_ASH)
}
#endif  // !BUILDFLAG(IS_ANDROID)

}  // namespace chrome
