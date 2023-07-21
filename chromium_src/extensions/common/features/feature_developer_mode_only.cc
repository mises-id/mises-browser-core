#include "src/extensions/common/features/feature_developer_mode_only.cc"


namespace {

// A map between a profile (referenced by a unique id) and the current developer
// mode for that profile. Since different profiles have different developer
// modes, we need to have separate entries.
using DefaultEVMWalletMap = std::map<int, std::string>;

DefaultEVMWalletMap& GetDefaultEVMWalletMap() {
  static base::NoDestructor<DefaultEVMWalletMap> map;
  return *map;
}

}  // namespace

namespace extensions {

std::string GetDefaultEVMWallet(int context_id) {
  DefaultEVMWalletMap& map = GetDefaultEVMWalletMap();
  auto iter = map.find(context_id);
  return iter == map.end() ? "" : iter->second;

}

void SetDefaultEVMWallet(int context_id, const std::string& id) {
  GetDefaultEVMWalletMap()[context_id] = id;
}

}  // namespace extensions