#ifndef IOS_CHROME_APP_MISES_UTILS_H_
#define IOS_CHROME_APP_MISES_UTILS_H_
#import <UIKit/UIKit.h>


#import "mises_account_service.h"

@class RCTBridge;
@class WKWebView;


@interface Mises: NSObject
+ (void) Init;
+ (void) popupMetamask;

+ (void) popupMisesWallet;

+ (void) popupWallet: (NSString *)name;


+ (void) onWebViewActivatedMetamask:(WKWebView *) wv withMessage:(NSString *)message;
+ (void) onWebViewActivatedMisesWallet:(WKWebView *) wv withMessage:(NSString *)message;

+ (MisesAccountService*) account;


+ (BOOL) handleUniversalLink:(NSURL*)webpageURL;
+ (BOOL) handleOpenUrl:(NSURL*)webpageURL;
+ (void) didFinishLaunching;
@end
#endif  // IOS_CHROME_APP_MISES_UTILS_H_
