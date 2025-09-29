#import "mises_utils.h"
#include "base/logging.h"
#include "base/command_line.h"

#include "base/strings/sys_string_conversions.h"

#import "ios/web/js_messaging/web_view_js_utils.h"
#import "ios/web/public/web_client.h"
#import "ios/web/web_state/ui/wk_web_view_configuration_provider.h"
#import "ios/web/web_state/web_state_impl.h"
#include "ios/web/web_state/ui/crw_web_controller.h"

#include "ios/chrome/browser/shared/model/browser_state/chrome_browser_state.h"
#include "ios/chrome/browser/shared/model/browser_state/chrome_browser_state_manager.h"
#include "ios/chrome/browser/shared/model/application_context/application_context.h"

#include "ios/chrome/browser/shared/model/browser/browser.h"
#include "ios/chrome/browser/shared/model/browser/browser_list.h"
#include "ios/chrome/browser/shared/model/browser/browser_list_factory.h"
#import "ios/chrome/browser/shared/model/web_state_list/web_state_list.h"
#include "mises/ios/browser/brave_wallet/keyring_service_factory.h"
#include "mises/components/brave_wallet/browser/keyring_service.h"
#include "mises/components/brave_wallet/common/brave_wallet.mojom.h"

#import <Foundation/NSPathUtilities.h>
#import <WebKit/WKWebView.h>
#import <Mixpanel/Mixpanel.h>
#import <CoreFoundation/CoreFoundation.h>
#import "base/apple/foundation_util.h"
//#error "test"


#import <UIKit/UIKit.h>
#import <React/RCTRootView.h>
#import <React/RCTPushNotificationManager.h>

#import <React/RCTLinkingManager.h>
#import <Bugsnag/Bugsnag.h>

#import <FirebaseCore/FirebaseCore.h>
#import <FirebaseDynamicLinks/FirebaseDynamicLinks.h>
#import <FirebaseAnalytics/FirebaseAnalytics.h>
#import <FBLPromises/FBLPromises.h>

#import <React/RCTBridgeModule.h>

#include "mises/ios/buildflags.h"
#if !BUILDFLAG(MISES_CORE_FRAMEWORK)
#import <mises_wallet_framwork/mises_wallet_framwork-Swift.h>
#endif
//#import "mises_lcd_service.h"
#import "mises_share_service.h"
#import "mises_account_service.h"
#import "ReactAppDelegate.h"

#import <RNCAsyncStorage/RNCAsyncStorage.h>
#import <React/RCTBridgeModule.h>
#import "RCTPersistStore.h"

#if !defined(__has_feature) || !__has_feature(objc_arc)
#error "This file requires ARC support."
#endif



