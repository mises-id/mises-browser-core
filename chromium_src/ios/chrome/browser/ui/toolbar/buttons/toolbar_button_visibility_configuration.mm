#import "ios/chrome/browser/ui/toolbar/buttons/toolbar_button_visibility_configuration.h"

#define ToolbarButtonVisibilityConfiguration ToolbarButtonVisibilityConfigurationChromium
#include "src/ios/chrome/browser/ui/toolbar/buttons/toolbar_button_visibility_configuration.mm"
#undef ToolbarButtonVisibilityConfiguration


@implementation ToolbarButtonVisibilityConfiguration


 - (ToolbarComponentVisibility)tabGridButtonVisibility {
   switch (self.type) {
     case PRIMARY:
      return ToolbarComponentVisibilityAlways;
     case SECONDARY:
      return ToolbarComponentVisibilityNone;
   }
 }
 
 - (ToolbarComponentVisibility)toolsMenuButtonVisibility {
   switch (self.type) {
     case PRIMARY:
      return ToolbarComponentVisibilityAlways;
     case SECONDARY:
      return ToolbarComponentVisibilityNone;
   }
 }


- (ToolbarComponentVisibility)misesButtonVisibility {
  switch (self.type) {
    case PRIMARY:
      return ToolbarComponentVisibilityAlways;
    case SECONDARY:
      return ToolbarComponentVisibilityNone;
  }
}

- (ToolbarComponentVisibility)walletButtonVisibility {
  switch (self.type) {
    case PRIMARY:
      return ToolbarComponentVisibilityAlways;
    case SECONDARY:
      return ToolbarComponentVisibilityNone;
  }
}

@end