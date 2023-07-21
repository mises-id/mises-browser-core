
#ifndef MISES_EXTENSIONS_RENDERER_USER_SCRIPT_SET_MANAGER_H_
#define MISES_EXTENSIONS_RENDERER_USER_SCRIPT_SET_MANAGER_H_

#define GetAllInjections  GetAllInjections_Chromium(\
      std::vector<std::unique_ptr<ScriptInjection>>* injections,\
      content::RenderFrame* render_frame,\
      int tab_id,\
      mojom::RunLocation run_location);\
      void set_default_evm_wallet(const std::string& extension_id);\
      std::string default_extension_id_evm_;\
      void GetAllInjections
#include "src/extensions/renderer/user_script_set_manager.h"

#undef  GetAllInjections

#endif