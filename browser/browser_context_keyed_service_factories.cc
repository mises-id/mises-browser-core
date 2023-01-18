#include "mises/browser/browser_context_keyed_service_factories.h"

#include "base/feature_list.h"
#include "mises/components/ipfs/buildflags/buildflags.h"
#include "mises/components/brave_wallet//browser/json_rpc_service_factory.h"

#include "chrome/browser/profiles/chrome_browser_main_extra_parts_profiles.h"

#if BUILDFLAG(ENABLE_IPFS)
#include "mises/browser/ipfs/ipfs_service_factory.h"
#endif


namespace mises {

void EnsureMisesBrowserContextKeyedServiceFactoriesBuilt() {
  #if BUILDFLAG(ENABLE_IPFS)
  ipfs::IpfsServiceFactory::GetInstance();
#endif
  brave_wallet::JsonRpcServiceFactory::GetInstance();

}
void EnsureBrowserContextKeyedServiceFactoriesBuiltExtra() {

#if BUILDFLAG(IS_ANDROID)
  EnsureMisesBrowserContextKeyedServiceFactoriesBuilt();
#endif
}

void EnsureBrowserContextKeyedServiceFactoriesBuilt() {
#if !BUILDFLAG(IS_ANDROID)
  ChromeBrowserMainExtraPartsProfiles::
    EnsureBrowserContextKeyedServiceFactoriesBuilt();
  EnsureMisesBrowserContextKeyedServiceFactoriesBuilt();

#else
  ChromeBrowserMainExtraPartsProfiles::
    EnsureBrowserContextKeyedServiceFactoriesBuilt(false);

#endif
}

}