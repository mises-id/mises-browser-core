#include "mises/browser/web3sites_safe/web3sites_safe_tab_storage.h"

#include <string>

#include "base/memory/ptr_util.h"
#include "content/public/browser/web_contents.h"

// This bit of chaos ensures that kAllowlistKey is an arbitrary but
// unique-in-the-process value (namely, its own memory address) without casts.
const void* const kAllowlistKey = &kAllowlistKey;

Web3sitesSafeTabStorage::InterstitialParams::InterstitialParams() = default;

Web3sitesSafeTabStorage::InterstitialParams::~InterstitialParams() = default;

Web3sitesSafeTabStorage::InterstitialParams::InterstitialParams(
    const InterstitialParams& other) = default;

Web3sitesSafeTabStorage::Web3sitesSafeTabStorage() = default;

Web3sitesSafeTabStorage::~Web3sitesSafeTabStorage() = default;

// static
Web3sitesSafeTabStorage* Web3sitesSafeTabStorage::GetOrCreate(
    content::WebContents* web_contents) {
  Web3sitesSafeTabStorage* storage = static_cast<Web3sitesSafeTabStorage*>(
      web_contents->GetUserData(kAllowlistKey));
  if (!storage) {
    storage = new Web3sitesSafeTabStorage;
    web_contents->SetUserData(kAllowlistKey, base::WrapUnique(storage));
  }
  return storage;
}

void Web3sitesSafeTabStorage::OnWeb3sitesSafeInterstitialShown(
    const GURL& url,
    const content::Referrer& referrer,
    const std::vector<GURL>& redirect_chain) {
  interstitial_params_.url = url;
  interstitial_params_.referrer = referrer;
  interstitial_params_.redirect_chain = redirect_chain;
}

void Web3sitesSafeTabStorage::ClearInterstitialParams() {
  interstitial_params_.url = GURL();
  interstitial_params_.referrer = content::Referrer();
  interstitial_params_.redirect_chain.clear();
}

Web3sitesSafeTabStorage::InterstitialParams
Web3sitesSafeTabStorage::GetInterstitialParams() const {
  return interstitial_params_;
}
