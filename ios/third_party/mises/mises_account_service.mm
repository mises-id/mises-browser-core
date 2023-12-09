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
    NSThread *_thread;
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
        _thread = [[NSThread alloc] initWithTarget:self selector:@selector(threadEntryPoint:) object:nil];
        [_thread start];
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
- (void)setMisesId:(NSString*)misesId withAuth:(NSString*) auth {
  if (misesId == NULL || misesId.length == 0) {
      _misesId = @"";
      _misesToken = @"";
      _misesNickname = @"";
      _misesAvatar = @"";
      [self onMisesIdUpdated];
      return;
  }
  _misesId = [misesId copy];
  [self updateFromServer:auth];
}
- (void) updateFromServer:(NSString*) auth {
  [self performSelector:@selector(runService:) onThread:_thread withObject:auth waitUntilDone:NO];
}


- (void)threadEntryPoint:(id)__unused object {

    @autoreleasepool {

        [[NSThread currentThread] setName:@"MisesAccountService"];

        NSRunLoop *runLoop = [NSRunLoop currentRunLoop];

        [runLoop addPort:[NSMachPort port] forMode:NSDefaultRunLoopMode];

        [runLoop run];

    }
}

- (void) onMisesIdUpdated {
    NSDictionary* json = @{
      @"misesId" : _misesId,
      @"token" : _misesToken,
      @"nickname" : _misesNickname,
      @"avatar" : _misesAvatar,
    };
    dispatch_async(dispatch_get_main_queue(), ^{
        
        [[NSUserDefaults standardUserDefaults] setObject:json forKey:kMisesInfoKey];
        if (self->_delegate) {
            [self->_delegate accountChanged];
        }
    });
}

- (void) runService: (id) object{
    BOOL ret = [self doUpdateFromServer:(NSString*)object];
    if (!ret) {
      return;
    }

    [self onMisesIdUpdated];
}


- (BOOL) doUpdateFromServer:(NSString*) auth{
    NSString * apiURLStr =[NSString stringWithFormat:@"https://api.alb.mises.site/api/v1/signin"];
    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:[NSURL URLWithString:apiURLStr] cachePolicy:NSURLRequestUseProtocolCachePolicy timeoutInterval:30.0];
    [request setValue:@"Keep-alive" forHTTPHeaderField:@"Connection"];
    [request setValue:@"UTF-8" forHTTPHeaderField:@"Charset"];
    [request setValue:@"application/json" forHTTPHeaderField:@"Content-Type"];
    [request setHTTPMethod:@"POST"];
    [request setValue:@"application/json" forHTTPHeaderField:@"Accept"];


    NSDictionary *authDict = @{
       @"auth" : auth
    };
    NSDictionary *jsonDict = @{
         @"user_authz" : authDict
    };

    NSError *error;
    NSData *jsonData = [NSJSONSerialization dataWithJSONObject:jsonDict options:0 error:&error];

    if (!jsonData) {
        NSLog(@"Got an error: %@", error);
        return NO;
    }
//    NSString *requestData = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
    [request setValue:[NSString stringWithFormat:@"%d", (int)[jsonData length]] forHTTPHeaderField:@"Content-Length"];
    [request setHTTPBody: jsonData];

    NSHTTPURLResponse *response =[[NSHTTPURLResponse alloc] init];
    NSData *responseData = [NSURLConnection sendSynchronousRequest:request returningResponse:&response error:&error];
    NSString *responseString = [[NSString alloc] initWithBytes:[responseData bytes] length:[responseData length] encoding:NSUTF8StringEncoding];
    NSLog(@"%@",responseString);
    NSData *stringData = [responseString dataUsingEncoding:NSUTF8StringEncoding];
    id json = [NSJSONSerialization JSONObjectWithData:stringData options:0 error:nil];

    if (![json isKindOfClass:[NSDictionary class]]) {

        return NO;
    }

    id code = json [@"code"];

    if (![code isKindOfClass:[NSNumber class]]) {

        return NO;
    }
    if ([code intValue] != 0) {
        return NO;
    }

    id data = json [@"data"];
    if (![data isKindOfClass:[NSDictionary class]]) {

        return NO;
    }
    
    id token = data[@"token"];
    if (![token isKindOfClass:[NSString class]]) {

        return NO;
    }
    _misesToken = [token copy];
    
    if (![self updateUserInfoFromServer]) {
      return NO;
    }
    return YES;
}
- (BOOL) updateUserInfoFromServer{
    NSString * apiURLStr =[NSString stringWithFormat:@"https://api.alb.mises.site/api/v1/user/me"];
    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:[NSURL URLWithString:apiURLStr] cachePolicy:NSURLRequestUseProtocolCachePolicy timeoutInterval:30.0];
    NSString *authValueToken = [@"Bearer " stringByAppendingString: _misesToken];
    [request setValue:authValueToken forHTTPHeaderField:@"Authorization"];
    [request setValue:@"Keep-alive" forHTTPHeaderField:@"Connection"];
    [request setValue:@"UTF-8" forHTTPHeaderField:@"Charset"];
    [request setValue:@"application/json" forHTTPHeaderField:@"Content-Type"];
    [request setHTTPMethod:@"GET"];
    [request setValue:@"application/json" forHTTPHeaderField:@"Accept"];

    NSError *error;
    NSHTTPURLResponse *response =[[NSHTTPURLResponse alloc] init];
    NSData *responseData = [NSURLConnection sendSynchronousRequest:request returningResponse:&response error:&error];
    NSString *responseString = [[NSString alloc] initWithBytes:[responseData bytes] length:[responseData length] encoding:NSUTF8StringEncoding];
    NSLog(@"%@",responseString);
    NSData *stringData = [responseString dataUsingEncoding:NSUTF8StringEncoding];
    id json = [NSJSONSerialization JSONObjectWithData:stringData options:0 error:nil];

    if (![json isKindOfClass:[NSDictionary class]]) {

        return NO;
    }

    id code = json [@"code"];

    if (![code isKindOfClass:[NSNumber class]]) {

        return NO;
    }
    if ([code intValue] != 0) {
        return NO;
    }

    id data = json [@"data"];
    if (![data isKindOfClass:[NSDictionary class]]) {

        return NO;
    }
    
    id username = data[@"username"];
    if (![username isKindOfClass:[NSString class]]) {

        return NO;
    }
    _misesNickname = [username copy];

    id avatar = data[@"avatar"];
    if (![avatar isKindOfClass:[NSDictionary class]]) {

        return NO;
    }
    id avatar_medium = avatar[@"medium"];
    _misesAvatar = [avatar_medium copy];
  
    return YES;
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
  id ref = [[NSUserDefaults standardUserDefaults] objectForKey:kMisesReferrerKey];
  if ([ref isKindOfClass:[NSDictionary class]]) {
      return ref;
  }
  return NULL;

}
- (void) setReferrer:(NSDictionary*) ref {
  [[NSUserDefaults standardUserDefaults] setObject:ref forKey:kMisesReferrerKey];
}

@end
