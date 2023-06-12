#ifndef IOS_CHROME_APP_MISES_UTILS_H_
#define IOS_CHROME_APP_MISES_UTILS_H_
#import <UIKit/UIKit.h>


#import "mises_account_service.h"

@class RCTBridge;
@class WKWebView;


@interface Mises: NSObject
+ (void) Init;
+ (void) popupMetamask;
+ (void) dismissMetamask;

+ (RCTBridge *) bridge;


+ (NSUInteger) onWebViewActivated:(WKWebView *) wv;

+ (MisesAccountService*) account;


+ (BOOL) handleUniversalLink:(NSURL*)webpageURL;
+ (BOOL) handleOpenUrl:(NSURL*)webpageURL;
+ (void) didFinishLaunching;
@end
#endif  // IOS_CHROME_APP_MISES_UTILS_H_
