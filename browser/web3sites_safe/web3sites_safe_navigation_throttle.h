#pragma once

#include <string>
#include <memory>

#include "content/public/browser/navigation_handle.h"
#include "content/public/browser/navigation_throttle.h"
#include "mises/browser/web3sites_safe/web3sites_safe_blocking_page.h"


namespace content {
class NavigationHandle;
}

class Profile;


struct  DomainInfo;

class Web3sitesSafeNavigationThrottle : public content::NavigationThrottle {
  public:
   explicit Web3sitesSafeNavigationThrottle(content::NavigationHandle* handle);
   ~Web3sitesSafeNavigationThrottle() override;

   // content::NavigationThrottle:
  ThrottleCheckResult WillProcessResponse() override;

  ThrottleCheckResult WillFailRequest() override;

  const char* GetNameForLogging() override;

  static std::unique_ptr<Web3sitesSafeNavigationThrottle>
  MaybeCreateNavigationThrottle(content::NavigationHandle* handle);

  private:

  void PerformChecksDeferred();

  void ShowInterstitial(const GURL& safe_domain,
                                       const GURL& lookalike_domain,
                                       ukm::SourceId source_id,
                                       Web3sitesSafeMatchType match_type,
                                       bool triggered_by_initial_url);

  base::WeakPtrFactory<Web3sitesSafeNavigationThrottle> weak_ptr_factory_{
      this};
  raw_ptr<Profile> profile_;


};
