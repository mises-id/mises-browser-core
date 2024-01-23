#import "ios/chrome/browser/ui/toolbar/buttons/toolbar_button_visibility_configuration.h"

#define ToolbarButtonVisibilityConfiguration ToolbarButtonVisibilityConfigurationChromium
#include "src/ios/chrome/browser/ui/toolbar/buttons/toolbar_button_visibility_configuration.mm"
#undef ToolbarButtonVisibilityConfiguration


@implementation ToolbarButtonVisibilityConfiguration



- (ToolbarComponentVisibility)misesButtonVisibility {
  switch (self.type) {
    case ToolbarType::kPrimary:
      return ToolbarComponentVisibilityAlways &
             ~ToolbarComponentVisibilitySplit;
    case ToolbarType::kSecondary:
      return ToolbarComponentVisibilitySplit;
  }
}

- (ToolbarComponentVisibility)walletButtonVisibility {
  switch (self.type) {
    case ToolbarType::kPrimary:
      return ToolbarComponentVisibilityAlways &
             ~ToolbarComponentVisibilitySplit;
    case ToolbarType::kSecondary:
      return ToolbarComponentVisibilitySplit;
  }
}

@end