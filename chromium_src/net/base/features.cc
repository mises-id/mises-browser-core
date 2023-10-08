#include "src/net/base/features.cc"

#include "base/feature_override.h"

namespace net {
namespace features {

OVERRIDE_FEATURE_DEFAULT_STATES({{
    {kNoncedPartitionedCookies, base::FEATURE_DISABLED_BY_DEFAULT},
    // Enable NIK-partitioning by default.
    {kPartitionConnectionsByNetworkIsolationKey,
     base::FEATURE_ENABLED_BY_DEFAULT},
    {kPartitionedCookies, base::FEATURE_DISABLED_BY_DEFAULT},
    {kPartitionHttpServerPropertiesByNetworkIsolationKey,
     base::FEATURE_ENABLED_BY_DEFAULT},
    {kPartitionSSLSessionsByNetworkIsolationKey,
     base::FEATURE_ENABLED_BY_DEFAULT},
    {kSamePartyAttributeEnabled, base::FEATURE_DISABLED_BY_DEFAULT},
    {kSplitHostCacheByNetworkIsolationKey, base::FEATURE_ENABLED_BY_DEFAULT},
    // It is necessary yet to make chromium storage partitioning compatible with
    // Brave ephemeral storage. For reference:
    // https://github.com/brave/brave-browser/issues/26165
    {kSupportPartitionedBlobUrl, base::FEATURE_DISABLED_BY_DEFAULT},
}});

BASE_FEATURE(kMisesEphemeralStorage,
             "EphemeralStorage",
             base::FEATURE_DISABLED_BY_DEFAULT);


}  // namespace features
}  // namespace net
