#ifndef MISES_EXTENSIONS_BROWSER_RENDERER_STARTUP_HELPER_H_
#define MISES_EXTENSIONS_BROWSER_RENDERER_STARTUP_HELPER_H_

#define OnDeveloperModeChanged OnDeveloperModeChanged_Unused();\
      void OnDefaultEVMWalletChanged(const std::string& id);\
      void OnDeveloperModeChanged
  
#include "src/extensions/browser/renderer_startup_helper.h"

#undef OnDeveloperModeChanged

#endif