namespace mises {



WKWebView* activeWebview()
  {
      ios::ChromeBrowserStateManager* browserStateManager =
          GetApplicationContext()->GetChromeBrowserStateManager();
      ChromeBrowserState* chromeBrowserState =
          browserStateManager->GetLastUsedBrowserState();
      BrowserList *browserList = BrowserListFactory::GetForBrowserState(chromeBrowserState);
      Browser* active_browser = NULL;
      std::set<Browser*> browsers = browserList->AllRegularBrowsers();
      for (Browser* browser : browsers) {
          if (!browser->IsInactive()) {
              active_browser = browser;
              break;
          }
      }
      if (active_browser) {
        web::WebState* web_state = active_browser->GetWebStateList()->GetActiveWebState();
        if (web_state && !web_state->GetBrowserState()->IsOffTheRecord()) {
            CRWWebController* web_controller =
            web::WebStateImpl::FromWebState(web_state)->GetWebController();
            if (web_controller) {
              return [web_controller wkWebView];
            }

        }
      }

      return NULL;
  }

uint64_t activeWebviewId() {
    WKWebView* webview = activeWebview();
    if (webview) {
        return [webview hash];
    }
    return 0;
}

NSString* strToHex(NSString* str) {
    const char * bytes = [str cStringUsingEncoding:NSASCIIStringEncoding];
    if (bytes) {
      NSMutableString *hex = [NSMutableString new];
      for (NSUInteger i = 0; i < (NSUInteger)str.length; i++) {
          [hex appendFormat:@"%02x", bytes[i]];
      }
      return [hex copy];
    }
    return @"";
}


NSString* base64ToHex(NSString* base64_str) {
    NSData* data = [[NSData alloc]
        initWithBase64EncodedString:base64_str
                            options:NSDataBase64DecodingIgnoreUnknownCharacters];
    if (data) {
      const unsigned char *bytes = (const unsigned char *)data.bytes;
      NSMutableString *hex = [NSMutableString new];
      for (NSUInteger i = 0; i < (NSUInteger)data.length; i++) {
          [hex appendFormat:@"%02x", bytes[i]];
      }
      return [hex copy];
    }
    return @"";
}


namespace {

// Converts result of WKWebView script evaluation to base::Value, parsing
// `wk_result` up to a depth of `max_depth`.
std::unique_ptr<base::Value> ValueResultFromDic(id wk_result,
                                                     int max_depth) {
    if (!wk_result)
        return nullptr;
    
    std::unique_ptr<base::Value> result;
    
    if (max_depth < 0) {
        DLOG(WARNING) << "JS maximum recursion depth exceeded.";
        return result;
    }
    
    CFTypeID result_type = CFGetTypeID((__bridge CFTypeRef)wk_result);
    if (result_type == CFStringGetTypeID()) {
        result.reset(new base::Value(base::SysNSStringToUTF16(wk_result)));
        DCHECK(result->is_string());
    } else if (result_type == CFNumberGetTypeID()) {
        result.reset(new base::Value([wk_result intValue]));
        DCHECK(result->is_int());
    } else if (result_type == CFBooleanGetTypeID()) {
        result.reset(new base::Value(static_cast<bool>([wk_result boolValue])));
        DCHECK(result->is_bool());
    } else if (result_type == CFNullGetTypeID()) {
        result = std::make_unique<base::Value>();
        DCHECK(result->is_none());
    } else if (result_type == CFDictionaryGetTypeID()) {
        base::Value::Dict dictionary;
        for (id key in wk_result) {
            NSString* obj_c_string = base::apple::ObjCCast<NSString>(key);
            const std::string path = base::SysNSStringToUTF8(obj_c_string);
            std::unique_ptr<base::Value> value =
            ValueResultFromDic(wk_result[obj_c_string], max_depth - 1);
            if (value) {
                dictionary.SetByDottedPath(
                                           path, base::Value::FromUniquePtrValue(std::move(value)));
            }
        }
        result = std::make_unique<base::Value>(std::move(dictionary));
    } else if (result_type == CFArrayGetTypeID()) {
        base::Value::List list;
        for (id list_item in wk_result) {
            std::unique_ptr<base::Value> value =
            ValueResultFromDic(list_item, max_depth - 1);
            if (value) {
                list.Append(base::Value::FromUniquePtrValue(std::move(value)));
            }
        }
        result = std::make_unique<base::Value>(std::move(list));
    } else {
        NOTREACHED();  // Convert other types as needed.
    }
    return result;
}
}
void handleLegacyKeystore(NSString* jsonAsString) {

    ios::ChromeBrowserStateManager* browserStateManager =
        GetApplicationContext()->GetChromeBrowserStateManager();
    ChromeBrowserState* chromeBrowserState =
        browserStateManager->GetLastUsedBrowserState();
    auto* keyring_service =
        brave_wallet::KeyringServiceFactory::GetServiceForState(chromeBrowserState);
    if (!keyring_service) {
      return;
    }
    if (keyring_service->IsKeyringCreated(brave_wallet::mojom::kDefaultKeyringId)) {
      return;
    }
    
    NSData *jsonAsData = [jsonAsString dataUsingEncoding:NSUTF8StringEncoding];
    NSError *error;
    NSDictionary *json = [NSJSONSerialization
                          JSONObjectWithData:jsonAsData
                          options:NSJSONReadingMutableContainers
                          error:&error];
    if (error != NULL) {
        return;
    }
    NSString* iv = json[@"iv"];
    NSString* salt = strToHex(json[@"salt"]);
    NSString* ciphertext = base64ToHex(json[@"cipher"]);
    auto crypto_store = @[@{
        @"meta": @{
            @"name" : @"imported"
        },
        @"type": @"mnemonic",
        @"crypto": @ {
            @"cipher" : @"aes-128-cbc",
            @"cipherparams" : @{
                @"iv": iv
            },
            @"ciphertext": ciphertext,
            @"kdf": @"pbkdf2",
            @"kdfparams" : @{
                @"c": @5000,
                @"dklen": @32,
                @"prf": @"hmac-sha512",
                @"salt": salt,
            },
            @"mac": @""
        }
    }];

    auto value = ValueResultFromDic(crypto_store, 6);
    if (value && value->GetIfList()) {
        base::Value::List& list = *value->GetIfList();
        keyring_service->SetLegacyKeystore(list);
    }
}

void handleLegacyEngineStore(RCTPersistStore *storage, NSString* enginString) {
    if (![enginString containsString:@"\"mises\""]) {
        return;
    }
    RCTResponseSenderBlock rnCompletion = ^(NSArray *response) {
    };
    NSString *newEngineString = [enginString stringByReplacingOccurrencesOfString: @"\"mises\"" withString:@"\"mainnet\""];
    newEngineString = [newEngineString stringByReplacingOccurrencesOfString: @"\"46\"" withString:@"\"0x1\""];
    NSArray * dataToSave = @[@[@"engine", newEngineString]];
    dispatch_async(dispatch_get_main_queue(), ^{
        [storage performSelector:@selector(multiSet:callback:) withObject:dataToSave withObject:rnCompletion];
    });
}

void MaybeMigrateLegacyMisesWalletKeyring() {

  RCTPersistStore *storage = [[RCTPersistStore alloc] init];

  RCTResponseSenderBlock rnCompletion = ^(NSArray *response) {
      NSString *jsonAsString = @"";
      if (response.count > 1) {
        NSArray *response1 = response[1];
        if (response1.count > 0) {
          NSArray *response2 = response1[0];
          if (response2.count > 1) {
            jsonAsString = response2[1];
          }
        }
      }
      if (![jsonAsString isEqual: [NSNull null]] && [jsonAsString length] > 0) {
        NSData *jsonAsData = [jsonAsString dataUsingEncoding:NSUTF8StringEncoding];
        NSError *error;
        NSDictionary *json = [NSJSONSerialization
                              JSONObjectWithData:jsonAsData
                              options:NSJSONReadingMutableContainers
                              error:&error];
          if (error == NULL) {
              handleLegacyEngineStore(storage, jsonAsString);
              if (json[@"backgroundState"] &&
                  json[@"backgroundState"][@"KeyringController"] &&
                  json[@"backgroundState"][@"KeyringController"][@"vault"]) {
                  handleLegacyKeystore(json[@"backgroundState"][@"KeyringController"][@"vault"]);
              }
              
          }
        
      }
  };


  dispatch_async(dispatch_get_main_queue(), ^{
    [storage performSelector:@selector(multiGet:callback:) withObject:@[@"engine"] withObject:rnCompletion];
  });
}

}



