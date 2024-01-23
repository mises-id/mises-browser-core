#import "ios/web/web_state/ui/wk_web_view_configuration_provider.h"

#import <Foundation/Foundation.h>
#import <WebKit/WebKit.h>
#import <vector>

#import "base/check.h"
#import "base/ios/ios_util.h"
#import "base/memory/ptr_util.h"
#import "base/notreached.h"
#import "base/strings/sys_string_conversions.h"
#import "components/safe_browsing/core/common/features.h"
#import "ios/web/common/features.h"
#import "ios/web/js_messaging/java_script_feature_manager.h"
#import "ios/web/js_messaging/java_script_feature_util_impl.h"
#import "ios/web/js_messaging/web_frames_manager_java_script_feature.h"
#import "ios/web/navigation/session_restore_java_script_feature.h"
#import "ios/web/public/browser_state.h"
#import "ios/web/public/web_client.h"
#import "ios/web/web_state/ui/wk_content_rule_list_provider.h"
#import "ios/web/web_state/ui/wk_web_view_configuration_provider_observer.h"
#import "ios/web/webui/crw_web_ui_scheme_handler.h"
#import "ios/web/js_messaging/page_script_util.h"
#import "mises/ios/third_party/mises/mises_java_script_feature.h"
#import "ios/web/public/browser_state.h"
#import "ios/web/public/web_client.h"
#import "base/files/file_path.h"
#import "base/files/file_util.h"

namespace web {

NSString* WebClient::GetDocumentStartScriptForAllFrames(
    BrowserState* browser_state) const {
  return @"";
}

NSString* WebClient::GetDocumentStartScriptForMainFrame(
    BrowserState* browser_state) const {
  return @"";
}

NSString* GetDocumentStartScriptForMainFrame(BrowserState* browser_state) {
  DCHECK(GetWebClient());
  NSString* embedder_page_script =
      GetWebClient()->GetDocumentStartScriptForMainFrame(browser_state);
  DCHECK(embedder_page_script);

  return MakeScriptInjectableOnce(@"start_main_frame", embedder_page_script);
}

NSString* GetDocumentStartScriptForAllFrames(BrowserState* browser_state) {
  DCHECK(GetWebClient());
  NSString* embedder_page_script =
      GetWebClient()->GetDocumentStartScriptForAllFrames(browser_state);
  DCHECK(embedder_page_script);
  return MakeScriptInjectableOnce(@"start_all_frames", embedder_page_script);
}

namespace {
  // Returns a WKUserScript for JavsScript injected into the main frame at the
// beginning of the document load.
WKUserScript* InternalGetDocumentStartScriptForMainFrame(
    BrowserState* browser_state) {
  return [[WKUserScript alloc]
        initWithSource:GetDocumentStartScriptForMainFrame(browser_state)
         injectionTime:WKUserScriptInjectionTimeAtDocumentStart
      forMainFrameOnly:YES];
}

// Returns a WKUserScript for JavsScript injected into all frames at the
// beginning of the document load.
WKUserScript* InternalGetDocumentStartScriptForAllFrames(
    BrowserState* browser_state) {
  return [[WKUserScript alloc]
        initWithSource:GetDocumentStartScriptForAllFrames(browser_state)
         injectionTime:WKUserScriptInjectionTimeAtDocumentStart
      forMainFrameOnly:NO];
}
}


}

#define MISES_WK_WEB_VIEW_CONFIGUTATION_PROVIDER_INSERT \
   MisesJavaScriptFeature::FromBrowserState(browser_state_) \
      ->ConfigureHandlers(user_content_controller);\
  [configuration_.userContentController \
      addUserScript:InternalGetDocumentStartScriptForAllFrames(browser_state_)]; \
  [configuration_.userContentController \
      addUserScript:InternalGetDocumentStartScriptForMainFrame(browser_state_)];
#include "src/ios/web/web_state/ui/wk_web_view_configuration_provider.mm"
