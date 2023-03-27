#include "build/build_config.h"
#if !BUILDFLAG(IS_ANDROID)
#include "src/chrome/browser/ui/extensions/extension_install_ui_default.cc"

#else

#include "chrome/browser/ui/extensions/extension_install_ui_default.h"
#include "chrome/browser/ui/browser.h"
#include "chrome/browser/ui/browser_finder.h"
#include "chrome/browser/profiles/profile.h"
#include "chrome/browser/ui/extensions/installation_error_infobar_delegate.h"
#include "components/infobars/content/content_infobar_manager.h"
#include "content/public/browser/browser_thread.h"
#include "content/public/browser/web_contents.h"
#include "extensions/common/extension.h"

using content::BrowserThread;
using content::WebContents;
using extensions::Extension;

ExtensionInstallUIDefault::ExtensionInstallUIDefault(
    content::BrowserContext* context)
    : profile_(Profile::FromBrowserContext(context)),
      skip_post_install_ui_(false),
      use_app_installed_bubble_(false) {}

ExtensionInstallUIDefault::~ExtensionInstallUIDefault() {}

void ExtensionInstallUIDefault::OnInstallSuccess(
    scoped_refptr<const extensions::Extension> extension,
    const SkBitmap* icon) {
}

void ExtensionInstallUIDefault::OnInstallFailure(
    const extensions::CrxInstallError& error) {
  DCHECK_CURRENTLY_ON(BrowserThread::UI);
  if (disable_ui_for_tests() || skip_post_install_ui_)
    return;

  Browser* browser = chrome::FindLastActiveWithProfile(profile_);
  if (!browser)  // Can be nullptr in unittests.
    return;
  WebContents* web_contents =
      browser->tab_strip_model()->GetActiveWebContents();
  if (!web_contents)
    return;
  InstallationErrorInfoBarDelegate::Create(
      infobars::ContentInfoBarManager::FromWebContents(web_contents), error);
}

void ExtensionInstallUIDefault::OpenAppInstalledUI(const std::string& app_id) {
  
}

void ExtensionInstallUIDefault::SetUseAppInstalledBubble(bool use_bubble) {
  use_app_installed_bubble_ = use_bubble;
}

void ExtensionInstallUIDefault::SetSkipPostInstallUI(bool skip_ui) {
  skip_post_install_ui_ = skip_ui;
}

gfx::NativeWindow ExtensionInstallUIDefault::GetDefaultInstallDialogParent() {
  Browser* browser = chrome::FindLastActiveWithProfile(profile_);
  if (browser) {
    content::WebContents* contents =
        browser->tab_strip_model()->GetActiveWebContents();
    return contents->GetTopLevelNativeWindow();
  }
  return nullptr;
}

#endif

