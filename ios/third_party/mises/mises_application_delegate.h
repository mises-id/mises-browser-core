#ifndef MISES_IOS_CHROME_APP_MAIN_APPLICATION_DELEGATE_H_
#define MISES_IOS_CHROME_APP_MAIN_APPLICATION_DELEGATE_H_

#import <UIKit/UIKit.h>
#import "ios/chrome/app/main_application_delegate.h"
#import <React/RCTBridge.h>
#import <React/RCTBridgeDelegate.h>
#import <UIKit/UIKit.h>

// The main delegate of the application.
@interface MisesApplicationDelegate : MainApplicationDelegate

@property (nonatomic, strong) UIWindow *window;
@property (nonatomic, strong) RCTBridge *bridge;
@property (nonatomic, strong) NSString *moduleName;
@property (nonatomic, strong) NSDictionary *initialProps;


@end

#endif  // IOS_CHROME_APP_MAIN_APPLICATION_DELEGATE_H_