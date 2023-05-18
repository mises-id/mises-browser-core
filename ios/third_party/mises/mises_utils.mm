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

@interface RCTMisesModule : NSObject <RCTBridgeModule>
@end

@interface MetamaskUIViewController : UIViewController

@end


enum MetamaskUIPendingStatus {
  // No action should be done
  NONE = 0,
  POPUP,
  DISMISS
};

@interface ReactAppDelegate : UIResponder <RCTBridgeDelegate>
+ (instancetype)wrapper;
+ (UIViewController *)baseViewController;
- (void)show:(UIViewController*)basevc;
- (void)dismiss;

@property (nonatomic, strong) MetamaskUIViewController *rootViewController;

@property (nonatomic, strong) RCTBridge *bridge;

@property (nonatomic, strong) NSPointerArray *webViewArray;

@property(nonatomic, weak) id<BrowserCommands> browserHandler;

@property (atomic) MetamaskUIPendingStatus metamaskPendingStatus;

@end

@interface NSObject (PrivateMethods)
- (void)openSinglePage:(NSString*)url;
@end


@implementation MetamaskUIViewController

- (BOOL)isModal {
     if([self presentingViewController])
         return YES;

    return NO;
 }
- (void)viewDidAppear:(BOOL)animated {
  [super viewDidAppear:animated];
  dispatch_async(dispatch_get_main_queue(), ^{
      
      DLOG(WARNING) << "Popup Metamask complete";
      ReactAppDelegate* delegate = [ReactAppDelegate wrapper];
      if (delegate.metamaskPendingStatus == DISMISS) {
          [delegate dismiss];
      }

    [[Mises bridge] enqueueJSCall:@"NativeBridge.windowStatusChanged" args:@[@"show"]];
  });
}
- (void)viewDidDisappear:(BOOL)animated {
  [super viewDidDisappear:animated];
  dispatch_async(dispatch_get_main_queue(), ^{
      DLOG(WARNING) << "Dismiss Metamask complete";
      ReactAppDelegate* delegate = [ReactAppDelegate wrapper];
      if (delegate.metamaskPendingStatus == POPUP) {
          UIViewController* bvc = [ReactAppDelegate baseViewController];
          [delegate show:bvc];
      }
      

    [[Mises bridge] enqueueJSCall:@"NativeBridge.windowStatusChanged" args:@[@"hide"]];
  });
}
@end

@implementation ReactAppDelegate
+ (instancetype)wrapper
{  
    static ReactAppDelegate *sharedInstance = nil;
    @synchronized (self) {
        if (!sharedInstance) {
            sharedInstance = [[ReactAppDelegate alloc] init];
        }
    return sharedInstance;
    }
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
- (instancetype)init
{
    DLOG(WARNING) << "Mises init";
    self = [super init];
    if (self) {
        self.bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:NULL];
        RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:self.bridge
                                                   moduleName:@"MetaMask"
                                            initialProperties:@{@"foxCode": @"debug"}];
       //rootView.backgroundColor = [UIColor colorNamed:@"ThemeColors"];
       self.rootViewController = [MetamaskUIViewController new];
       self.rootViewController.view = rootView;
       self.webViewArray = [NSPointerArray weakObjectsPointerArray];
      DLOG(WARNING) << "Mises init step 4";
    }
    return self;
}
- (void)show:(UIViewController*)basevc {
  if ([self.rootViewController isModal] || !basevc) {
      self.metamaskPendingStatus = POPUP;
      return;
  };
  self.metamaskPendingStatus = NONE;
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
      self.metamaskPendingStatus = DISMISS;
      return;
  };
  self.metamaskPendingStatus = NONE;
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
    return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
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
      [ReactAppDelegate wrapper]; 
      [MisesLCDService wrapper];
      [MisesShareService wrapper];
      [MisesAccountService wrapper];
        
        
    });
     //
}
+ (void) dismissMetamask {
  DLOG(WARNING) << "Dismiss Metamask";
    ReactAppDelegate *delegate = [ReactAppDelegate wrapper];
    [NSObject cancelPreviousPerformRequestsWithTarget:delegate];
    [delegate performSelector:@selector(dismiss) withObject:nil afterDelay:0.1];
}
+ (void) popupMetamask {
    DLOG(WARNING) << "Popup Metamask";
    
    ReactAppDelegate *delegate = [ReactAppDelegate wrapper];
    [NSObject cancelPreviousPerformRequestsWithTarget:delegate];
    [delegate performSelector:@selector(popup) withObject:nil afterDelay:0.1];
    

     
}

+ (RCTBridge *) bridge {
  return [[ReactAppDelegate wrapper] bridge]; 
}


+ (NSUInteger) onWebViewActivated:(WKWebView *) wv {
    if ([[ReactAppDelegate wrapper] activate:wv]) {
       
    };
    NSUInteger wvid = [wv hash];
    //[[Mises bridge] enqueueJSCall:@"NativeBridge.activate" args:@[wv.URL.absoluteString, wvid];
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

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(dismiss)
{
    dispatch_async(dispatch_get_main_queue(), ^{
        
        [Mises dismissMetamask];
        
    });
    return nil;
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(popup)
{
    dispatch_async(dispatch_get_main_queue(), ^{
       [Mises popupMetamask];
        
    });
    return nil;
}
RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(postMessageFromRN:(NSString *) msg orgin:(NSString*)origin webviewID:(NSUInteger)webviewID)
{
    dispatch_async(dispatch_get_main_queue(), ^{

        DLOG(WARNING) << "postMessageFromRN " << msg;
        NSArray * allObjects = [[ReactAppDelegate wrapper].webViewArray allObjects];
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
        
      DLOG(WARNING) << "setMisesUserInfo " << jsonString;
      NSData *stringData = [jsonString dataUsingEncoding:NSUTF8StringEncoding];
      id json = [NSJSONSerialization JSONObjectWithData:stringData options:0 error:nil];

      if ([json isKindOfClass:[NSDictionary class]]) {
          [[Mises account] loadFrom:json save:YES];
      }
    });

    return nil;
}



RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(openUrl:(NSString *)url)
{
    dispatch_async(dispatch_get_main_queue(), ^{
        
        DLOG(WARNING) << "openUrl " << url;
        id handelr = [[ReactAppDelegate wrapper] browserHandler];
        if (handelr && [handelr respondsToSelector:@selector(openSinglePage:)]) {
            [handelr performSelector:@selector(openSinglePage:) withObject:url];
        }
        [[ReactAppDelegate wrapper] dismiss];
        
      
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
