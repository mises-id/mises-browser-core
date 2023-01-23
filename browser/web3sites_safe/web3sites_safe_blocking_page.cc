

#include "mises/browser/web3sites_safe/web3sites_safe_blocking_page.h"

#include <utility>

#include "chrome/common/webui_url_constants.h"
#include "components/grit/components_resources.h"
//#include "mises/components/web3sites_safe/core/web3sites_safe_ui_util.h"
#include "mises/components/web3sites_safe/core/web3sites_safe_util.h"
#include "components/security_interstitials/content/security_interstitial_controller_client.h"
#include "components/security_interstitials/core/common_string_util.h"
#include "components/security_interstitials/core/metrics_helper.h"
#include "content/public/browser/navigation_entry.h"
#include "content/public/browser/web_contents.h"
#include "net/base/net_errors.h"
#include "components/security_interstitials/core/common_string_util.h"
#include "components/strings/grit/components_strings.h"
#include "ui/base/l10n/l10n_util.h"

using security_interstitials::MetricsHelper;

// static
const security_interstitials::SecurityInterstitialPage::TypeID
    Web3sitesSafeBlockingPage::kTypeForTesting =
        &Web3sitesSafeBlockingPage::kTypeForTesting;

Web3sitesSafeBlockingPage::Web3sitesSafeBlockingPage(
    content::WebContents* web_contents,
    const GURL& safe_url,
    const GURL& request_url,
    ukm::SourceId source_id,
    Web3sitesSafeMatchType match_type,
    bool is_signed_exchange,
    bool triggered_by_initial_url,
    std::unique_ptr<
        security_interstitials::SecurityInterstitialControllerClient>
        controller_client)
    : security_interstitials::SecurityInterstitialPage(
          web_contents,
          request_url,
          std::move(controller_client)),
      safe_url_(safe_url),
      source_id_(source_id),
      match_type_(match_type){
  controller()->metrics_helper()->RecordUserDecision(MetricsHelper::SHOW);
  controller()->metrics_helper()->RecordUserInteraction(
      MetricsHelper::TOTAL_VISITS);
}

Web3sitesSafeBlockingPage::~Web3sitesSafeBlockingPage() = default;

security_interstitials::SecurityInterstitialPage::TypeID
Web3sitesSafeBlockingPage::GetTypeForTesting() {
  return Web3sitesSafeBlockingPage::kTypeForTesting;
}

