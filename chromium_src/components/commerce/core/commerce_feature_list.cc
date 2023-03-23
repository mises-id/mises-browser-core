#include "src/components/commerce/core/commerce_feature_list.cc"

namespace commerce {


#if BUILDFLAG(IS_ANDROID)
// Get the time delay between discount fetches.
base::TimeDelta GetDiscountFetchDelay() {return base::Days(30);}
// Check if a URL belongs to a merchant with no discounts.
bool IsNoDiscountMerchant(const GURL& url) {return false;}
#endif
}  // namespace commerce

