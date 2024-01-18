
#ifndef MISES_IOS_CHROME_BROWSER_SHARED_PUBLIC_COMMANDS_POPUP_MENU_COMMANDS_H_
#define MISES_IOS_CHROME_BROWSER_SHARED_PUBLIC_COMMANDS_POPUP_MENU_COMMANDS_H_

#define showToolsMenuPopup showMisesMenuPopup;\
  - (void)showWalletMenuPopup;\
  - (void)showToolsMenuPopup
#include "src/ios/chrome/browser/shared/public/commands/popup_menu_commands.h"
#undef showToolsMenuPopup


#endif