void Web3sitesSafeBlockingPage::PopulateLookalikeStrins(base::Value::Dict& load_time_data){

  const GURL& request_url_ = request_url();
  load_time_data.Set("type", "LOOKALIKE");
  load_time_data.Set("tabTitle",
                     l10n_util::GetStringUTF16(IDS_LOOKALIKE_URL_TITLE));
  load_time_data.Set("optInLink", l10n_util::GetStringUTF16(
                                      IDS_SAFE_BROWSING_SCOUT_REPORTING_AGREE));
  load_time_data.Set(
      "enhancedProtectionMessage",
      l10n_util::GetStringUTF16(IDS_SAFE_BROWSING_ENHANCED_PROTECTION_MESSAGE));

  if (safe_url_.is_valid()) {
    const std::u16string hostname =
        security_interstitials::common_string_util::GetFormattedHostName(
            safe_url_);
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
  load_time_data.Set("lookalikeRequestHostname", request_url_.host());
}

void Web3sitesSafeBlockingPage::PopulatePhishingStrins(base::Value::Dict& load_time_data){
 load_time_data.Set("type", "SAFEBROWSING");
  load_time_data.Set("tabTitle",
                     l10n_util::GetStringUTF16(IDS_SAFEBROWSING_V3_TITLE));
  load_time_data.Set(
      "openDetails",
      l10n_util::GetStringUTF16(IDS_SAFEBROWSING_V3_OPEN_DETAILS_BUTTON));
  load_time_data.Set(
      "closeDetails",
      l10n_util::GetStringUTF16(IDS_SAFEBROWSING_V3_CLOSE_DETAILS_BUTTON));
  load_time_data.Set(
      "primaryButtonText",
      l10n_util::GetStringUTF16(IDS_SAFEBROWSING_OVERRIDABLE_SAFETY_BUTTON));
  load_time_data.Set("overridable", false);
  load_time_data.Set(
      security_interstitials::kOptInLink,
      l10n_util::GetStringUTF16(IDS_SAFE_BROWSING_SCOUT_REPORTING_AGREE));
  load_time_data.Set(
      security_interstitials::kEnhancedProtectionMessage,
      l10n_util::GetStringUTF16(IDS_SAFE_BROWSING_ENHANCED_PROTECTION_MESSAGE));

  //safe_url
  if (safe_url_.is_valid()) {
       const std::u16string hostname =
        security_interstitials::common_string_util::GetFormattedHostName(
            safe_url_);
    load_time_data.Set(
      "primaryButtonText",
      l10n_util::GetStringFUTF16(IDS_LOOKALIKE_URL_CONTINUE, hostname));

  }
  load_time_data.Set("phishing", true);
  load_time_data.Set("billing", false);
  load_time_data.Set("heading",
                     l10n_util::GetStringUTF16(IDS_PHISHING_V4_HEADING));
  load_time_data.Set(
      "primaryParagraph",
      l10n_util::GetStringFUTF16(
          IDS_PHISHING_V4_PRIMARY_PARAGRAPH,
          security_interstitials::common_string_util::GetFormattedHostName(request_url())));
  load_time_data.Set(
      "explanationParagraph",
      l10n_util::GetStringFUTF16(
          IDS_PHISHING_V4_EXPLANATION_PARAGRAPH,
          security_interstitials::common_string_util::GetFormattedHostName(request_url())));
  load_time_data.Set(
      "finalParagraph",
      l10n_util::GetStringUTF16(IDS_PHISHING_V4_PROCEED_AND_REPORT_PARAGRAPH));
}

void Web3sitesSafeBlockingPage::PopulateInterstitialStrings(
    base::Value::Dict& load_time_data) {
 /*  PopulateWeb3sitesSafeBlockingPageStrings(load_time_data, safe_url_,
                                          request_url()); */
  const GURL& request_url_ = request_url();
  /* */
  load_time_data.Set("openDetails", "");
  load_time_data.Set("explanationParagraph", "");
  load_time_data.Set("finalParagraph", "");
  load_time_data.Set("overridable", false);
  load_time_data.Set("hide_primary_button", false);
  //phishing
  if (request_url_.host() == "admin.mises.site"){
     PopulatePhishingStrins(load_time_data);
  }else{
    PopulateLookalikeStrins(load_time_data);
  }
  load_time_data.Set("show_recurrent_error_paragraph", false);
  load_time_data.Set("recurrentErrorParagraph", "");
}


void Web3sitesSafeBlockingPage::OnInterstitialClosing() {

}

bool Web3sitesSafeBlockingPage::ShouldDisplayURL() const {
  return false;
}

// This handles the commands sent from the interstitial JavaScript.
void Web3sitesSafeBlockingPage::CommandReceived(const std::string& command) {
  if (command == "\"pageLoadComplete\"") {
    // content::WaitForRenderFrameReady sends this message when the page
    // load completes. Ignore it.
    return;
  }

  int cmd = 0;
  bool retval = base::StringToInt(command, &cmd);
  DCHECK(retval);

  switch (cmd) {
    case security_interstitials::CMD_DONT_PROCEED:
      // If the interstitial doesn't have a suggested URL (e.g. punycode
      // interstitial), simply open the new tab page.
      if (!safe_url_.is_valid()) {
        controller()->OpenUrlInCurrentTab(GURL(chrome::kChromeUINewTabURL));
      } else {
        controller()->GoBack();
      }
      break;
    case security_interstitials::CMD_PROCEED:
      controller()->Proceed();
      break;
    case security_interstitials::CMD_DO_REPORT:
    case security_interstitials::CMD_DONT_REPORT:
    case security_interstitials::CMD_SHOW_MORE_SECTION:
      break;
    case security_interstitials::CMD_OPEN_DATE_SETTINGS:
    case security_interstitials::CMD_OPEN_REPORTING_PRIVACY:
    case security_interstitials::CMD_OPEN_WHITEPAPER:
    case security_interstitials::CMD_OPEN_HELP_CENTER:
      break;
    case security_interstitials::CMD_RELOAD:
    case security_interstitials::CMD_OPEN_DIAGNOSTIC:
    case security_interstitials::CMD_OPEN_LOGIN:
    case security_interstitials::CMD_REPORT_PHISHING_ERROR:
      // Not supported by the lookalike URL warning page.
      NOTREACHED() << "Unsupported command: " << command;
      break;
    case security_interstitials::CMD_ERROR:
    case security_interstitials::CMD_TEXT_FOUND:
    case security_interstitials::CMD_TEXT_NOT_FOUND:
      // Commands are for testing.
      break;
  }
}

int Web3sitesSafeBlockingPage::GetHTMLTemplateId() {
  return IDR_SECURITY_INTERSTITIAL_HTML;
}
