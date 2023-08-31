#import "ios/chrome/browser/ui/popup_menu/popup_menu_coordinator.h"
#import "ios/chrome/browser/ui/commands/popup_menu_commands.h"
#import "ios/chrome/browser/ui/popup_menu/popup_menu_metrics_handler.h"
//#define PopupMenuCoordinator PopupMenuCoordinatorChromium

#define PopupMenuCommandTypeDefault \
  (type == PopupMenuTypeMisesMenu || type == PopupMenuTypeWalletMenu) ? PopupMenuCommandTypeToolsMenu:PopupMenuCommandTypeDefault

#define popupMenuTookAction showMisesMenuPopup{\
  [self presentPopupOfType:PopupMenuTypeMisesMenu\
      fromLayoutGuideNamed:kMisesButtonGuide];\
  } \
  - (void)showWalletMenuPopup {\
    [self presentPopupOfType:PopupMenuTypeWalletMenu\
      fromLayoutGuideNamed:kWalletButtonGuide];\
  }\
  - (void)popupMenuTookAction

#include "src/ios/chrome/browser/ui/popup_menu/popup_menu_coordinator.mm"

//#undef PopupMenuCoordinator

