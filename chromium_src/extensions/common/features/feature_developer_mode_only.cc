#include "src/extensions/common/features/feature_developer_mode_only.cc"


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

void SetDefaultEVMWallet(int context_id, const std::string& id, const std::string& keyProperty) {
  DefaultEVMWallet wallet;
  wallet.id = id;
  wallet.keyProperty = keyProperty;
  GetDefaultEVMWalletMap()[context_id] = wallet;
}

}  // namespace extensions