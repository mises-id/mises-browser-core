#include "mises/browser/browser_context_keyed_service_factories.h"

#include "base/feature_list.h"
#include "mises/components/ipfs/buildflags/buildflags.h"
#include "mises/browser/brave_wallet/asset_ratio_service_factory.h"
#include "mises/browser/brave_wallet/brave_wallet_service_factory.h"
#include "mises/browser/brave_wallet/json_rpc_service_factory.h"
#include "mises/browser/brave_wallet/keyring_service_factory.h"
#include "mises/browser/brave_wallet/swap_service_factory.h"
#include "mises/browser/brave_wallet/tx_service_factory.h"
#include "mises/browser/permissions/permission_lifetime_manager_factory.h"


#include "chrome/browser/profiles/chrome_browser_main_extra_parts_profiles.h"

#if BUILDFLAG(ENABLE_IPFS)
#include "mises/browser/ipfs/ipfs_service_factory.h"
#endif


namespace mises {

void EnsureMisesBrowserContextKeyedServiceFactoriesBuilt() {
#if BUILDFLAG(ENABLE_IPFS)
  ipfs::IpfsServiceFactory::GetInstance();
#endif
  brave_wallet::AssetRatioServiceFactory::GetInstance();
  brave_wallet::KeyringServiceFactory::GetInstance();
  brave_wallet::JsonRpcServiceFactory::GetInstance();
  brave_wallet::SwapServiceFactory::GetInstance();
  brave_wallet::TxServiceFactory::GetInstance();
  brave_wallet::BraveWalletServiceFactory::GetInstance();

  PermissionLifetimeManagerFactory::GetInstance();

}
void EnsureBrowserContextKeyedServiceFactoriesBuiltExtra() {
  EnsureMisesBrowserContextKeyedServiceFactoriesBuilt();
}

void EnsureBrowserContextKeyedServiceFactoriesBuilt() {
#if !BUILDFLAG(IS_ANDROID)
  ChromeBrowserMainExtraPartsProfiles::
    EnsureBrowserContextKeyedServiceFactoriesBuilt();
  EnsureMisesBrowserContextKeyedServiceFactoriesBuilt();

#else
  ChromeBrowserMainExtraPartsProfiles::
    EnsureBrowserContextKeyedServiceFactoriesBuiltAndroid();
  PermissionLifetimeManagerFactory::GetInstance();

#endif
}

}
