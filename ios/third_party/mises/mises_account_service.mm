#import "mises_account_service.h"


#include "base/logging.h"
#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

#if !defined(__has_feature) || !__has_feature(objc_arc)
#error "This file requires ARC support."
#endif




NSString* const kMisesInfoKey = @"NSDefaultsMisesInfo";

NSString* const kMisesReferrerKey = @"NSDefaultsReferrer";

@implementation MisesAccountService
{
    int _retryCounter;
    __weak id<MisesAccountServiceDelegate> _delegate;


    NSString* _misesId;
    NSString* _misesToken;
    NSString* _misesNickname;
    NSString* _misesAvatar;
}

+ (instancetype)wrapper
{  
    static MisesAccountService *sharedInstance = nil;
    @synchronized (self) {
        if (!sharedInstance) {
            sharedInstance = [[MisesAccountService alloc] init];
        }
    return sharedInstance;
    }
}

- (instancetype)init
{
    DLOG(WARNING) << "MisesAccountService init";
    self = [super init];
    if (self) {
        _misesId = @"";
        _misesToken = @"";
        _misesNickname = @"";
        _misesAvatar = @"";

        id json = [[NSUserDefaults standardUserDefaults] objectForKey:kMisesInfoKey];
        if ([json isKindOfClass:[NSDictionary class]]) {
            [self loadFrom:json save:NO];
        }
    }
    return self;
}



- (BOOL) isLogin {
  return _misesToken != nil && [_misesToken length] > 0;
}
- (NSString*) misesId {
  return [_misesId copy];

}
- (NSString*) misesToken{
  return [_misesToken copy];

}
- (NSString*) misesNickname{
  return [_misesNickname copy];

}
- (NSString*) misesAvatar{
  return [_misesAvatar copy];
}

- (void) setDelegate:(id<MisesAccountServiceDelegate>)delegate {
  _delegate = delegate;
}


- (void) loadFrom:(NSDictionary *) json save:(BOOL)save{
    if (!json) {
        return;
    }
    id misesId = json[@"misesId"];
    if ([misesId isKindOfClass:[NSString class]]) {
      _misesId = [misesId copy];
    }
    id token = json[@"token"];
    if ([token isKindOfClass:[NSString class]]) {
      _misesToken = [token copy];
    }
    id nickname = json[@"nickname"];
    if ([nickname isKindOfClass:[NSString class]]) {
      _misesNickname = [nickname copy];
    }
    id avatar = json[@"avatar"];
    if ([avatar isKindOfClass:[NSString class]]) {
      _misesAvatar = [avatar copy];
    } else {
      _misesAvatar = @"";
    }

    if (save) {

        if (_delegate) {
            [_delegate accountChanged];
        }
        [[NSUserDefaults standardUserDefaults] setObject:json forKey:kMisesInfoKey];
    }
}

- (NSString*) toJson{
  NSDictionary* json = @{
        @"misesId" : _misesId,
        @"token" : _misesToken,
        @"nickname" : _misesNickname,
        @"avatar" : _misesAvatar,
      };
  NSError *error; 
  NSData *jsonData = [NSJSONSerialization dataWithJSONObject:json
                                                    options:NSJSONWritingSortedKeys // Pass 0 if you don't care about the readability of the generated string
                                                      error:&error];

  if (! jsonData) {
    return NULL;
  } else {
    NSString *jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
    return jsonString;
  }
   
}


- (NSDictionary*) referrer {
  id ref = [[NSUserDefaults standardUserDefaults] boolForKey:kMisesReferrerKey];
  if ([ref isKindOfClass:[NSDictionary class]]) {
      return ref;
  }
  return NULL;

}
- (void) setReferrer:(NSDictionary*) ref {
  [[NSUserDefaults standardUserDefaults] setObject:ref forKey:kMisesReferrerKey];
}

@end
