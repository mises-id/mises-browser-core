#ifndef MISES_THIRD_PARTY_BLINK_PUBLIC_COMMON_USER_AGENT_USER_AGENT_METADATA_H_
#define MISES_THIRD_PARTY_BLINK_PUBLIC_COMMON_USER_AGENT_USER_AGENT_METADATA_H_

#include <optional>
#include <string>
#include <vector>

#include "third_party/blink/public/common/common_export.h"

#include "src/third_party/blink/public/common/user_agent/user_agent_metadata.h"

namespace blink {
  BLINK_COMMON_EXPORT void UpdateUserAgentMetadataFingerprint(UserAgentMetadata* metadata);
  
  BLINK_COMMON_EXPORT std::string GetUserAgentFingerprintBrandInfo();
}
#endif