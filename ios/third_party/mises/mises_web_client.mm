
#import "mises/ios/third_party/mises/mises_web_client.h"

#import <UIKit/UIKit.h>

#import "ios/web/common/user_agent.h"
#import "ios/web/public/web_state.h"
#import "ui/base/resource/resource_bundle.h"

#import "mises_utils.h"
#import <mises_wallet_framwork/mises_wallet_framwork-Swift.h>

#if !defined(__has_feature) || !__has_feature(objc_arc)
#error "This file requires ARC support."
#endif

namespace web {

NSString* GetInpageScript(NSString* resourceName) {
  NSString *filePath = [[NSBundle mainBundle] pathForResource:resourceName ofType:@"js"];  
  NSData *myData = [NSData dataWithContentsOfFile:filePath];  
  return[ [ NSString alloc] initWithData:myData encoding: NSUTF8StringEncoding ];

}

MisesWebClient::MisesWebClient() {
  inpageScripts = @[
    GetInpageScript(@"InpageBridgeWeb3"), 
    GetInpageScript(@"injected-provider.bundle"),
    GetInpageScript(@"__firefox__")
  ];

  [Mises Init];
}

MisesWebClient::~MisesWebClient() {
}


NSString* MisesWebClient::GetDocumentStartScriptForAllFrames(
    BrowserState* browser_state) const {
  NSString* parent = ChromeWebClient::GetDocumentStartScriptForAllFrames(browser_state);
  NSMutableArray* scripts = [NSMutableArray array];
  [scripts addObject:parent];

  NSUInteger count = [inpageScripts count];
  for (NSUInteger i = 0; i < count; i++) {
    [scripts addObject:inpageScripts[i]];
  }
  return [scripts componentsJoinedByString:@";"];
}

NSString* GenMessageHandlerScript(NSString* handlerName) {
  NSString * messageHandlerScriptTemplate = @"window.%@ = {"
      "  postMessage: function (data) {"
      "    window.webkit.messageHandlers.%@.postMessage(String(data));"
      "  }"
      "};";
  return [
      NSString
      stringWithFormat: messageHandlerScriptTemplate
        , handlerName, handlerName
    ];
}

NSString* MisesWebClient::GetDocumentStartScriptForMainFrame(
    BrowserState* browser_state) const {
  NSString* parent = ChromeWebClient::GetDocumentStartScriptForMainFrame(browser_state);
  NSMutableArray* scripts = [NSMutableArray array];
  [scripts addObject:parent];

  [scripts addObject:GenMessageHandlerScript(@"RNMetaMaskWebView")];
  
  [scripts addObject:GenMessageHandlerScript(@"RNKeplrWebView")];

  [scripts addObject:[MisesWalletApi.shared ethereumProviderScript]];

  return [scripts componentsJoinedByString:@";"];
}



}  // namespace web
