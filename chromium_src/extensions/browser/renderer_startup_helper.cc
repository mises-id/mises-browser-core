#include "src/extensions/browser/renderer_startup_helper.cc"


namespace extensions {

  void RendererStartupHelper::OnDeveloperModeChanged_Unused() {

  }
  void RendererStartupHelper::OnDefaultEVMWalletChanged(const std::string& id, const std::string& keyProperty) {
    for (auto& process_entry : process_mojo_map_) {
        content::RenderProcessHost* process = process_entry.first;
        mojom::Renderer* renderer = GetRenderer(process);
        if (renderer)
          renderer->SetDefaultEVMWallet(id, keyProperty);
      }
  }
}