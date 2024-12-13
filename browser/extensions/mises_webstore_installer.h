#ifndef MISES_BROWSER_EXTENSIONS_MISES_WEBSTORE_INSTALLER_H_
#define MISES_BROWSER_EXTENSIONS_MISES_WEBSTORE_INSTALLER_H_


#include "content/public/browser/web_contents_observer.h"
#include "content/public/browser/web_contents_user_data.h"
#include "content/public/browser/web_contents.h"
#include "chrome/browser/extensions/webstore_install_with_prompt.h"
#include "chrome/common/extensions/webstore_install_result.h"
namespace extensions {

class WebstoreInstallerHelper
    : public content::WebContentsObserver,
      public content::WebContentsUserData<WebstoreInstallerHelper> {
 public:
  explicit WebstoreInstallerHelper(content::WebContents* contents);
  WebstoreInstallerHelper(const WebstoreInstallerHelper&) =
      delete;
  WebstoreInstallerHelper& operator=(
      const WebstoreInstallerHelper&) = delete;
  ~WebstoreInstallerHelper() override;

  // content::WebContentsObserver overrides:
  void DidFinishNavigation(
      content::NavigationHandle* navigation_handle) override;

  WEB_CONTENTS_USER_DATA_KEY_DECL();
};

// Silent installer via websotre w/o any prompt or bubble.
class WebstoreInstallerForImporting
    : public WebstoreStandaloneInstaller  {
 public:
  WebstoreInstallerForImporting(
      const std::string& webstore_item_id,
      Profile* profile,
      Callback callback);
  content::WebContents* GetWebContents() const override;
  void StartInstaller();
protected:
  friend class base::RefCountedThreadSafe<WebstoreInstallerForImporting>;
  ~WebstoreInstallerForImporting() override;
  bool CheckRequestorAlive() const override;
  std::unique_ptr<ExtensionInstallPrompt::Prompt>
      CreateInstallPrompt() const override;
  std::unique_ptr<ExtensionInstallPrompt> CreateInstallUI() override;
  bool ShouldShowPostInstallUI() const override;
  void OnExtensionInstallSuccess(
      const std::string& id);
  void OnExtensionInstallFailure(
      const std::string& id,
      const std::string& error,
      WebstoreInstaller::FailureReason reason);
  void OnInstallPromptDone(ExtensionInstallPrompt::DoneCallbackPayload payload) override;
private:
  void SchedulesNextCheck();
  void CheckWebStoreInstallStarted();
  std::unique_ptr<content::WebContents> dummy_web_contents_;
  gfx::NativeWindow parent_window_;
  base::WeakPtrFactory<WebstoreInstallerForImporting> weak_ptr_factory_{this};
};
}
#endif