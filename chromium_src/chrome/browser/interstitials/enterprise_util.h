#ifndef MISES_CHROME_BROWSER_INTERSTITIALS_ENTERPRISE_UTIL_H_
#define MISES_CHROME_BROWSER_INTERSTITIALS_ENTERPRISE_UTIL_H_
#include "src/chrome/browser/interstitials/enterprise_util.h"



#if BUILDFLAG(IS_ANDROID)
// If user is not in incognito mode, triggers
// "safeBrowsingPrivate.onUrlFilteringInterstitial" extension event.
void MaybeTriggerUrlFilteringInterstitialEvent(
    content::WebContents* web_contents,
    const GURL& page_url,
    const std::string& threat_type,
    safe_browsing::RTLookupResponse rt_lookup_response);
#endif

#endif