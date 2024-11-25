#include "src/extensions/common/features/feature_developer_mode_only.cc"

#include "extensions/browser/renderer_startup_helper.h"
#include "chrome/browser/profiles/profile.h"
#include "components/prefs/pref_service.h"
#include "chrome/common/pref_names.h"
#include "extensions/browser/extension_util.h"


namespace {

// A map between a profile (referenced by a unique id) and the current developer
// mode for that profile. Since different profiles have different developer
// modes, we need to have separate entries.
struct DefaultEVMWallet {
  std::string id;
  std::string keyProperty;
};
using DefaultEVMWalletMap = std::map<int, DefaultEVMWallet>;

DefaultEVMWalletMap& GetDefaultEVMWalletMap() {
  static base::NoDestructor<DefaultEVMWalletMap> map;
  return *map;
}

}  // namespace

namespace extensions {

std::string GetDefaultEVMWalletID(int context_id) {
  DefaultEVMWalletMap& map = GetDefaultEVMWalletMap();
  auto iter = map.find(context_id);
  return iter == map.end() ? "" : iter->second.id;

}
std::string GetDefaultEVMWalletKeyProperty(int context_id) {
  DefaultEVMWalletMap& map = GetDefaultEVMWalletMap();
  auto iter = map.find(context_id);
  return iter == map.end() ? "" : iter->second.keyProperty;

}

void SetDefaultEVMWallet(int context_id, const std::string& id, const std::string& key_property) {
  DefaultEVMWallet wallet;
  wallet.id = id;
  wallet.keyProperty = key_property;
  GetDefaultEVMWalletMap()[context_id] = wallet;
}

void SetDefaultEVMWalletForBrowserContext(content::BrowserContext*  context, const std::string& id, const std::string& key_property) {
  Profile* profile = Profile::FromBrowserContext(context);
  if (profile) {
    PrefService* prefs = profile->GetPrefs();
    prefs->SetString(prefs::kExtensionsUIDefaultEVMWalletID, id);
    prefs->SetString(prefs::kExtensionsUIDefaultEVMWalletKeyProperty, key_property);
    SetDefaultEVMWallet(util::GetBrowserContextId(context), id, key_property);
    RendererStartupHelperFactory::GetForBrowserContext(context)
                ->OnDefaultEVMWalletChanged(id, key_property);
  }
}

std::string GetDefaultEVMWalletForBrowserContext(content::BrowserContext*  context) {
  Profile* profile = Profile::FromBrowserContext(context);
  std::string id;
  if (profile) {
    PrefService* prefs = profile->GetPrefs();
    id = prefs->GetString(prefs::kExtensionsUIDefaultEVMWalletID);
  }

  return id;
}

}  // namespace extensions