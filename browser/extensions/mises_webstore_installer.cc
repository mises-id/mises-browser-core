
#include "mises/browser/extensions/mises_webstore_installer.h"

namespace extensions {


WebstoreInstallerForImporting::WebstoreInstallerForImporting(
      const std::string& webstore_item_id,
      Profile* profile,
      Callback callback)
      : WebstoreStandaloneInstaller(webstore_item_id,
                                    profile,
                                    std::move(callback)),
        dummy_web_contents_(content::WebContents::Create(content::WebContents::CreateParams(profile))),
        parent_window_(nullptr) {
    set_install_source(WebstoreInstaller::INSTALL_SOURCE_OTHER);

    GURL webstore_url("https://chromewebstore.google.com/detail/" + webstore_item_id);
    content::NavigationController::LoadURLParams load_params(webstore_url);
    dummy_web_contents_->GetController().LoadURLWithParams(load_params);
  }

  WebstoreInstallerForImporting::~WebstoreInstallerForImporting() = default;

  content::WebContents* WebstoreInstallerForImporting::GetWebContents() const{
    return dummy_web_contents_.get();
  }

  void WebstoreInstallerForImporting::StartInstaller() {
    //install from webstore detail page
    
    //install from prompt
    BeginInstall();
  }


  bool WebstoreInstallerForImporting::CheckRequestorAlive() const{
    return true;
  }

  std::unique_ptr<ExtensionInstallPrompt::Prompt>
      WebstoreInstallerForImporting::CreateInstallPrompt() const {
    return nullptr;
  }
  std::unique_ptr<ExtensionInstallPrompt> WebstoreInstallerForImporting::CreateInstallUI(){
    // Create an ExtensionInstallPrompt. If the parent window is NULL, the dialog
    // will be placed in the middle of the screen.
    return std::make_unique<ExtensionInstallPrompt>(profile(), parent_window_);
  }
  bool WebstoreInstallerForImporting::ShouldShowPostInstallUI() const { 
    return false; 
  }

  void WebstoreInstallerForImporting::OnExtensionInstallSuccess(
      const std::string& id) {
    CompleteInstall(webstore_install::SUCCESS, std::string());
  }

  void WebstoreInstallerForImporting::OnExtensionInstallFailure(
      const std::string& id,
      const std::string& error,
      WebstoreInstaller::FailureReason reason) {

    webstore_install::Result install_result = webstore_install::OTHER_ERROR;
    switch (reason) {
      case WebstoreInstaller::FAILURE_REASON_CANCELLED:
        install_result = webstore_install::USER_CANCELLED;
        break;
      case WebstoreInstaller::FAILURE_REASON_DEPENDENCY_NOT_FOUND:
      case WebstoreInstaller::FAILURE_REASON_DEPENDENCY_NOT_SHARED_MODULE:
        install_result = webstore_install::MISSING_DEPENDENCIES;
        break;
      default:
        break;
    }

    CompleteInstall(install_result, error);
  }

  void WebstoreInstallerForImporting::OnInstallPromptDone(ExtensionInstallPrompt::DoneCallbackPayload payload) {
    if (payload.result == ExtensionInstallPrompt::Result::USER_CANCELED) {
        CompleteInstall(webstore_install::USER_CANCELLED,
                        webstore_install::kUserCancelledError);
        return;
      }

      if (payload.result == ExtensionInstallPrompt::Result::ABORTED ||
          !CheckRequestorAlive()) {
        CompleteInstall(webstore_install::ABORTED, std::string());
        return;
      }

      DCHECK(payload.result == ExtensionInstallPrompt::Result::ACCEPTED);

      std::unique_ptr<WebstoreInstaller::Approval> approval = CreateApproval();

      auto installer = base::MakeRefCounted<WebstoreInstaller>(
          profile(), 
          base::BindOnce(&WebstoreInstallerForImporting::OnExtensionInstallSuccess,
                     weak_ptr_factory_.GetWeakPtr()),
          base::BindOnce(&WebstoreInstallerForImporting::OnExtensionInstallFailure,
                     weak_ptr_factory_.GetWeakPtr()),
          GetWebContents(), id(), std::move(approval),
          install_source());
      installer->Start();
  }

}