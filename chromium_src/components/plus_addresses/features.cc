#include "src/components/plus_addresses/features.cc"

#if BUILDFLAG(IS_ANDROID)

namespace plus_addresses::features {
BASE_FEATURE(kPlusAddressUpdatedErrorStatesInOnboardingModal,
             "PlusAddressUpdatedErrorStatesInOnboardingModal",
             base::FEATURE_DISABLED_BY_DEFAULT);
}

#endif