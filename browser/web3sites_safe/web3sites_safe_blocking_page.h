#pragma once

#include <memory>
#include <string>

#include "mises/browser/web3sites_safe/web3sites_safe_util.h"
#include "components/security_interstitials/content/security_interstitial_page.h"
#include "services/metrics/public/cpp/ukm_source_id.h"

class GURL;


class Web3sitesSafeBlockingPage
    : public security_interstitials::SecurityInterstitialPage {
 public:
  // Interstitial type, used in tests.
  static const security_interstitials::SecurityInterstitialPage::TypeID
      kTypeForTesting;

  Web3sitesSafeBlockingPage(
      content::WebContents* web_contents,
      const GURL& safe_url,
      const GURL& request_url,
      ukm::SourceId source_id,
      Web3sitesResultType::Type result_type,
      bool is_signed_exchange,
      bool triggered_by_initial_url,
      std::unique_ptr<
          security_interstitials::SecurityInterstitialControllerClient>
          controller);

  Web3sitesSafeBlockingPage(const Web3sitesSafeBlockingPage&) = delete;
  Web3sitesSafeBlockingPage& operator=(const Web3sitesSafeBlockingPage&) = delete;

  ~Web3sitesSafeBlockingPage() override;

  // SecurityInterstitialPage method:
  security_interstitials::SecurityInterstitialPage::TypeID GetTypeForTesting()
      override;


 protected:
  // SecurityInterstitialPage implementation:
  void CommandReceived(const std::string& command) override;
  void PopulateInterstitialStrings(base::Value::Dict& load_time_data) override;
  void PopulateLookalikeStrins(base::Value::Dict& load_time_data);
  void PopulatePhishingStrins(base::Value::Dict& load_time_data);
  void OnInterstitialClosing() override;
  bool ShouldDisplayURL() const override;
  int GetHTMLTemplateId() override;

 private:
  friend class Web3sitesSafeNavigationThrottleBrowserTest;

  // The URL suggested to the user as the safe URL. Can be empty, in which case
  // the default action on the interstitial takes the user to the new tab page.
  const GURL safe_url_;
  ukm::SourceId source_id_;
  Web3sitesSafeMatchType match_type_;
  Web3sitesResultType::Type result_type_;

};
