#include "chrome/browser/extensions/api/side_panel/side_panel_api.h"

#include "base/types/expected.h"
#include "base/values.h"
#include "chrome/browser/extensions/api/side_panel/side_panel_service.h"
#include "chrome/common/extensions/api/side_panel.h"
#include "extensions/common/extension_features.h"
#include "third_party/abseil-cpp/absl/types/optional.h"
#include "build/build_config.h"

#if BUILDFLAG(IS_ANDROID)

#define SidePanelOpenFunction SidePanelOpenFunction_Chromium
#include "src/chrome/browser/extensions/api/side_panel/side_panel_api.cc"
#undef SidePanelOpenFunction

#include "chrome/browser/extensions/extension_tab_util.h"
#include "chrome/browser/ui/android/tab_model/tab_model.h"
#include "chrome/browser/ui/android/tab_model/tab_model_list.h"

namespace extensions {
namespace {
bool IsSidePanelEnabled(const api::side_panel::PanelOptions& options) {
  return options.enabled.has_value() && *options.enabled &&
         options.path.has_value();
}
}


ExtensionFunction::ResponseAction SidePanelOpenFunction::RunFunction() {
  // Only available to extensions.
  EXTENSION_FUNCTION_VALIDATE(extension());
  LOG(INFO) << "SidePanelOpenFunction::RunFunction";
  // `sidePanel.open()` requires a user gesture.
  if (!user_gesture()) {
    return RespondNow(
        Error("`sidePanel.open()` may only be called in "
              "response to a user gesture."));
  }

  std::optional<api::side_panel::Open::Params> params =
      api::side_panel::Open::Params::Create(args());
  EXTENSION_FUNCTION_VALIDATE(params);

  if (!params->options.tab_id && !params->options.window_id) {
    return RespondNow(
        Error("At least one of `tabId` and `windowId` must be provided"));
  }

  content::WebContents* web_contents = nullptr;
  if (params->options.tab_id) {
    int tab_id = *params->options.tab_id;
    GetTabByIdAndroid(tab_id, &web_contents, nullptr);
  } else {
    CHECK(params->options.window_id);

  }

  SidePanelService* service = GetService();
  if (service) {
    LOG(INFO) << "SidePanelOpenFunction::RunFunction step 1";
    auto options = service->GetOptions(*extension(), /*tab_id=*/ExtensionTabUtil::GetTabId(web_contents));
    if (IsSidePanelEnabled(options)) {
      GURL side_panel_url = extension()->GetResourceURL(*options.path);
      if (side_panel_url != "") {  
        OpenSingleExtensionTab(extension(), side_panel_url, 0);
      }
    }


  }




  // TODO(crbug.com/40064601): Should we wait for the side panel to be
  // created and load? That would probably be nice.

  return RespondNow(NoArguments());
}

}

#else

#include "src/chrome/browser/extensions/api/side_panel/side_panel_api.cc"

#endif
