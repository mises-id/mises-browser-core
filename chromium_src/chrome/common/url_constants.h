#ifndef MISES_COMMON_URL_CONSTANTS_H_
#define MISES_COMMON_URL_CONSTANTS_H_


#include "build/build_config.h"
#include "src/chrome/common/url_constants.h"

#if BUILDFLAG(IS_ANDROID)
namespace chrome {
// The URL for the trusted vault sync passphrase opt in.
inline constexpr char kSyncTrustedVaultOptInURL[] =
    "https://passwords.google.com/encryption/enroll?"
    "utm_source=chrome&utm_medium=desktop&utm_campaign=encryption_enroll";

}  // namespace chrome

#endif

#endif  // CHROME_COMMON_URL_CONSTANTS_H_
