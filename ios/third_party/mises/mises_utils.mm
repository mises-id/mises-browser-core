#import "mises_utils.h"
#include "base/logging.h"
#include "base/command_line.h"

#include "base/strings/sys_string_conversions.h"

#import "ios/web/js_messaging/web_view_js_utils.h"

#import <Foundation/NSPathUtilities.h>
#import <WebKit/WKWebView.h>


#import <Mixpanel/Mixpanel.h>

//#error "test"

#import <React/RCTBridgeDelegate.h>
#import <UIKit/UIKit.h>
#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <React/RCTPushNotificationManager.h>

#import <React/RCTLinkingManager.h>
#import <Bugsnag/Bugsnag.h>

#import <FirebaseCore/FirebaseCore.h>
#import <FirebaseDynamicLinks/FirebaseDynamicLinks.h>
#import <FirebaseAnalytics/FirebaseAnalytics.h>
#import <FBLPromises/FBLPromises.h>

#import <React/RCTBridgeModule.h>

#import "ios/chrome/browser/ui/commands/browser_commands.h"
#import "mises_lcd_service.h"
#import "mises_share_service.h"
#import "mises_account_service.h"

#if !defined(__has_feature) || !__has_feature(objc_arc)
#error "This file requires ARC support."
#endif


#define WALLET_METAMASK  @"metamask"
#define WALLET_MISES  @"mises-wallet"

@interface RCTMisesModule : NSObject <RCTBridgeModule>
@end


enum MisesUIViewWalletType {
  // No action should be done
  METAMASK,
  MISESWALLET
};

enum MisesUIViewPendingStatus {
  // No action should be done
  PENDING_NONE = 0,
  POPUP,
  DISMISS
};


@protocol MisesUIViewDelegate
- (void)show:(UIViewController*)basevc;
- (void)dismiss;
- (RCTBridge *)bridge;
- (MisesUIViewPendingStatus) pendingStatus;
- (BOOL) walletReady;
@end

@interface MisesUIViewController : UIViewController

@property(nonatomic, weak) id<MisesUIViewDelegate> delegate;

@end



@interface ReactAppDelegate : UIResponder <RCTBridgeDelegate, MisesUIViewDelegate>
+ (instancetype)getOrCreate: (MisesUIViewWalletType) walletType;
+ (UIViewController *)baseViewController;
- (void)show:(UIViewController*)basevc;
- (void)dismiss;

@property (nonatomic, strong) MisesUIViewController *rootViewController;

@property (nonatomic, strong) RCTBridge *bridge;

@property (nonatomic, strong) NSPointerArray *webViewArray;

@property(nonatomic, weak) id<BrowserCommands> browserHandler;

@property (atomic) MisesUIViewPendingStatus pendingStatus;
@property (atomic) MisesUIViewWalletType walletType;

@property (atomic) BOOL walletReady;

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

@implementation ReactAppDelegate
+ (instancetype)getOrCreate: (MisesUIViewWalletType) walletType;
{  
    static NSArray<ReactAppDelegate*> *sharedInstance = nil;
    @synchronized (self) {
        if (!sharedInstance) {
          ReactAppDelegate* metamask = [[ReactAppDelegate alloc] init:METAMASK];
          ReactAppDelegate* miseswallet = [[ReactAppDelegate alloc] init:MISESWALLET];
          sharedInstance = @[metamask, miseswallet];
        }
    }
    for (ReactAppDelegate* object in sharedInstance) {
      if (object.walletType == walletType) {
        return object;
      }
    }
    return nil;
}

+ (UIViewController *)baseViewController {
   UIWindow *keyWindow = [[UIApplication sharedApplication] keyWindow];
    UIViewController *basevc = keyWindow.rootViewController;
    if ([basevc respondsToSelector:@selector(childViewControllerForStatusBarStyle)]) {
        UIViewController* bvc = [basevc childViewControllerForStatusBarStyle];
        return bvc;
    }
    
    return NULL;
}

- (BOOL)concurrentRootEnabled
{
  return true;
}


/// This method controls whether the `concurrentRoot`feature of React18 is turned on or off.
///
/// @see: https://reactjs.org/blog/2022/03/29/react-v18.html
/// @note: This requires to be rendering on Fabric (i.e. on the New Architecture).
/// @return: `true` if the `concurrentRoot` feature is enabled. Otherwise, it returns `false`.


- (NSString *)walletTypeName: (MisesUIViewWalletType) walletType {
  if (walletType == METAMASK) {
    return WALLET_METAMASK;
  } else {
    return WALLET_MISES;
  }
}


