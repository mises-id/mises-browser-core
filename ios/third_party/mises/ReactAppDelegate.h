
#ifndef ReactAppDelegate_h
#define ReactAppDelegate_h

#import <React/RCTBridgeDelegate.h>
#import "ios/chrome/browser/ui/commands/browser_commands.h"

#define WALLET_METAMASK  @"metamask"
#define WALLET_MISES  @"mises-wallet"
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
- (BOOL) isModal;

@end


@class WKWebView;
@interface ReactAppDelegate : UIResponder <RCTBridgeDelegate, MisesUIViewDelegate>


@property (nonatomic, strong) MisesUIViewController *rootViewController;

@property (nonatomic, strong) RCTBridge *bridge;

@property (nonatomic, strong) NSPointerArray *webViewArray;

@property(nonatomic, weak) id<BrowserCommands> browserHandler;

@property (atomic) MisesUIViewPendingStatus pendingStatus;
@property (atomic) MisesUIViewWalletType walletType;
@property (atomic) BOOL walletReady;

+ (instancetype)getOrCreate: (MisesUIViewWalletType) walletType;
+ (UIViewController *)baseViewController;
- (void)show:(UIViewController*)basevc;
- (void)popup;
- (void)dismiss;
- (void)addPendingMessage:(NSString *)message withWebViewID:(NSUInteger)wvid;
- (BOOL)activate:(WKWebView *) wv;
- (void)onReady;

@end

#endif