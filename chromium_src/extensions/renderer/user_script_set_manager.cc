#include "extensions/renderer/user_script_set_manager.h"
#define GetAllInjections GetAllInjections_Chromium
#include "src/extensions/renderer/user_script_set_manager.cc"
#undef GetAllInjections

#include "extensions/common/constants.h"

namespace extensions {

void UserScriptSetManager::set_default_evm_wallet(const std::string& extension_id) {
  default_extension_id_evm_ = extension_id;
}
void UserScriptSetManager::GetAllInjections(
    std::vector<std::unique_ptr<ScriptInjection>>* injections,
    content::RenderFrame* render_frame,
    int tab_id,
    mojom::RunLocation run_location) {
  std::vector<std::string> order;
  order.push_back(std::string(default_extension_id_evm_));
  order.push_back(std::string(mises_extension_id));
  std::vector<UserScriptSetMap::const_iterator> items;
  for (auto it = scripts_.begin(); it != scripts_.end(); ++it) {
    items.push_back(it);
  }
  std::sort(
      items.begin(), items.end(),
      [&order](const UserScriptSetMap::const_iterator& l, const UserScriptSetMap::const_iterator& r) {
        std::vector<std::string>::iterator itrl = std::find(order.begin(), order.end(), l->first.id);
        std::vector<std::string>::iterator itrr = std::find(order.begin(), order.end(), r->first.id);
        if (itrl == itrr) {
          return l->first < r->first;
        }
        return itrl <  itrr;
  });
  for (auto it = items.begin(); it != items.end(); ++it) {
    (*it)->second->GetInjections(injections, render_frame, tab_id, run_location,
                              activity_logging_enabled_);
  }
}

}