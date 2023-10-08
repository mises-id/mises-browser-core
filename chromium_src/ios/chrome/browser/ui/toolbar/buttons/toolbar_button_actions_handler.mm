
#import "ios/chrome/browser/ui/toolbar/buttons/toolbar_button_actions_handler.h"
#define ToolbarButtonActionsHandler ToolbarButtonActionsHandlerChromium
#include "src/ios/chrome/browser/ui/toolbar/buttons/toolbar_button_actions_handler.mm"
#undef ToolbarButtonActionsHandler


@implementation ToolbarButtonActionsHandler 

- (void)misesMenuAction {
  [self.menuHandler showMisesMenuPopup];
}

- (void)walletMenuAction {
  [self.menuHandler showWalletMenuPopup];
}

@end