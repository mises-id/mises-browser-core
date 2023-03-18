#include "mises/browser/web3sites_safe/web3sites_safe_navigation_throttle.h"

#include <memory>
#include <string>

#include <unistd.h>
#include "base/feature_list.h"
#include "chrome/browser/profiles/profile.h"
#include "chrome/browser/reputation/reputation_service.h"
#include "mises/browser/web3sites_safe/web3sites_safe_controller_client.h"
#include "mises/browser/web3sites_safe/web3sites_safe_tab_storage.h"
#include "mises/browser/web3sites_safe/web3sites_safe_blocking_page.h"
#include "components/security_interstitials/content/security_interstitial_tab_helper.h"
#include "mises/browser/web3sites_safe/web3sites_safe_service.h"
#include "mises/browser/web3sites_safe/web3sites_safe_util.h"
#include "content/public/browser/navigation_handle.h"


namespace {
  typedef content::NavigationThrottle::ThrottleCheckResult ThrottleCheckResult;

  bool IsInterstitialReload(const GURL& current_url,
                          const std::vector<GURL>& stored_redirect_chain) {
  return stored_redirect_chain.size() > 1 &&
         stored_redirect_chain[stored_redirect_chain.size() - 1] == current_url;
}

/* const base::Feature kOptimizeWeb3sitesSafeNavigationThrottle{
    "OptimizeWeb3sitesSafeNavigationThrottle",
#if BUILDFLAG(IS_ANDROID)
    base::FEATURE_ENABLED_BY_DEFAULT
#else
    base::FEATURE_DISABLED_BY_DEFAULT
#endif
}; */
}

//Web3sitesSafeNavigationThrottle
Web3sitesSafeNavigationThrottle::Web3sitesSafeNavigationThrottle(
  content::NavigationHandle* navigation_handle)
  : content::NavigationThrottle(navigation_handle),
  profile_(Profile::FromBrowserContext(
          navigation_handle->GetWebContents()->GetBrowserContext())){
            auto* service = Web3sitesSafeService::Get(profile_);
             if (service->Web3sitesNeedUpdating()) {
                service->UpdateWeb3sites();
            }
          }

//~Web3sitesSafeNavigationThrottle
Web3sitesSafeNavigationThrottle::~Web3sitesSafeNavigationThrottle() {}

//WillStartRequest
ThrottleCheckResult Web3sitesSafeNavigationThrottle::WillStartRequest() {
  if (profile_->AsTestingProfile())
    return content::NavigationThrottle::PROCEED;

  /* auto* service = Web3sitesSafeService::Get(profile_);
  if (base::FeatureList::IsEnabled(kOptimizeWeb3sitesSafeNavigationThrottle) && service->Web3sitesNeedUpdating()) {
    service->UpdateWeb3sites();
  } */
  return content::NavigationThrottle::PROCEED;
}

//WillProcessResponse
ThrottleCheckResult Web3sitesSafeNavigationThrottle::WillProcessResponse() {

  LOG(INFO) << "Cg Web3sitesSafeNavigationThrottle::WillStartRequest -1";
  content::NavigationHandle* handle = navigation_handle();
 if (!handle->GetURL().SchemeIsHTTPOrHTTPS() || handle->GetNetErrorCode() != net::OK || !handle->IsInMainFrame() ||
      handle->IsSameDocument()) {
    return content::NavigationThrottle::PROCEED;
  }
  //tab storage
    Web3sitesSafeTabStorage* tab_storage =
      Web3sitesSafeTabStorage::GetOrCreate(handle->GetWebContents());
  const Web3sitesSafeTabStorage::InterstitialParams interstitial_params =
      tab_storage->GetInterstitialParams();
  tab_storage->ClearInterstitialParams();
  // If this is a reload and if the current URL is the last URL of the stored
  // redirect chain, the interstitial was probably reloaded. Stop the reload and
  // navigate back to the original lookalike URL so that the whole throttle is
  // exercised again.
  if (handle->GetReloadType() != content::ReloadType::NONE &&
      IsInterstitialReload(handle->GetURL(),
                           interstitial_params.redirect_chain)) {
      LOG(INFO) << "Cg ::Web3sitesSafeTabStorage::IsReload";
    CHECK(interstitial_params.url.SchemeIsHTTPOrHTTPS());
    // See
    // https://groups.google.com/a/chromium.org/forum/#!topic/chromium-dev/plIZV3Rkzok
    // for why this is OK. Assume interstitial reloads are always browser
    // initiated.
    handle->GetWebContents()->OpenURL(content::OpenURLParams(
        interstitial_params.url, interstitial_params.referrer,
        WindowOpenDisposition::CURRENT_TAB,
        ui::PageTransition::PAGE_TRANSITION_RELOAD,
        false /* is_renderer_initiated */));
    return content::NavigationThrottle::CANCEL_AND_IGNORE;
  }
  //defer check
  /* base::SequencedTaskRunner::GetCurrentDefault()->PostTask(
        FROM_HERE,
        base::BindOnce(&Web3sitesSafeNavigationThrottle::PerformChecksDeferred,
                       weak_ptr_factory_.GetWeakPtr()));
  return content::NavigationThrottle::DEFER; */
  return PerformChecks();
}

