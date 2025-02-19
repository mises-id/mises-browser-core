#include "mises/browser/extensions/mises_webstore_installer.h"
#include "content/shell/browser/shell.h"
#include "base/strings/utf_string_conversions.h"
#include "chrome/browser/extensions/extension_service.h"
#include "chrome/browser/extensions/install_tracker.h"
#include "extensions/browser/extension_registry.h"
#include "extensions/browser/extension_system.h"

#include "extensions/browser/extension_file_task_runner.h"

#include "chrome/grit/generated_resources.h"
#include "chrome/browser/extensions/webstore_installer.h"

namespace extensions {

namespace {
const std::string k_install_script = R"(
    // Create a mock for requestAnimationFrame
    window.requestAnimationFrame = function(callback) {
      console.log('requestAnimationFrame called');
      // Simulate the behavior by using setTimeout with a short delay (e.g., 0)
      return setTimeout(() => {
        callback(Date.now()); // Pass the current timestamp as an argument (like RAF would)
      }, 0); // Simulate immediate execution
    };

    // Create a mock for cancelAnimationFrame
    window.cancelAnimationFrame = function(id) {
      console.log('cancelAnimationFrame called with ID:', id);
      clearTimeout(id); // Cancel the timeout created in the mock of requestAnimationFrame
    };
    const interval = setInterval(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const targetButton = buttons.find(button => button.innerText.trim().toLowerCase() === 'add to chrome');

      if (targetButton && !targetButton.disabled) {
        targetButton.click();
        console.log('Button found and clicked!');
        clearInterval(interval);
      }
    }, 1000);
  )";
}

WebstoreInstallerHelper::WebstoreInstallerHelper(content::WebContents* contents): WebContentsObserver(contents),
      content::WebContentsUserData<WebstoreInstallerHelper>(
          *contents) {}

WebstoreInstallerHelper::~WebstoreInstallerHelper()  {

}
void WebstoreInstallerHelper::DidFinishNavigation(
      content::NavigationHandle* navigation_handle) {
  LOG(INFO) << "DidFinishNavigation";
  web_contents()->GetPrimaryMainFrame()->ExecuteJavaScript(
      base::UTF8ToUTF16(k_install_script), base::NullCallback());
}
WEB_CONTENTS_USER_DATA_KEY_IMPL(WebstoreInstallerHelper);

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

  }
  WebstoreInstallerForImporting::~WebstoreInstallerForImporting() = default;
  content::WebContents* WebstoreInstallerForImporting::GetWebContents() const{
    return dummy_web_contents_.get();
  }
  void WebstoreInstallerForImporting::StartInstaller() {
    //install from webstore detail page
    AddRef();

    GURL webstore_url("https://chromewebstore.google.com/detail/" + id());
    content::NavigationController::LoadURLParams load_params(webstore_url);
    dummy_web_contents_->GetController().LoadURLWithParams(load_params);
    WebstoreInstallerHelper::CreateForWebContents(dummy_web_contents_.get());

    SchedulesNextCheck();
  }
  void WebstoreInstallerForImporting::SchedulesNextCheck() {
    base::SequencedTaskRunner::GetCurrentDefault()->PostDelayedTask(
      FROM_HERE,
      base::BindOnce(
        &WebstoreInstallerForImporting::CheckWebStoreInstallStarted,
        weak_ptr_factory_.GetWeakPtr()),
      base::Seconds(30));
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
  void WebstoreInstallerForImporting::CheckWebStoreInstallStarted() {
    InstallTracker* tracker = InstallTracker::Get(profile());
    DCHECK(tracker);
    LOG(INFO) << "CheckWebStoreInstallStarted";
    bool is_installed =
        extensions::ExtensionRegistry::Get(profile())
            ->GetExtensionById(id(),
                              extensions::ExtensionRegistry::EVERYTHING) !=
        nullptr;
    if (is_installed) {
      LOG(INFO) << "Installed";
      CompleteInstall(webstore_install::SUCCESS, std::string());
      return;
    }
    if (tracker && tracker->GetActiveInstall(id())) {
       LOG(INFO) << "Installing";
      SchedulesNextCheck();
      return;
    }

    LOG(INFO) << "BeginInstall";
    BeginInstall();
    Release(); //Release the AddRef in StartInstaller

    return;
  }
}