@interface RCTMisesModule : NSObject <RCTBridgeModule>
@end

@interface NSObject (PrivateMethods)
- (void)openSinglePage:(NSString*)url;
@end


@implementation MisesUIViewController

- (BOOL)isModal {
     if([self presentingViewController])
         return YES;

    return NO;
 }
- (void)viewDidAppear:(BOOL)animated {
  [super viewDidAppear:animated];
  dispatch_async(dispatch_get_main_queue(), ^{
      
      DLOG(WARNING) << "Popup Metamask complete";
      if (self.delegate) {
        if ([self.delegate pendingStatus] == DISMISS) {
          [self.delegate dismiss];
        }
        if ([self.delegate walletReady]) {
          [[self.delegate bridge] enqueueJSCall:@"NativeBridge.windowStatusChanged" args:@[@"show"]];
        }
        
          
      }

    
  });
}
- (void)viewDidDisappear:(BOOL)animated {
  [super viewDidDisappear:animated];
  dispatch_async(dispatch_get_main_queue(), ^{
      DLOG(WARNING) << "Dismiss Metamask complete";
      if (self.delegate) {
        if ([self.delegate pendingStatus] == POPUP) {
          UIViewController* bvc = [ReactAppDelegate baseViewController];
          [self.delegate show:bvc];
        }
        if ([self.delegate walletReady]) {
          [[self.delegate bridge] enqueueJSCall:@"NativeBridge.windowStatusChanged" args:@[@"hide"]];
        }
      }

      

    
  });
}
@end


@implementation Mises

+ (void) Init{
    DLOG(WARNING) << "Init Metamask";
    dispatch_async(dispatch_get_main_queue(), ^{
      //[MisesLCDService wrapper];
      [MisesShareService wrapper];
      [MisesAccountService wrapper];
#if !BUILDFLAG(MISES_CORE_FRAMEWORK)
      MisesWalletApi * api = MisesWalletApi.shared;
      (void)api;
      mises::MaybeMigrateLegacyMisesWalletKeyring();
#endif
    });
}

