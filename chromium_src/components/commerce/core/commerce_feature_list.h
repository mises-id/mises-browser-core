#ifndef MISES_COMPONENTS_COMMERCE_CORE_COMMERCE_FEATURE_LIST_H_
#define MISES_COMPONENTS_COMMERCE_CORE_COMMERCE_FEATURE_LIST_H_

#include "src/components/commerce/core/commerce_feature_list.h"

namespace commerce {

#if BUILDFLAG(IS_ANDROID)
// Get the time delay between discount fetches.
base::TimeDelta GetDiscountFetchDelay();
// Check if a URL belongs to a merchant with no discounts.
bool IsNoDiscountMerchant(const GURL& url);
#endif

}  // namespace commerce

#endif  // COMPONENTS_COMMERCE_CORE_COMMERCE_FEATURE_LIST_H_
