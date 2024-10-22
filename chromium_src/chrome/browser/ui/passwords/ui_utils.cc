#include "src/chrome/browser/ui/passwords/ui_utils.cc"
#if BUILDFLAG(IS_ANDROID)
#include "chrome/browser/ui/browser.h"
void NavigateToManagePasswordsPage(Browser* browser,
                                   ManagePasswordsReferrer referrer) {
  chrome::ShowPasswordManager(browser);
}

void NavigateToPasswordCheckupPage(Profile* profile) {
  NavigateParams params(profile, password_manager::GetPasswordCheckupURL(),
                        ui::PAGE_TRANSITION_LINK);
  params.disposition = WindowOpenDisposition::NEW_FOREGROUND_TAB;
  Navigate(&params);
}
#endif  // !BUILDFLAG(IS_ANDROID)
