#import "ReactAppDelegate.h"

#include "base/logging.h"
#include "base/command_line.h"
#include "base/strings/sys_string_conversions.h"


#import <WebKit/WKWebView.h>
#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>


@interface PendingMessage : NSObject


@property NSString *message;
@property NSUInteger wvid;
@end

@implementation PendingMessage
@end


@implementation ReactAppDelegate
{
  NSMutableArray *pendingMessages_;
}
+ (instancetype)getOrCreate: (MisesUIViewWalletType) walletType;
{  
    static NSMutableArray<ReactAppDelegate*> *sharedInstance = nil;
    @synchronized (self) {
      if (!sharedInstance) {
        sharedInstance = [NSMutableArray array];
      }
      for (ReactAppDelegate* object in sharedInstance) {
        if (object.walletType == walletType) {
          return object;
        }
      }
      ReactAppDelegate* walletDelegate = [[ReactAppDelegate alloc] init:walletType];
      [sharedInstance addObject:walletDelegate];
      return walletDelegate;
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
       pendingMessages_ = [NSMutableArray array];
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
      self.browserHandler = basevc;
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

- (void)addPendingMessage:(NSString *)message withWebViewID:(NSUInteger)wvid
{
  PendingMessage* msg = [[PendingMessage alloc] init];
  msg.message = message;
  msg.wvid = wvid;
  [pendingMessages_ addObject:msg];

}
- (void)onReady
{
  self.walletReady = true;
  for (PendingMessage* msg in pendingMessages_) {
      [self.bridge enqueueJSCall:@"NativeBridge.postMessage" args:@[msg.message, [NSNumber numberWithUnsignedInteger:msg.wvid]]];
  }
  [pendingMessages_ removeAllObjects];
}
@end