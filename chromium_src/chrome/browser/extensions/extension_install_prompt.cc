#include "content/public/browser/javascript_dialog_manager.h"
#include "components/javascript_dialogs/app_modal_dialog_manager.h"
#include "chrome/browser/extensions/extension_install_prompt.h"
#include "mises/browser/extensions/mises_webstore_installer.h"

#if BUILDFLAG(IS_ANDROID)


namespace {

// Ensures that OnDialogClosed is only called once.
class CloseDialogCallbackWrapper
    : public base::RefCountedThreadSafe<CloseDialogCallbackWrapper> {
 public:

  explicit CloseDialogCallbackWrapper(ExtensionInstallPrompt::DoneCallback callback)
      : callback_(std::move(callback)) {}

  void Run(bool dialog_was_suppressed,
           bool success,
           const std::u16string& user_input) {
    if (success) {
      LOG(INFO) << "[EXTENSIONS] We received result from extension dialog (ACCEPTED)";
      std::move(callback_).Run(ExtensionInstallPrompt::DoneCallbackPayload(ExtensionInstallPrompt::Result::ACCEPTED));
    } else {
      LOG(INFO) << "[EXTENSIONS] We received result from extension dialog (REJECTED)";
      std::move(callback_).Run(ExtensionInstallPrompt::DoneCallbackPayload(ExtensionInstallPrompt::Result::USER_CANCELED));
    }
  }

 private:
  friend class base::RefCountedThreadSafe<CloseDialogCallbackWrapper>;
  ~CloseDialogCallbackWrapper() {}

  ExtensionInstallPrompt::DoneCallback callback_;
};


}


#define MISES_EXTENSION_INSTALL_PROMPT_SHOW_CONFIRMATION  \
  if (contents_ && contents_->GetPrimaryMainFrame() != nullptr && extensions::WebstoreInstallerHelper::FromWebContents(contents_) == nullptr) { \
    LOG(INFO) << "[EXTENSIONS] contents_ is not empty, displaying prompt"; \
    scoped_refptr<CloseDialogCallbackWrapper> wrapper = new CloseDialogCallbackWrapper(std::move(done_callback_)); \
    if (permissions_to_display) { \
      bool ignored; \
      javascript_dialogs::AppModalDialogManager::GetInstance()->RunJavaScriptDialog( \
          contents_, contents_->GetPrimaryMainFrame(), content::JAVASCRIPT_DIALOG_TYPE_CONFIRM, \
          prompt_->GetPermissionsAsString(), std::u16string(), \
                   base::BindOnce(&CloseDialogCallbackWrapper::Run, wrapper, false), \
                   &ignored); \
      return; \
    } \
  } 

#else

#define MISES_EXTENSION_INSTALL_PROMPT_SHOW_CONFIRMATION 

#endif

#include "src/chrome/browser/extensions/extension_install_prompt.cc"

#undef MISES_EXTENSION_INSTALL_PROMPT_SHOW_CONFIRMATION


std::u16string ExtensionInstallPrompt::Prompt::GetPermissionsAsString() const {
  std::u16string result = std::u16string();
  result = result + GetDialogTitle() + u"\n\n";
  result = result + GetPermissionsHeading() + u"\n\n";
  result = result + base::JoinString(prompt_permissions_.permissions,
                                     u"\n\n");
  result = result + base::JoinString(prompt_permissions_.details,
                                     u"\n");
  return result;
}

