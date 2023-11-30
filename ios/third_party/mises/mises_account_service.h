#ifndef IOS_CHROME_APP_MISES_ACCOUNT_SERVICE_H_
#define IOS_CHROME_APP_MISES_ACCOUNT_SERVICE_H_

#import <UIKit/UIKit.h>

@protocol MisesAccountServiceDelegate
- (void)accountChanged;
@end


@interface MisesAccountService: NSObject


@property (nonatomic, strong) UIImage *cachedMisesAvatar;


- (void) setDelegate:(id<MisesAccountServiceDelegate>)delegate;


- (BOOL) isLogin;
- (NSString*) misesId;
- (NSString*) misesToken;
- (NSString*) misesNickname;
- (NSString*) misesAvatar;


- (NSDictionary*) referrer;
- (void) setReferrer:(NSDictionary*) ref;

- (void) loadFrom:(NSDictionary *) json save:(BOOL)save;

- (void) setMisesId:(NSString*)misesId withAuth:(NSString*) auth;

- (NSString*) toJson;
+ (instancetype)wrapper;

@end
#endif  // IOS_CHROME_APP_MISES_SHARE_SERVICE_H_

