
#ifndef MISES_IOS_CHROME_BROWSER_UI_TOOLBAR_BUTTONS_TOOLBAR_BUTTON_ACTIONS_HANDLER_H_
#define MISES_IOS_CHROME_BROWSER_UI_TOOLBAR_BUTTONS_TOOLBAR_BUTTON_ACTIONS_HANDLER_H_

#define ToolbarButtonActionsHandler ToolbarButtonActionsHandlerChromium
#include "src/ios/chrome/browser/ui/toolbar/buttons/toolbar_button_actions_handler.h"

#undef ToolbarButtonActionsHandler


@interface ToolbarButtonActionsHandler : ToolbarButtonActionsHandlerChromium

- (void)misesMenuAction;
- (void)walletMenuAction;

@end

#endif