- (instancetype)init: (MisesUIViewWalletType) walletType
{
    DLOG(WARNING) << "Mises init";
    self = [super init];
    if (self) {
        self.bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:NULL];
        RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:self.bridge
                                                   moduleName:[self walletTypeName:walletType]
                                            initialProperties:@{@"foxCode": @"debug"}];
       //rootView.backgroundColor = [UIColor colorNamed:@"ThemeColors"];
       self.rootViewController = [MisesUIViewController new];
       self.rootViewController.view = rootView;
       self.webViewArray = [NSPointerArray weakObjectsPointerArray];
       self.walletType = walletType;
      DLOG(WARNING) << "Mises init step 4";
    }
    self.rootViewController.delegate = self;
    return self;
}
- (void)show:(UIViewController*)basevc {
  if ([self.rootViewController isModal] || !basevc) {
      self.pendingStatus = POPUP;
      return;
  };
  self.pendingStatus = PENDING_NONE;
  if ([basevc
        respondsToSelector:NSSelectorFromString(@"openSinglePage:")]) {
      self.browserHandler = static_cast<UIViewController<BrowserCommands>*>(basevc);
  }
  [basevc presentViewController:self.rootViewController  animated:YES completion:^{
    
    
  }];
}
-(void) popup {
    UIViewController* bvc = [ReactAppDelegate baseViewController];
    [self show:bvc];
}


- (void)dismiss {
  if (![self.rootViewController isModal]) {
      self.pendingStatus = DISMISS;
      return;
  };
  self.pendingStatus = PENDING_NONE;
  self.browserHandler = nil;
  [self.rootViewController dismissViewControllerAnimated:YES  completion: ^{
   
  }];
}
- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  base::CommandLine* command_line = base::CommandLine::ForCurrentProcess();
  const std::string mises_dev_ip =
      command_line->GetSwitchValueASCII("mises-dev-ip");
  if (mises_dev_ip.size()) {
    [[RCTBundleURLProvider sharedSettings] setJsLocation:base::SysUTF8ToNSString(mises_dev_ip.c_str())];
    return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
  }

return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
}

- (BOOL)activate:(WKWebView *) wv
{
  [self.webViewArray compact];
    
  NSArray * allObjects = [self.webViewArray allObjects];
  NSUInteger count = [allObjects count];
  for (NSUInteger i = 0; i < count; i++) {
    __weak WKWebView *weakwv = [allObjects objectAtIndex: i];
    if (weakwv == wv) {
        return NO;
    }
  }

  [self.webViewArray  addPointer:(__bridge void *)wv];
    return YES;
}
@end



@implementation Mises

+ (void) Init{
    DLOG(WARNING) << "Init Metamask";
    dispatch_async(dispatch_get_main_queue(), ^{
      [MisesLCDService wrapper];
      [MisesShareService wrapper];
      [MisesAccountService wrapper];
        
        
    });
}

+ (void) popupWallet: (NSString *)name {
  DLOG(WARNING) << "popupWallet " << base::SysNSStringToUTF16(name);
  ReactAppDelegate *delegate = NULL;
  if ([name isEqualToString:WALLET_METAMASK]) {
    delegate = [ReactAppDelegate getOrCreate:METAMASK];
  }
  if ([name isEqualToString:WALLET_MISES]) {
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
    delegate.walletReady = true;
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


+ (RCTBridge *) bridgeMetamask {
   ReactAppDelegate *delegate = [ReactAppDelegate getOrCreate:METAMASK];
   if (!delegate.walletReady) {
    return nil;
   }
  return [delegate bridge]; 
}

+ (RCTBridge *) bridgeMisesWallet {
   ReactAppDelegate *delegate = [ReactAppDelegate getOrCreate:MISESWALLET];
   if (!delegate.walletReady) {
    return nil;
   }
  return [delegate bridge]; 
}

+ (NSUInteger) onWebViewActivatedMetamask:(WKWebView *) wv {
  ReactAppDelegate *delegate = [ReactAppDelegate getOrCreate:METAMASK];
  if ([delegate activate:wv]) {
  };
  NSUInteger wvid = [wv hash];
  return wvid;
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
//                NSURL *nsurl = wv.URL;
//                NSString* wv_origin = [NSString stringWithFormat:
//                                       @"%@://%@",nsurl.scheme, nsurl.host];
                if (webviewID != 0 && webviewID != [wv hash] ) {
                    continue;
                }
                NSString* method = [NSString stringWithFormat:@"(function(){try{window.postMessage( %@ , '%@');} catch (e) {}})()", msg, origin];
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