+ (void) popupWallet: (NSString *)name {
  DLOG(WARNING) << "popupWallet " << base::SysNSStringToUTF16(name);
#if !BUILDFLAG(MISES_CORE_FRAMEWORK)
  if ([name isEqualToString:WALLET_MISES]) {
    UIViewController* bvc = [ReactAppDelegate baseViewController];
      WKWebView* webview = mises::activeWebview();
      if (webview) {
          [MisesWalletApi.shared presentWalletPanelFrom:bvc with:webview];
      } else {
          [MisesWalletApi.shared presentWalletFrom:bvc];
      }
    return;
  }
#endif

  ReactAppDelegate *delegate = NULL;
  if ([name isEqualToString:WALLET_METAMASK]) {
    delegate = [ReactAppDelegate getOrCreate:METAMASK];
  }
  if ([name isEqualToString:WALLET_KEPLR]) {
    delegate = [ReactAppDelegate getOrCreate:MISESWALLET];
  }
  
  
  if (delegate) {
    [NSObject cancelPreviousPerformRequestsWithTarget:delegate];
    [delegate performSelector:@selector(popup) withObject:nil afterDelay:0.1];
  }
}

+ (void) readyWallet: (NSString *)name {
  DLOG(WARNING) << "readyWallet " << base::SysNSStringToUTF16(name);
  ReactAppDelegate *delegate = NULL;
  if ([name isEqualToString:WALLET_METAMASK]) {
    delegate = [ReactAppDelegate getOrCreate:METAMASK];
  }
  if ([name isEqualToString:WALLET_MISES]) {
    delegate = [ReactAppDelegate getOrCreate:MISESWALLET];
  }
  if (delegate) {
    [delegate onReady];
  }
}

+ (void) dismissWallet: (NSString *)name {
  DLOG(WARNING) << "dismissWallet " << base::SysNSStringToUTF16(name);
  ReactAppDelegate *delegate = NULL;
  if ([name isEqualToString:WALLET_METAMASK]) {
    delegate = [ReactAppDelegate getOrCreate:METAMASK];
  }
  if ([name isEqualToString:WALLET_MISES]) {
    delegate = [ReactAppDelegate getOrCreate:MISESWALLET];
  }
  if (delegate) {
    [NSObject cancelPreviousPerformRequestsWithTarget:delegate];
    [delegate performSelector:@selector(dismiss) withObject:nil afterDelay:0.1];
  }
}

+ (void) popupMetamask {
  DLOG(WARNING) << "Popup Metamask";
  [self popupWallet:WALLET_METAMASK];   
}

+ (void) popupMisesWallet {
  DLOG(WARNING) << "Popup MisesWallet";
  [self popupWallet:WALLET_MISES];   
}

+ (void) popupKeplr {
  DLOG(WARNING) << "Popup Keplr";
  [self popupWallet:WALLET_KEPLR];
}


+ (void) onWebViewActivatedMetamask:(WKWebView *) wv withMessage:(NSString *)message{
  ReactAppDelegate *delegate = [ReactAppDelegate getOrCreate:METAMASK];
  if ([delegate activate:wv]) {
  };
  NSUInteger wvid = [wv hash];
  RCTBridge *bridge = [delegate bridge];
  if (!delegate.walletReady || !bridge) {
    [delegate addPendingMessage:message withWebViewID: wvid];
    return;
  }
  [bridge  enqueueJSCall:@"NativeBridge.postMessage" args:@[message, [NSNumber numberWithUnsignedInteger:wvid]]];
}

+ (void) onWebViewActivatedMisesWallet:(WKWebView *) wv withMessage:(NSString *)message {
  ReactAppDelegate *delegate = [ReactAppDelegate getOrCreate:MISESWALLET];
  if ([delegate activate:wv]) {
  };
  NSUInteger wvid = [wv hash];
  RCTBridge *bridge = [delegate bridge];
  if (!delegate.walletReady || !bridge) {
    [delegate addPendingMessage:message withWebViewID: wvid];
    return;
  }
  [bridge  enqueueJSCall:@"NativeBridge.postMessage" args:@[message, [NSNumber numberWithUnsignedInteger:wvid]]];
}



+ (MisesAccountService*) account {
  return [MisesAccountService wrapper];
}


