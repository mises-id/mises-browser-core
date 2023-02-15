#pragma once

#include <memory>

#include "components/security_interstitials/content/security_interstitial_controller_client.h"
#include "url/gurl.h"

namespace content {
class WebContents;
}  // namespace content

// Class for handling commands from web3sites_safe interstitial pages.
class Web3sitesSafeControllerClient
    : public security_interstitials::SecurityInterstitialControllerClient {
 public:
  static std::unique_ptr<security_interstitials::MetricsHelper>
  GetMetricsHelper(const GURL& url);

  Web3sitesSafeControllerClient(
      content::WebContents* web_contents,
      const GURL& request_url,
      const GURL& safe_url);

  Web3sitesSafeControllerClient(const Web3sitesSafeControllerClient&) = delete;
  Web3sitesSafeControllerClient& operator=(const Web3sitesSafeControllerClient&) =
      delete;

  ~Web3sitesSafeControllerClient() override;

  // security_interstitials::ControllerClient overrides.
  void GoBack() override;
  void Proceed() override;

 private:
  const GURL request_url_;
  const GURL safe_url_;
};
