#include "src/chrome/browser/enterprise/data_protection/data_protection_navigation_observer.cc"


#if BUILDFLAG(IS_ANDROID)
void MaybeTriggerUrlFilteringInterstitialEvent(
    content::WebContents* web_contents,
    const GURL& page_url,
    const std::string& threat_type,
    safe_browsing::RTLookupResponse rt_lookup_response) {

}
namespace safe_browsing {

// static
RealTimeUrlLookupServiceBase*
ChromeEnterpriseRealTimeUrlLookupServiceFactory::GetForProfile(
    Profile* profile) {
  return nullptr;
}
}
#endif