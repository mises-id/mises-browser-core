
#ifndef MISES_COMPONENTS_PLUS_ADDRESSES_FEATURES_H_
#define MISES_COMPONENTS_PLUS_ADDRESSES_FEATURES_H_



#include "src/components/plus_addresses/features.h"


namespace plus_addresses::features {
#if BUILDFLAG(IS_ANDROID) 
COMPONENT_EXPORT(PLUS_ADDRESSES_FEATURES)
BASE_DECLARE_FEATURE(kPlusAddressUpdatedErrorStatesInOnboardingModal);
#endif  // !BUILDFLAG(IS_ANDROID) && !BUILDFLAG(IS_IOS)

}

#endif