
#import "mises/ios/third_party/mises/mises_web_client.h"

#import <UIKit/UIKit.h>

#import "ios/web/common/user_agent.h"
#import "ios/web/public/web_state.h"
#import "ui/base/resource/resource_bundle.h"

#import "mises_utils.h"

#if !defined(__has_feature) || !__has_feature(objc_arc)
#error "This file requires ARC support."
#endif

namespace web {


MisesWebClient::MisesWebClient() {

  NSString *filePath = [[NSBundle mainBundle] pathForResource:@"InpageBridgeWeb3" ofType:@"js"];  
  NSData *myData = [NSData dataWithContentsOfFile:filePath];  
  inpageScript = [ [ NSString alloc] initWithData:myData encoding: NSUTF8StringEncoding ];

  [Mises Init];
}

MisesWebClient::~MisesWebClient() {
}


NSString* MisesWebClient::GetDocumentStartScriptForAllFrames(
    BrowserState* browser_state) const {
  NSString* parent = ChromeWebClient::GetDocumentStartScriptForAllFrames(browser_state);
  NSMutableArray* scripts = [NSMutableArray array];
  [scripts addObject:parent];
  [scripts addObject:inpageScript];
  

  return [scripts componentsJoinedByString:@";"];
}


NSString* MisesWebClient::GetDocumentStartScriptForMainFrame(
    BrowserState* browser_state) const {
  NSString* parent = ChromeWebClient::GetDocumentStartScriptForMainFrame(browser_state);
  NSMutableArray* scripts = [NSMutableArray array];
  [scripts addObject:parent];

  NSString * MessageHandlerName = @"ReactNativeWebView";
  NSString * messageHandlerScript = [
      NSString
      stringWithFormat:
        @"window.%@ = {"
      "  postMessage: function (data) {"
      "    window.webkit.messageHandlers.%@.postMessage(String(data));"
      "  }"
      "};", MessageHandlerName, MessageHandlerName
    ];
  [scripts addObject:messageHandlerScript];
  

  return [scripts componentsJoinedByString:@";"];
}



}  // namespace web