+ (void) didFinishLaunching {
//    dispatch_queue_t queue = dispatch_get_global_queue(QOS_CLASS_DEFAULT, 0);
//    [FBLPromise onQueue:queue do: id  _Nullable (^)(){
//        
//    }];

    dispatch_async(dispatch_get_main_queue(), ^{
        NSArray *paths = NSSearchPathForDirectoriesInDomains( NSCachesDirectory,
                                                                 NSUserDomainMask, YES);
        NSString *cacheDirectory = [paths objectAtIndex:0];
        if (cacheDirectory) {
            NSString* firSettingDir = [cacheDirectory stringByAppendingPathComponent:@"com.crashlytics.data/site.mises.browser_stable/v5/settings/"];
            NSString* firSettingPath = [firSettingDir stringByAppendingPathComponent:@"settings.json"];
            NSFileManager *fileManager = [NSFileManager defaultManager];
            if (![fileManager fileExistsAtPath:firSettingPath]) {
                [fileManager createDirectoryAtPath:firSettingDir withIntermediateDirectories:YES attributes:nil error:nil];
                [fileManager createFileAtPath:firSettingPath
                                                contents:[NSData data]
                                                attributes:nil];
            }
            
        }
        
        [FIRApp configure];
        NSString *mixPanelTokenFromBundle = [[NSBundle mainBundle] objectForInfoDictionaryKey:@"mixpanel_token"];
        [Mixpanel sharedInstanceWithToken:mixPanelTokenFromBundle];
    });
    
//    //force crash
//    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(1.0 * NSEC_PER_SEC)),
//    dispatch_get_main_queue(), ^{
//        NSLog(@"%@", @[][1]);
//    });
}
+ (BOOL) handleUniversalLink:(NSURL*)webpageURL {
   BOOL handled = [[FIRDynamicLinks dynamicLinks] handleUniversalLink:webpageURL
                                                          completion:^(FIRDynamicLink * _Nullable dynamicLink,
                                                                       NSError * _Nullable error) {
                                                            // ...
                                                          }];
  return handled;
}
+ (BOOL) handleOpenUrl:(NSURL*)webpageURL {
  FIRDynamicLink *dynamicLink = [[FIRDynamicLinks dynamicLinks] dynamicLinkFromCustomSchemeURL:webpageURL];

  if (dynamicLink) {
    if (dynamicLink.url) {
      // Handle the deep link. For example, show the deep-linked content,
      // apply a promotional offer to the user's account or show customized onboarding view.
      // ...
        NSDictionary *ref = dynamicLink.utmParametersDictionary;
        if (ref) {
          [[Mises account] setReferrer:ref];
        }
    } else {
      // Dynamic link has empty deep link. This situation will happens if
      // Firebase Dynamic Links iOS SDK tried to retrieve pending dynamic link,
      // but pending link is not available for this device/App combination.
      // At this point you may display default onboarding view.
    }
    return YES;
  }
  return NO;
}
@end


namespace {
  NSString* urlEscapeString(NSString *unencodedString)
  {
      CFStringRef originalStringRef = (__bridge_retained CFStringRef)unencodedString;
      NSString *s = (__bridge_transfer NSString *)CFURLCreateStringByAddingPercentEscapes(NULL,originalStringRef, NULL, (CFStringRef)@"!*'\"();:@&=+$,/?%#[]% ", kCFStringEncodingUTF8);
      CFRelease(originalStringRef);
      return s;
  }
}




