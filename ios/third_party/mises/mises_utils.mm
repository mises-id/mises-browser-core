#import "mises_utils.h"
#include "base/logging.h"
#include "base/command_line.h"

#include "base/strings/sys_string_conversions.h"

#import "ios/web/js_messaging/web_view_js_utils.h"

#import <Foundation/NSPathUtilities.h>
#import <WebKit/WKWebView.h>


#import <Mixpanel/Mixpanel.h>

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

#import "mises_wallet-Swift.h"
//#import "mises_lcd_service.h"
#import "mises_share_service.h"
#import "mises_account_service.h"
#import "ReactAppDelegate.h"

#if !defined(__has_feature) || !__has_feature(objc_arc)
#error "This file requires ARC support."
#endif




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
        
    });
}

+ (void) popupWallet: (NSString *)name {
  DLOG(WARNING) << "popupWallet " << base::SysNSStringToUTF16(name);

  if ([name isEqualToString:WALLET_MISES]) {
    UIViewController* bvc = [ReactAppDelegate baseViewController];
    [bvc popupWallet];
      
    return;
  }

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
            NSString* firSettingDir = [cacheDirectory stringByAppendingPathComponent:@"com.crashlytics.data/site.mises.browser/v5/settings/"];
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





static NSString* urlEscapeString(NSString *unencodedString)
{
    CFStringRef originalStringRef = (__bridge_retained CFStringRef)unencodedString;
    NSString *s = (__bridge_transfer NSString *)CFURLCreateStringByAddingPercentEscapes(NULL,originalStringRef, NULL, (CFStringRef)@"!*'\"();:@&=+$,/?%#[]% ", kCFStringEncodingUTF8);
    CFRelease(originalStringRef);
    return s;
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
    dispatch_async(dispatch_get_main_queue(), ^{
        
      DLOG(WARNING) << "setMisesUserInfo " << base::SysNSStringToUTF16(jsonString);
      NSData *stringData = [jsonString dataUsingEncoding:NSUTF8StringEncoding];
      id json = [NSJSONSerialization JSONObjectWithData:stringData options:0 error:nil];

      if ([json isKindOfClass:[NSDictionary class]]) {
          [[Mises account] loadFrom:json save:YES];
      }
    });

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



@end
