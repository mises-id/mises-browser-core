#import "mises_java_script_feature.h"


#include "base/strings/sys_string_conversions.h"

#import "ios/web/js_messaging/web_view_js_utils.h"
#import "ios/web/js_messaging/web_view_web_state_map.h"
#include "ios/web/public/browser_state.h"
#import "ios/web/public/js_messaging/script_message.h"
#import "ios/web/public/navigation/navigation_manager.h"
#include "ios/web/public/web_state.h"

#include "mises_utils.h"
#import <React/RCTBridge.h>

#if !defined(__has_feature) || !__has_feature(objc_arc)
#error "This file requires ARC support."
#endif

namespace web {

namespace {

// Key for storing feature on the associated BrowserState.
const char kMisesJavaScriptFeatureKeyName[] =
    "mises_java_script_feature";

// Script message name for session restore.
NSString* const kMisesScriptHandlerName = @"ReactNativeWebView";

}  // namespace

// static
MisesJavaScriptFeature*
MisesJavaScriptFeature::FromBrowserState(BrowserState* browser_state) {
  DCHECK(browser_state);

  MisesJavaScriptFeature* feature =
      static_cast<MisesJavaScriptFeature*>(
          browser_state->GetUserData(kMisesJavaScriptFeatureKeyName));
  if (!feature) {
    feature = new MisesJavaScriptFeature(browser_state);
    browser_state->SetUserData(kMisesJavaScriptFeatureKeyName,
                               base::WrapUnique(feature));
  }
  return feature;
}

MisesJavaScriptFeature::MisesJavaScriptFeature(
    BrowserState* browser_state)
    : JavaScriptFeature(
          ContentWorld::kPageContentWorld,
          {}),
      browser_state_(browser_state),
      weak_factory_(this) {}

MisesJavaScriptFeature::~MisesJavaScriptFeature() = default;

void MisesJavaScriptFeature::ConfigureHandlers(
    WKUserContentController* user_content_controller) {
  // Reset the old handler first as handlers with the same name can not be
  // added simultaneously.
  mises_handler_.reset();

  mises_handler_ = std::make_unique<ScopedWKScriptMessageHandler>(
      user_content_controller, kMisesScriptHandlerName,
      base::BindRepeating(
          &MisesJavaScriptFeature::MisesMessageReceived,
          weak_factory_.GetWeakPtr()));
}

void MisesJavaScriptFeature::MisesMessageReceived(
    WKScriptMessage* message) {
  WebState* web_state = WebViewWebStateMap::FromBrowserState(browser_state_)
                            ->GetWebStateForWebView(message.webView);
  if (!web_state ) {
    return;
  }
  NSUInteger wvid = [Mises onWebViewActivated:message.webView];
  [[Mises bridge] enqueueJSCall:@"NativeBridge.postMessage" args:@[message.body, [NSNumber numberWithUnsignedInteger:wvid]]];

//   NSString* method =
//       [NSString stringWithFormat:@"console.log(\"mises received: %@\", %@)",
//         message.name, message.body];
//     web::ExecuteJavaScript(message.webView, method, ^(id value, NSError* error) {
//       if (error) {
//         DLOG(WARNING) << "Script execution failed with error: "
//                       << base::SysNSStringToUTF16(
//                              error.userInfo[NSLocalizedDescriptionKey]);
//       }
//     });
}

}  // namespace web
