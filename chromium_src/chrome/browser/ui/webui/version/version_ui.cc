#include "src/chrome/browser/ui/webui/version/version_ui.cc"

#if BUILDFLAG(IS_ANDROID)
// static
std::u16string VersionUI::GetAnnotatedVersionStringForUi() {
  return l10n_util::GetStringFUTF16(
      IDS_SETTINGS_ABOUT_PAGE_BROWSER_VERSION,
      base::UTF8ToUTF16(version_info::GetVersionNumber()),
      l10n_util::GetStringUTF16(version_info::IsOfficialBuild()
                                    ? IDS_VERSION_UI_OFFICIAL
                                    : IDS_VERSION_UI_UNOFFICIAL),
      base::UTF8ToUTF16(GetProductModifier()),
      l10n_util::GetStringUTF16(VersionUI::VersionProcessorVariation()));
}
#endif  // !BUILDFLAG(IS_ANDROID)