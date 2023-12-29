#include "src/components/sync/base/features.h"
namespace syncer {

#if BUILDFLAG(IS_ANDROID) 
// Enables syncing the WEBAUTHN_CREDENTIAL data type.
BASE_DECLARE_FEATURE(kSyncWebauthnCredentials);
#endif  // !BUILDFLAG(IS_ANDROID) && !BUILDFLAG(IS_IOS)

}