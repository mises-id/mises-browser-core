#include "src/extensions/renderer/dispatcher.cc"

namespace extensions {

void Dispatcher::SetDefaultEVMWallet(const std::string& extension_id) {
  extensions::SetDefaultEVMWallet(kRendererProfileId, extension_id);
  user_script_set_manager_->set_default_evm_wallet(extension_id);
}


}