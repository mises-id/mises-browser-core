#import "ios/chrome/browser/ui/popup_menu/popup_menu_coordinator.h"
#import "ios/chrome/browser/shared/public/commands/popup_menu_commands.h"
#import "ios/chrome/browser/shared/ui/util/layout_guide_names.h"
#import "ios/chrome/browser/ui/popup_menu/public/popup_menu_consumer.h"


namespace {
  GuideName* misesToolsMenuGuide(int type) {
    if (type == POPUP_MENU_TYPE_MISES) {
      return kMisesButtonGuide;
    } else if (type == POPUP_MENU_TYPE_WALLET) {
      return kWalletButtonGuide;
    } else {
      return kToolsMenuGuide;
    }
  }
}


#define kToolsMenuGuide\
  misesToolsMenuGuide(self.viewController.menuType)

#define showToolsMenuPopup showMisesMenuPopup{\
  [self showMenuPopup:POPUP_MENU_TYPE_MISES];\
  } \
  - (void)showWalletMenuPopup {\
    [self showMenuPopup:POPUP_MENU_TYPE_WALLET];\
  }\
  - (void)showToolsMenuPopup {\
    [self showMenuPopup:POPUP_MENU_TYPE_TOOLS];\
  }\
  - (void)showMenuPopup:(int)type


#define MISES_POPUP_MENU_COORDINATOR_INSERT_TYPE \
  tableViewController.menuType = type;

#include "src/ios/chrome/browser/ui/popup_menu/popup_menu_coordinator.mm"

//#undef PopupMenuCoordinator

