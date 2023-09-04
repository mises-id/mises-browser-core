#ifndef MISES_IOS_CHROME_BROWSER_UI_TOOLBAR_BUTTONS_TOOLBAR_BUTTON_FACTORY_H_
#define MISES_IOS_CHROME_BROWSER_UI_TOOLBAR_BUTTONS_TOOLBAR_BUTTON_FACTORY_H_

#import <UIKit/UIKit.h>

#define ToolbarButtonFactory ToolbarButtonFactoryChromium
#include "src/ios/chrome/browser/ui/toolbar/buttons/toolbar_button_factory.h"
 
#undef ToolbarButtonFactory

@interface ToolbarButtonFactory : ToolbarButtonFactoryChromium

- (ToolbarButton*)misesButton;

- (ToolbarButton*)walletButton;

@end


#endif 

