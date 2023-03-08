#ifndef MISES_COMMON_URL_CONSTANTS_H_
#define MISES_COMMON_URL_CONSTANTS_H_


#include "build/build_config.h"
#include "src/chrome/common/url_constants.h"

#if BUILDFLAG(IS_ANDROID)
namespace chrome {
// The URL for the trusted vault sync passphrase opt in.
extern const char kSyncTrustedVaultOptInURL[];
extern const char kChromeAppsDeprecationLearnMoreURL[];\

// Please do not append entries here. See the comments at the top of the file.

}  // namespace chrome

#endif

#endif  // CHROME_COMMON_URL_CONSTANTS_H_
