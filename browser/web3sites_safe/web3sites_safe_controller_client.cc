
#include "mises/browser/web3sites_safe/web3sites_safe_controller_client.h"

#include <memory>
#include <utility>

#include "chrome/browser/browser_process.h"
#include "chrome/browser/profiles/profile.h"
#include "chrome/browser/reputation/reputation_service.h"
#include "chrome/common/url_constants.h"
#include "components/security_interstitials/content/settings_page_helper.h"
#include "components/security_interstitials/core/metrics_helper.h"
#include "content/public/browser/page_navigator.h"
#include "content/public/browser/web_contents.h"
#include "content/public/common/referrer.h"

// static
std::unique_ptr<security_interstitials::MetricsHelper>
Web3sitesSafeControllerClient::GetMetricsHelper(const GURL& url) {
  security_interstitials::MetricsHelper::ReportDetails settings;
  settings.metric_prefix = "web3sites_safe";

  return std::make_unique<security_interstitials::MetricsHelper>(url, settings,
                                                                 nullptr);
}

Web3sitesSafeControllerClient::Web3sitesSafeControllerClient(
    content::WebContents* web_contents,
    const GURL& request_url,
    const GURL& safe_url)
    : SecurityInterstitialControllerClient(
          web_contents,
          GetMetricsHelper(request_url),
          Profile::FromBrowserContext(web_contents->GetBrowserContext())
              ->GetPrefs(),
          g_browser_process->GetApplicationLocale(),
          GURL(chrome::kChromeUINewTabURL),
          /*settings_page_helper=*/nullptr),
      request_url_(request_url),
      safe_url_(safe_url) {}

Web3sitesSafeControllerClient::~Web3sitesSafeControllerClient() {}

void Web3sitesSafeControllerClient::GoBack() {
  // We don't offer 'go back', but rather redirect to the legitimate site.
  content::OpenURLParams params(safe_url_, content::Referrer(),
                                WindowOpenDisposition::CURRENT_TAB,
                                ui::PAGE_TRANSITION_LINK, false);

  // Prevent the back button from returning to the bad site.
  params.should_replace_current_entry = true;
  web_contents_->OpenURL(params);
}

void Web3sitesSafeControllerClient::Proceed() {
  ReputationService::Get(
      Profile::FromBrowserContext(web_contents_->GetBrowserContext()))
      ->SetUserIgnore(request_url_);
  Reload();
}
