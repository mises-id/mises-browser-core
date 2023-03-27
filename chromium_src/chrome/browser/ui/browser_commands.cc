#include "src/chrome/browser/ui/browser_commands.cc"
#if BUILDFLAG(IS_ANDROID)
namespace autofill {
  void ManageMigrationUiController::OnUserClickedCreditCardIcon() {
  }
  WEB_CONTENTS_USER_DATA_KEY_IMPL(ManageMigrationUiController);
}
WEB_CONTENTS_USER_DATA_KEY_IMPL(ManagePasswordsUIController);
#endif
