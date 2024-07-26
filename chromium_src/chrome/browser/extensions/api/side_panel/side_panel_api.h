#ifndef MISES_BROWSER_EXTENSIONS_API_SIDE_PANEL_SIDE_PANEL_API_H_
#define MISES_BROWSER_EXTENSIONS_API_SIDE_PANEL_SIDE_PANEL_API_H_

#include "extensions/browser/extension_function.h"
#include "extensions/browser/extension_function_histogram_value.h"

#define SidePanelOpenFunction SidePanelOpenFunction_Chromium


#include "src/chrome/browser/extensions/api/side_panel/side_panel_api.h"

#undef SidePanelOpenFunction 

namespace extensions {
  
class SidePanelOpenFunction : public SidePanelApiFunction {
 public:
  DECLARE_EXTENSION_FUNCTION("sidePanel.open", SIDEPANEL_OPEN)
  SidePanelOpenFunction() = default;
  SidePanelOpenFunction(const SidePanelOpenFunction&) = delete;
  SidePanelOpenFunction& operator=(const SidePanelOpenFunction&) = delete;

 private:
  ~SidePanelOpenFunction() override = default;
  ResponseAction RunFunction() override;
};



}

#endif