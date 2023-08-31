#import "ios/chrome/browser/ui/toolbar/buttons/toolbar_button_factory.h"
#define ToolbarButtonFactory ToolbarButtonFactoryChromium
#include "src/ios/chrome/browser/ui/toolbar/buttons/toolbar_button_factory.mm"
 
#undef ToolbarButtonFactory

@implementation ToolbarButtonFactory

- (ToolbarButton*)misesButton {
  ToolbarButton* misesButton = [ToolbarButton
      toolbarButtonWithImage:[[UIImage imageNamed:@"mises_user_default"] imageWithRenderingMode:UIImageRenderingModeAlwaysOriginal]];
  [self configureButton:misesButton width:kAdaptiveToolbarButtonWidth];
  [misesButton addTarget:self.actionHandler
                 action:@selector(misesMenuAction)
       forControlEvents:UIControlEventTouchUpInside];
  misesButton.visibilityMask =
      self.visibilityConfiguration.misesButtonVisibility;
    UIImageView *imageView = misesButton.imageView;
    [imageView.layer setCornerRadius:kAdaptiveToolbarIconSize/2];
    [imageView.layer setMasksToBounds:YES];
  misesButton.accessibilityIdentifier =
      kToolbarMisesButtonIdentifier;
  return misesButton;
}


- (ToolbarButton*)walletButton {
  ToolbarButton* walletButton = [ToolbarButton
      toolbarButtonWithImage:[[UIImage imageNamed:@"popup_menu_mises_wallet"] imageWithRenderingMode:UIImageRenderingModeAlwaysOriginal]];
  [self configureButton:walletButton width:kAdaptiveToolbarButtonWidth];
  [walletButton addTarget:self.actionHandler
                 action:@selector(walletMenuAction)
       forControlEvents:UIControlEventTouchUpInside];
  walletButton.visibilityMask =
      self.visibilityConfiguration.walletButtonVisibility;
  walletButton.accessibilityIdentifier =
      kToolbarWalletButtonIdentifier;
  return walletButton;
}

@end
