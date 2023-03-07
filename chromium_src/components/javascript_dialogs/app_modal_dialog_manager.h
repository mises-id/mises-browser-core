#ifndef MISES_COMPONENTS_JAVASCRIPT_DIALOGS_APP_MODAL_DIALOG_MANAGER_H_
#define MISES_COMPONENTS_JAVASCRIPT_DIALOGS_APP_MODAL_DIALOG_MANAGER_H_

#include <memory>

#include "base/callback.h"
#include "base/gtest_prod_util.h"
#include "base/memory/singleton.h"
#include "components/javascript_dialogs/app_modal_dialog_controller.h"
#include "content/public/browser/javascript_dialog_manager.h"

#define  RunJavaScriptDialog RunJavaScriptDialog_Chromium(content::WebContents* web_contents,\
                           content::RenderFrameHost* render_frame_host,\
                           content::JavaScriptDialogType dialog_type,\
                           const std::u16string& message_text,\
                           const std::u16string& default_prompt_text,\
                           DialogClosedCallback callback,\
                           bool* did_suppress_message);\
        void RunJavaScriptDialog
#include "src/components/javascript_dialogs/app_modal_dialog_manager.h"
#undef  RunJavaScriptDialog
#endif  // COMPONENTS_JAVASCRIPT_DIALOGS_APP_MODAL_DIALOG_MANAGER_H_