//WillFailRequest
ThrottleCheckResult Web3sitesSafeNavigationThrottle::WillFailRequest(){
  LOG(INFO) << "Cg Web3sitesSafeNavigationThrottle::WillFailRequest -1";

  return content::NavigationThrottle::PROCEED;
}

//PerformChecks
 ThrottleCheckResult Web3sitesSafeNavigationThrottle::PerformChecks(){
  LOG(INFO) << "Cg Web3sitesSafeNavigationThrottle::PerformCheck -1";
  content::NavigationHandle* handle = navigation_handle();
  GURL url = handle->GetURL();
  const GURL& last_url_in_redirect_chain =
    navigation_handle()
        ->GetRedirectChain()[navigation_handle()->GetRedirectChain().size() - 1];
  DCHECK(last_url_in_redirect_chain == navigation_handle()->GetURL() ||
        !navigation_handle()->GetBaseURLForDataURL().is_empty());

  // Check for two lookalikes -- at the beginning and end of the redirect chain.
  const GURL& first_url = navigation_handle()->GetRedirectChain()[0];
  const GURL& last_url = navigation_handle()->GetURL();
  if (first_url.host() != last_url.host()){
    MisesURLCheckResult first_check_result = LocalCheckUrl(first_url);
    return OnLocalCheckUrlResult(first_check_result);
  }
  //last url
  MisesURLCheckResult last_check_result = LocalCheckUrl(last_url);
  return OnLocalCheckUrlResult(last_check_result);
 }

MisesURLCheckResult Web3sitesSafeNavigationThrottle::LocalCheckUrl(const GURL& url)
{

  LOG(INFO) << "Cg Web3sitesSafeNavigationThrottle::CheckUrl url=" << url;
  GURL suggested_url = url;
  MisesURLCheckResult check_result(url,Web3sitesResultType::kWhite,suggested_url);
  // Don't warn on non-public domains.
  if (net::HostStringIsLocalhost(url.host()) ||
      net::IsHostnameNonUnique(url.host()) ||
      MisesGetETLDPlusOne(url.host()).empty()) {
      return check_result;
  }
  //is ignored
  if (ReputationService::Get(profile_)->IsIgnored(url)){
      LOG(INFO) << "Cg Web3sitesSafeNavigationThrottle::IsIgnored url=" << url;
      return check_result;
  }
   Web3sitesSafeService* service = Web3sitesSafeService::Get(profile_);
  //is white
  if (service->IsWeb3sitesWhiteList(url)){
     LOG(INFO) << "Cg Web3sitesSafeNavigationThrottle::CheckIsTopDomain url=" << url;
     return check_result;
  }
  //is top
  const MisesDomainInfo navigation_domain = GetMisesDomainInfo(url);
  LOG(INFO) << "Cg Web3sitesSafeNavigationThrottle::CheckIsTopDomain url=" << url;
  if(CheckIsTopDomain(navigation_domain)) {
    LOG(INFO) << "Cg Web3sitesSafeNavigationThrottle::IsTopDomain url=" << url;
    return check_result;
  }
  //is black
  if (service->IsWeb3sitesBlackList(url,&suggested_url)){
    LOG(INFO) << "Cg Web3sitesSafeNavigationThrottle::IsWeb3sitesBlackList url=" << url;
    check_result.result_type = Web3sitesResultType::kBlack;
    check_result.safe_url = suggested_url;
    return check_result;
  }
  //is fuzzy
  if (service->IsWeb3sitesFuzzyList(url,&suggested_url)){
    LOG(INFO) << "Cg Web3sitesSafeNavigationThrottle::IsWeb3sitesFuzzyList url=" << url;
    check_result.result_type = Web3sitesResultType::kFuzzy;
    check_result.safe_url = suggested_url;
    return check_result;
  }
  //is lookakie
  if (service->IsLookalike(url,&suggested_url)){
    LOG(INFO) << "Cg Web3sitesSafeNavigationThrottle::IsLookalike url=" << url;
    check_result.result_type = Web3sitesResultType::kFuzzy;
    check_result.safe_url = suggested_url;
    return check_result;
  }
  return check_result;
}

//OnLocalCheckUrlResult
ThrottleCheckResult Web3sitesSafeNavigationThrottle::OnLocalCheckUrlResult(const MisesURLCheckResult& check_url_result){
   LOG(INFO) << "Cg Web3sitesSafeNavigationThrottle::OnLocalCheckUrlResult"
    << ",url=" << check_url_result.check_url
    << ",result_type=" << check_url_result.result_type
    << ",safe_url=" << check_url_result.safe_url
   ;
   if (check_url_result.result_type == Web3sitesResultType::kWhite){
     return NavigationThrottle::PROCEED;
   }
   if (check_url_result.result_type == Web3sitesResultType::kBlack || check_url_result.result_type == Web3sitesResultType::kFuzzy){
    content::NavigationHandle* handle = navigation_handle();
    GURL url = handle->GetURL();
    const GURL& safe_domain = check_url_result.safe_url;
    const GURL& request_domain = url;
    ukm::SourceId source_id = ukm::ConvertToSourceId(
      navigation_handle()->GetNavigationId(), ukm::SourceIdType::NAVIGATION_ID);
    return ShowInterstitial(safe_domain,request_domain,source_id,check_url_result.result_type,false);
   }
  return NavigationThrottle::PROCEED;
}


