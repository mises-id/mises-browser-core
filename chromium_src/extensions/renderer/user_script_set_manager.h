
#ifndef MISES_EXTENSIONS_RENDERER_USER_SCRIPT_SET_MANAGER_H_
#define MISES_EXTENSIONS_RENDERER_USER_SCRIPT_SET_MANAGER_H_

#define GetAllInjections  GetAllInjections_Chromium(\
      std::vector<std::unique_ptr<ScriptInjection>>* injections,\
      content::RenderFrame* render_frame,\
      int tab_id,\
      mojom::RunLocation run_location);\
      void GetAllInjections
#include "src/extensions/renderer/user_script_set_manager.h"

#undef  GetAllInjections

#endif