
#include "mises/components/web3sites_safe/core/web3sites_safe_ui_util.h"

#include "build/build_config.h"
#include "mises/components/web3sites_safe/core/web3sites_safe_util.h"
#include "components/security_interstitials/core/common_string_util.h"
#include "components/strings/grit/components_strings.h"
#include "ui/base/l10n/l10n_util.h"



void PopulateWeb3sitesSafeBlockingPageStrings(base::Value::Dict& load_time_data,
                                             const GURL& safe_url,
                                             const GURL& request_url) {
  PopulateStringsForSharedHTML(load_time_data);
  load_time_data.Set("tabTitle",
                     l10n_util::GetStringUTF16(IDS_LOOKALIKE_URL_TITLE));
  load_time_data.Set("optInLink", l10n_util::GetStringUTF16(
                                      IDS_SAFE_BROWSING_SCOUT_REPORTING_AGREE));
  load_time_data.Set(
      "enhancedProtectionMessage",
      l10n_util::GetStringUTF16(IDS_SAFE_BROWSING_ENHANCED_PROTECTION_MESSAGE));

  if (safe_url.is_valid()) {
    const std::u16string hostname =
        security_interstitials::common_string_util::GetFormattedHostName(
            safe_url);
    load_time_data.Set("heading", l10n_util::GetStringFUTF16(
                                      IDS_LOOKALIKE_URL_HEADING, hostname));
    load_time_data.Set(
        "primaryParagraph",
        l10n_util::GetStringUTF16(IDS_LOOKALIKE_URL_PRIMARY_PARAGRAPH));
    load_time_data.Set("proceedButtonText",
                       l10n_util::GetStringUTF16(IDS_LOOKALIKE_URL_IGNORE));
    load_time_data.Set(
        "primaryButtonText",
        l10n_util::GetStringFUTF16(IDS_LOOKALIKE_URL_CONTINUE, hostname));
  } else {
    // No safe URL available to suggest. This can happen when the navigated
    // domain fails IDN spoof checks but isn't a lookalike of a known domain.
    // TODO: Change to actual strings.
    load_time_data.Set(
        "heading",
        l10n_util::GetStringUTF16(IDS_LOOKALIKE_URL_HEADING_NO_SUGGESTED_URL));
    load_time_data.Set(
        "primaryParagraph",
        l10n_util::GetStringUTF16(
            IDS_LOOKALIKE_URL_PRIMARY_PARAGRAPH_NO_SUGGESTED_URL));
    load_time_data.Set("proceedButtonText",
                       l10n_util::GetStringUTF16(IDS_LOOKALIKE_URL_IGNORE));
    load_time_data.Set(
        "primaryButtonText",
        l10n_util::GetStringUTF16(IDS_LOOKALIKE_URL_BACK_TO_SAFETY));
#if BUILDFLAG(IS_IOS)
    // On iOS, offer to close the page instead of navigating to NTP when the
    // safe URL is empty or invalid, and unable to go back.
    absl::optional<bool> maybe_cant_go_back =
        load_time_data.FindBool("cant_go_back");
    if (maybe_cant_go_back && *maybe_cant_go_back) {
      load_time_data.Set(
          "primaryButtonText",
          l10n_util::GetStringUTF16(IDS_LOOKALIKE_URL_CLOSE_PAGE));
    }
#endif
  }
  load_time_data.Set("lookalikeRequestHostname", request_url.host());
}

void PopulateStringsForSharedHTML(base::Value::Dict& load_time_data) {
  load_time_data.Set("lookalike_url", true);
  load_time_data.Set("overridable", false);
  load_time_data.Set("hide_primary_button", false);
  load_time_data.Set("show_recurrent_error_paragraph", false);

  load_time_data.Set("recurrentErrorParagraph", "");
  load_time_data.Set("openDetails", "");
  load_time_data.Set("explanationParagraph", "");
  load_time_data.Set("finalParagraph", "");

  load_time_data.Set("type", "LOOKALIKE");
}
