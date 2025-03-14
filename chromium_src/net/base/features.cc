#include "src/net/base/features.cc"

#include "base/feature_override.h"

namespace net {
namespace features {

OVERRIDE_FEATURE_DEFAULT_STATES({{
    {kEnableWebTransportDraft07, base::FEATURE_DISABLED_BY_DEFAULT},
    // Enable NIK-partitioning by default.
    {kPartitionConnectionsByNetworkIsolationKey,
     base::FEATURE_ENABLED_BY_DEFAULT},
    {kTopLevelTpcdOriginTrial, base::FEATURE_DISABLED_BY_DEFAULT},
    {kTpcdMetadataGrants, base::FEATURE_DISABLED_BY_DEFAULT},
    {kWaitForFirstPartySetsInit, base::FEATURE_DISABLED_BY_DEFAULT},
}});

BASE_FEATURE(kMisesEphemeralStorage,
             "EphemeralStorage",
             base::FEATURE_ENABLED_BY_DEFAULT);
BASE_FEATURE(kMisesEphemeralStorageKeepAlive,
             "MisesEphemeralStorageKeepAlive",
             base::FEATURE_ENABLED_BY_DEFAULT);

const base::FeatureParam<int> kMisesEphemeralStorageKeepAliveTimeInSeconds = {
    &kMisesEphemeralStorageKeepAlive,
    "MisesEphemeralStorageKeepAliveTimeInSeconds", 30};

BASE_FEATURE(kMisesFirstPartyEphemeralStorage,
             "MisesFirstPartyEphemeralStorage",
             base::FEATURE_ENABLED_BY_DEFAULT);

// Enabled HTTPS by Default.
BASE_FEATURE(kMisesHttpsByDefault,
             "HttpsByDefault",
             base::FEATURE_ENABLED_BY_DEFAULT);

BASE_FEATURE(kMisesForgetFirstPartyStorage,
             "MisesForgetFirstPartyStorage",
             base::FEATURE_DISABLED_BY_DEFAULT);

const base::FeatureParam<int>
    kMisesForgetFirstPartyStorageStartupCleanupDelayInSeconds = {
        &kMisesForgetFirstPartyStorage,
        "MisesForgetFirstPartyStorageStartupCleanupDelayInSeconds", 5};
const base::FeatureParam<bool> kMisesForgetFirstPartyStorageByDefault = {
    &kMisesForgetFirstPartyStorage, "MisesForgetFirstPartyStorageByDefault",
    false};
}  // namespace features
}  // namespace net
