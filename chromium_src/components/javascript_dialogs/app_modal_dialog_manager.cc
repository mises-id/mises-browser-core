#include "components/javascript_dialogs/app_modal_dialog_manager.h"

#define  RunJavaScriptDialog RunJavaScriptDialog_Chromium
#include "src/components/javascript_dialogs/app_modal_dialog_manager.cc"
#undef RunJavaScriptDialog


namespace javascript_dialogs {



void AppModalDialogManager::RunJavaScriptDialog(
    content::WebContents* web_contents,
    content::RenderFrameHost* render_frame_host,
    content::JavaScriptDialogType dialog_type,
    const std::u16string& message_text,
    const std::u16string& default_prompt_text,
    DialogClosedCallback callback,
    bool* did_suppress_message) {
  *did_suppress_message = false;

  if (render_frame_host != NULL) {
    const url::Origin unwrapped_alerting_frame_origin =
        UnwrapOriginIfOpaque(render_frame_host->GetLastCommittedOrigin());

    if (unwrapped_alerting_frame_origin.GetURL().SchemeIs("chrome-extension")) {
      *did_suppress_message = true;
      return;
    }
  }
  RunJavaScriptDialog_Chromium(web_contents, render_frame_host, dialog_type, message_text, default_prompt_text, std::move(callback), did_suppress_message);

}

}  // namespace javascript_dialogs