//PerformChecksDeferred
void Web3sitesSafeNavigationThrottle::PerformChecksDeferred() {

  LOG(INFO) << "Cg Web3sitesSafeNavigationThrottle::PerformChecksDeferred -1";

  content::NavigationHandle* handle = navigation_handle();
   GURL url = handle->GetURL();
  // If the URL is in the local temporary allowlist, don't show any warning.
  if (ReputationService::Get(profile_)->IsIgnored(url)) {
     LOG(INFO) << "Cg Web3sitesSafeNavigationThrottle::IsIgnored"
     << ",url=" << url;
     ;
     Resume();
     return;
  }
  //is topdomains
  const MisesDomainInfo navigation_domain = GetMisesDomainInfo(url);
  if(CheckIsTopDomain(navigation_domain)) {
     Resume();
     return;
  }
  //check
   auto callback = std::make_unique<Web3sitesSafeService::MisesURLCheckCallback>(
      base::BindOnce(&Web3sitesSafeNavigationThrottle::OnApiCheckUrlResult,
                       weak_ptr_factory_.GetWeakPtr())
    );
    Web3sitesSafeService* service = Web3sitesSafeService::Get(profile_);
    service->CheckWeb3sitesURL(std::move(callback),url);
    return;
}

//OnApiCheckUrlResult
void Web3sitesSafeNavigationThrottle::OnApiCheckUrlResult(const MisesURLCheckResult& check_url_result){
   LOG(INFO) << "Cg Web3sitesSafeNavigationThrottle::OnApiCheckUrlResult -1";
   if (check_url_result.result_type == Web3sitesResultType::kWhite){
    Resume();
    return;
   }
   content::NavigationHandle* handle = navigation_handle();
    GURL url = handle->GetURL();
    const GURL& safe_domain = check_url_result.safe_url;
    const GURL& request_domain = url;
    ukm::SourceId source_id = ukm::ConvertToSourceId(
      navigation_handle()->GetNavigationId(), ukm::SourceIdType::NAVIGATION_ID);
    ThrottleCheckResult result = ShowInterstitial(safe_domain,request_domain,source_id,check_url_result.result_type,false);
    CancelDeferredNavigation(result);
}


//ShowInterstitial
ThrottleCheckResult Web3sitesSafeNavigationThrottle::ShowInterstitial(
    const GURL& safe_domain,
    const GURL& lookalike_domain,
    ukm::SourceId source_id,
    Web3sitesResultType::Type result_type,
    bool triggered_by_initial_url) {
  LOG(INFO) << "Cg Web3sitesSafeNavigationThrottle::ShowInterstitial -1";

  content::NavigationHandle* handle = navigation_handle();
  content::WebContents* web_contents = handle->GetWebContents();

  auto controller = std::make_unique<Web3sitesSafeControllerClient>(
      web_contents, lookalike_domain, safe_domain);

  std::unique_ptr<Web3sitesSafeBlockingPage> blocking_page(
      new Web3sitesSafeBlockingPage(
          web_contents, safe_domain, lookalike_domain, source_id, result_type,
          handle->IsSignedExchangeInnerResponse(), triggered_by_initial_url,
          std::move(controller)));

  absl::optional<std::string> error_page_contents =
      blocking_page->GetHTMLContents();

  security_interstitials::SecurityInterstitialTabHelper::AssociateBlockingPage(
      handle, std::move(blocking_page));
  //tab storage
  content::Referrer referrer(handle->GetReferrer().url,
                             handle->GetReferrer().policy);
  Web3sitesSafeTabStorage::GetOrCreate(handle->GetWebContents())
      ->OnWeb3sitesSafeInterstitialShown(lookalike_domain, referrer,
                                     handle->GetRedirectChain());
  return ThrottleCheckResult(content::NavigationThrottle::CANCEL,
                             net::ERR_BLOCKED_BY_CLIENT, error_page_contents);
  /* CancelDeferredNavigation(ThrottleCheckResult(content::NavigationThrottle::CANCEL,
                             net::ERR_BLOCKED_BY_CLIENT, error_page_contents)); */
}


//MaybeCreateNavigationThrottle
std::unique_ptr<Web3sitesSafeNavigationThrottle>
Web3sitesSafeNavigationThrottle::MaybeCreateNavigationThrottle(
    content::NavigationHandle* navigation_handle) {

  return std::make_unique<Web3sitesSafeNavigationThrottle>(navigation_handle);
};

//GetNameForLogging
const char* Web3sitesSafeNavigationThrottle::GetNameForLogging() {
  return "Web3sitesSafeNavigationThrottle";
}
