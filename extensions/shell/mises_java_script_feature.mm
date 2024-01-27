
#import "mises/ios/third_party/mises/mises_java_script_feature.h"
#include "base/strings/sys_string_conversions.h"

#import "ios/web/js_messaging/web_view_js_utils.h"
#import "ios/web/js_messaging/web_view_web_state_map.h"
#include "ios/web/public/browser_state.h"
#import "ios/web/public/js_messaging/script_message.h"
#import "ios/web/public/navigation/navigation_manager.h"
#include "ios/web/public/web_state.h"


namespace web {

// static
MisesJavaScriptFeature*
MisesJavaScriptFeature::FromBrowserState(BrowserState* browser_state) {

  return nullptr;
}

void MisesJavaScriptFeature::ConfigureHandlers(
    WKUserContentController* user_content_controller) {

}

}