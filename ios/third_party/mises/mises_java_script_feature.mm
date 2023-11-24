#import "mises_java_script_feature.h"


#include "base/strings/sys_string_conversions.h"

#import "ios/web/js_messaging/web_view_js_utils.h"
#import "ios/web/js_messaging/web_view_web_state_map.h"
#include "ios/web/public/browser_state.h"
#import "ios/web/public/js_messaging/script_message.h"
#import "ios/web/public/navigation/navigation_manager.h"
#include "ios/web/public/web_state.h"


#include "mises_utils.h"
#import "ReactAppDelegate.h"
#import <React/RCTBridge.h>
#import <mises_wallet_framwork/mises_wallet_framwork-Swift.h>

#if !defined(__has_feature) || !__has_feature(objc_arc)
#error "This file requires ARC support."
#endif

namespace web {

namespace {

// Key for storing feature on the associated BrowserState.
const char kMisesJavaScriptFeatureKeyName[] =
    "mises_java_script_feature";

// Script message name for session restore.
NSString* const kMetamaskScriptHandlerName = @"RNMetaMaskWebView";
NSString* const kKeplrScriptHandlerName = @"RNKeplrWebView";

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
  metamask_handler_.reset();

  metamask_handler_ = std::make_unique<ScopedWKScriptMessageHandler>(
      user_content_controller, kMetamaskScriptHandlerName,
      base::BindRepeating(
          &MisesJavaScriptFeature::MetaMaskMessageReceived,
          weak_factory_.GetWeakPtr()));
    
  mises_wallet_handler_.reset();

  mises_wallet_handler_ = std::make_unique<ScopedWKScriptMessageHandler>(
      user_content_controller, [MisesWalletApi.shared ethereumProviderScriptHandlerName],
      WKContentWorld.pageWorld,
      base::BindRepeating(
          &MisesJavaScriptFeature::MisesWalletMessageReceived,
          weak_factory_.GetWeakPtr()));

  keplr_handler_.reset();

  keplr_handler_ = std::make_unique<ScopedWKScriptMessageHandler>(
      user_content_controller, kKeplrScriptHandlerName,
      base::BindRepeating(
          &MisesJavaScriptFeature::KeplrMessageReceived,
          weak_factory_.GetWeakPtr()));

}


void MisesJavaScriptFeature::MetaMaskMessageReceived(
    WKScriptMessage* message) {
  WebState* web_state = WebViewWebStateMap::FromBrowserState(browser_state_)
                            ->GetWebStateForWebView(message.webView);
  if (!web_state ) {
    return;
  }
  [Mises onWebViewActivatedMetamask:message.webView withMessage:message.body];
 

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

void MisesJavaScriptFeature::MisesWalletMessageReceived(
    WKScriptMessage* message, ScriptMessageReplyHandler reply_handler) {
       NSString* received =
           [NSString stringWithFormat:@"mises received: %@, %@",
             message.name, message.body];
    DLOG(WARNING) << base::SysNSStringToUTF16(received);
    UIViewController* bvc = [ReactAppDelegate baseViewController];
    [MisesWalletApi.shared activateBrowserViewController:bvc];
    [MisesWalletApi.shared activateWith:message replyHandler:^(id reply, NSString* error_message) {
        // Per the API documentation, specify the result as nil if an error
        // occurred.
        NSString* respond =
            [NSString stringWithFormat:@"mises respond: %@, %@",
             reply, error_message];
        DLOG(WARNING) << base::SysNSStringToUTF16(respond);
        if (error_message != nil) {
            
            reply_handler(nil, error_message);
        } else {
            auto value = web::ValueResultFromWKResult(reply);
            reply_handler(value.get(), nil);
        }
      }];
}



void MisesJavaScriptFeature::KeplrMessageReceived(
    WKScriptMessage* message) {
  WebState* web_state = WebViewWebStateMap::FromBrowserState(browser_state_)
                            ->GetWebStateForWebView(message.webView);
  if (!web_state ) {
    return;
  }
  [Mises onWebViewActivatedMisesWallet:message.webView withMessage:message.body];
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
