#ifndef MISES_BROWSER_EXTENSIONS_MISES_WEBSTORE_INSTALLER_H_
#define MISES_BROWSER_EXTENSIONS_MISES_WEBSTORE_INSTALLER_H_

#include "chrome/browser/extensions/webstore_install_with_prompt.h"
#include "chrome/common/extensions/webstore_install_result.h"
#include "extensions/browser/extension_file_task_runner.h"
#include "content/public/browser/web_contents.h"
#include "ui/base/l10n/l10n_util.h"
#include "chrome/grit/generated_resources.h"
#include "chrome/browser/extensions/webstore_installer.h"
#include "chrome/browser/extensions/updater/extension_updater.h"

namespace extensions {


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
  std::unique_ptr<content::WebContents> dummy_web_contents_;
  gfx::NativeWindow parent_window_;
  base::WeakPtrFactory<WebstoreInstallerForImporting> weak_ptr_factory_{this};
};



}

#endif