#include "src/components/sync/base/features.cc"
namespace syncer {

#if BUILDFLAG(IS_ANDROID) 
BASE_FEATURE(kSyncWebauthnCredentials,
             "SyncWebauthnCredentials",
             base::FEATURE_DISABLED_BY_DEFAULT);
#endif  // !BUILDFLAG(IS_ANDROID) && !BUILDFLAG(IS_IOS)

}