#ifndef MISES_CHROMIUM_SRC_NET_BASE_FEATURES_H_
#define MISES_CHROMIUM_SRC_NET_BASE_FEATURES_H_

#include "base/feature_list.h"
#include "base/metrics/field_trial_params.h"
#include "net/base/net_export.h"

namespace net {
namespace features {

NET_EXPORT BASE_DECLARE_FEATURE(kMisesEphemeralStorage);
NET_EXPORT BASE_DECLARE_FEATURE(kMisesEphemeralStorageKeepAlive);
NET_EXPORT extern const base::FeatureParam<int>
    kMisesEphemeralStorageKeepAliveTimeInSeconds;
NET_EXPORT BASE_DECLARE_FEATURE(kMisesFirstPartyEphemeralStorage);
NET_EXPORT BASE_DECLARE_FEATURE(kMisesHttpsByDefault);
NET_EXPORT BASE_DECLARE_FEATURE(kMisesForgetFirstPartyStorage);
NET_EXPORT extern const base::FeatureParam<int>
    kMisesForgetFirstPartyStorageStartupCleanupDelayInSeconds;
NET_EXPORT extern const base::FeatureParam<bool>
    kMisesForgetFirstPartyStorageByDefault;
}  // namespace features
}  // namespace net

#include "src/net/base/features.h"  // IWYU pragma: export

#endif  // BRAVE_CHROMIUM_SRC_NET_BASE_FEATURES_H_