@implementation RCTMisesModule
// To export a module named RCTMisesModule
RCT_EXPORT_MODULE()

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(dismiss:(NSString*)walletTypeName)
{
    dispatch_async(dispatch_get_main_queue(), ^{
      [Mises dismissWallet:walletTypeName];
    });
    return nil;
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(popup:(NSString*)walletTypeName)
{
    dispatch_async(dispatch_get_main_queue(), ^{
      [Mises popupWallet:walletTypeName];

        
    });
    return nil;
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(ready:(NSString*)walletTypeName)
{
    dispatch_async(dispatch_get_main_queue(), ^{
      [Mises readyWallet:walletTypeName];

        
    });
    return nil;
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(postMessageFromMetamask:(NSString *) msg orgin:(NSString*)origin webviewID:(NSUInteger)webviewID)
{
    dispatch_async(dispatch_get_main_queue(), ^{

        DLOG(WARNING) << "postMessageFromMetamask " << base::SysNSStringToUTF16(msg);
        ReactAppDelegate *delegate = [ReactAppDelegate getOrCreate:METAMASK];
        NSArray * allObjects = [delegate.webViewArray allObjects];
        NSUInteger count = [allObjects count];
        for (NSUInteger i = 0; i < count; i++) {
            __weak WKWebView* weakwv = [allObjects objectAtIndex: i];
            if (weakwv) {
                __strong WKWebView* wv = weakwv;
                if (webviewID != 0 && webviewID != [wv hash] ) {
                    continue;
                }
                NSString* method = [NSString stringWithFormat:@"(function(){try{window.postMessage( %@ , '%@');} catch (e) {}})();true;", msg, origin];
                web::ExecuteJavaScript(wv, method, ^(id value, NSError* error) {
                    if (error) {
                      DLOG(WARNING) << "Script execution failed with error: "
                                    << base::SysNSStringToUTF16(
                                          error.userInfo[NSLocalizedDescriptionKey]);
                    }
                });
            }
        }
      
    });

    return nil;
}


RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(postMessageFromMisesWallet:(NSString *) msg orgin:(NSString*)origin webviewID:(NSUInteger)webviewID)
{
    dispatch_async(dispatch_get_main_queue(), ^{

        DLOG(WARNING) << "postMessageFromMisesWallet " << base::SysNSStringToUTF16(msg);
        ReactAppDelegate *delegate = [ReactAppDelegate getOrCreate:MISESWALLET];
        NSArray * allObjects = [delegate.webViewArray allObjects];
        NSUInteger count = [allObjects count];
        for (NSUInteger i = 0; i < count; i++) {
            __weak WKWebView* weakwv = [allObjects objectAtIndex: i];
            if (weakwv) {
                __strong WKWebView* wv = weakwv;
                if (webviewID != 0 && webviewID != [wv hash] ) {
                    continue;
                }
                NSString* method = [NSString stringWithFormat:@"(function(){try{window.postMessage( %@ , '%@');} catch (e) {}})();true;", msg, origin];
                web::ExecuteJavaScript(wv, method, ^(id value, NSError* error) {
                    if (error) {
                      DLOG(WARNING) << "Script execution failed with error: "
                                    << base::SysNSStringToUTF16(
                                          error.userInfo[NSLocalizedDescriptionKey]);
                    }
                });
            }
        }
      
    });

    return nil;
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(setMisesUserInfo:(NSString *)jsonString)
{
    //not handling old wallet
    // dispatch_async(dispatch_get_main_queue(), ^{
        
    //   DLOG(WARNING) << "setMisesUserInfo " << base::SysNSStringToUTF16(jsonString);
    //   NSData *stringData = [jsonString dataUsingEncoding:NSUTF8StringEncoding];
    //   id json = [NSJSONSerialization JSONObjectWithData:stringData options:0 error:nil];

    //   if ([json isKindOfClass:[NSDictionary class]]) {
    //       [[Mises account] loadFrom:json save:YES];
    //   }
    // });

    return nil;
}



RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(openUrlFromMetamsk:(NSString *)url)
{
    dispatch_async(dispatch_get_main_queue(), ^{
        
        DLOG(WARNING) << "openUrlFromMetamsk " << base::SysNSStringToUTF16(url);
        ReactAppDelegate *delegate = [ReactAppDelegate getOrCreate:METAMASK];
        id handelr = [delegate browserHandler];
        if (handelr && [handelr respondsToSelector:@selector(openSinglePage:)]) {
            [handelr performSelector:@selector(openSinglePage:) withObject:url];
        }
        [delegate dismiss];
        
      
    });

    return nil;
}


RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getInstallReferrer)
{
    
    NSDictionary * dic =  [[Mises account] referrer];
    if (!dic) {
      return nil;
    }
    NSMutableString *query = [[NSMutableString alloc] init];

    for (id key in dic) {
        NSString *keyString = [key description];
        NSString *valueString = [[dic objectForKey:key] description];

        if ([query length] == 0) {
            [query appendFormat:@"%@=%@", urlEscapeString(keyString), urlEscapeString(valueString)];
        } else {
            [query appendFormat:@"&%@=%@", urlEscapeString(keyString), urlEscapeString(valueString)];
        }
    }

    return query;
}


RCT_EXPORT_METHOD(isTabActive: (NSUInteger)webviewID
              isTabActive_resolver:(RCTPromiseResolveBlock)resolve
              isTabActive_rejecter:(RCTPromiseRejectBlock)reject) {
    dispatch_async(dispatch_get_main_queue(), ^{
        
        DLOG(WARNING) << "isTabActive " << webviewID;
        resolve([NSNumber numberWithBool:mises::activeWebviewId() == webviewID]);
      
    });
}


@end
