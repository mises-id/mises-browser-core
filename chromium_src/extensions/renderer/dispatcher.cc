#include "src/extensions/renderer/dispatcher.cc"

namespace extensions {

void Dispatcher::SetDefaultEVMWallet(const std::string& id, const std::string& keyProperty) {
  extensions::SetDefaultEVMWallet(kRendererProfileId, id, keyProperty);
  user_script_set_manager_->set_default_evm_wallet(id);
}


}