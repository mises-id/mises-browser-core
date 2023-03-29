#pragma once
#include <set>
#include <vector>

#include "base/supports_user_data.h"
#include "content/public/browser/page_navigator.h"
#include "content/public/common/referrer.h"
#include "url/gurl.h"

namespace content {
class WebContents;
}  // namespace content

// A short-lived, per-tab storage for lookalike interstitials, containing
// extra URL parameters for handling interstitial reloads.
class Web3sitesSafeTabStorage : public base::SupportsUserData::Data {
 public:
  struct InterstitialParams {
    // We store a limited amount of information here. This might not be
    // sufficient to construct the original navigation in some edge cases (e.g.
    // POST'd to the lookalike URL, which then redirected). However, the
    // original navigation will be blocked with an interstitial, so this is an
    // acceptable compromise.
    GURL url;
    std::vector<GURL> redirect_chain;
    content::Referrer referrer;

    InterstitialParams();
    InterstitialParams(const InterstitialParams& other);
    ~InterstitialParams();
  };

  Web3sitesSafeTabStorage();

  Web3sitesSafeTabStorage(const Web3sitesSafeTabStorage&) = delete;
  Web3sitesSafeTabStorage& operator=(const Web3sitesSafeTabStorage&) = delete;

  ~Web3sitesSafeTabStorage() override;

  static Web3sitesSafeTabStorage* GetOrCreate(
      content::WebContents* web_contents);

  // Stores parameters associated with a lookalike interstitial. Must be called
  // when a lookalike interstitial is shown.
  void OnWeb3sitesSafeInterstitialShown(const GURL& url,
                                    const content::Referrer& referrer,
                                    const std::vector<GURL>& redirect_chain);
  // Clears stored parameters associated with a lookalike interstitial.
  void ClearInterstitialParams();
  // Returns currently stored parameters associated with a lookalike
  // interstitial.
  InterstitialParams GetInterstitialParams() const;

 private:
  // Parameters associated with the currently displayed interstitial. These are
  // cleared immediately on next navigation.
  InterstitialParams interstitial_params_;
};
