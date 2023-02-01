#pragma once

#include "mises/components/web3sites_safe/core/web3sites_safe_util.h"


namespace base {
class Value;
}  // namespace base


// Populates |load_time_data| for interstitial HTML.
void PopulateWeb3sitesSafeBlockingPageStrings(base::Value::Dict& load_time_data,
                                             const GURL& safe_url,
                                             const GURL& request_url);

// Values added to get shared interstitial HTML to play nice.
void PopulateStringsForSharedHTML(base::Value::Dict& load_time_data);
