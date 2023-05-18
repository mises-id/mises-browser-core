#import "mises_lcd_service.h"


#include "base/logging.h"
#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import <Sdk/Sdk.h>

#if !defined(__has_feature) || !__has_feature(objc_arc)
#error "This file requires ARC support."
#endif



//
//@interface MisesLCDService: NSObject<LcdMLightNodeDelegator>
//@end
@implementation MisesLCDService
{
    NSThread *_lcdThread;
    int _retryCounter;
    
    NSString * _block_hash;
    int _block_height;
    NSString * _chain_id;
    NSString * _trust_nodes;
    NSString * _primary_node;
    id<LcdMLightNode> _node;
}

+ (instancetype)wrapper
{
    static MisesLCDService *sharedInstance = nil;
    @synchronized (self) {
        if (!sharedInstance) {
            sharedInstance = [[MisesLCDService alloc] init];
        }
    return sharedInstance;
    }
}

- (instancetype)init
{
    self = [super init];
    if (self) {
         _lcdThread = [[NSThread alloc] initWithTarget:self selector:@selector(lcdThreadEntryPoint:) object:nil];
        [_lcdThread start];
        _retryCounter = 0;

        [NSNotificationCenter.defaultCenter
        addObserver:self
            selector:@selector(applicationDidBecomeActive:)
                name:UIApplicationDidBecomeActiveNotification
            object:nil];
        
        [self delayedRun:0.5];
    }
    return self;
}

- (void)applicationDidBecomeActive:(NSNotification*)notification {
  [self delayedCheck];
}


- (void)lcdThreadEntryPoint:(id)__unused object {

    @autoreleasepool {

        [[NSThread currentThread] setName:@"MisesLCDService"];

        NSRunLoop *runLoop = [NSRunLoop currentRunLoop];

        [runLoop addPort:[NSMachPort port] forMode:NSDefaultRunLoopMode];

        [runLoop run];

    }
}

- (void) runService{
    if (![self fetchChainParams]) {
        _retryCounter += 1;
        [self retry];
        return;
    }
    
    NSError *error = nil;
    NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
    NSString *documentsDirectory = [paths objectAtIndex:0];
    LcdSetHomePath([documentsDirectory stringByAppendingString:@"/"], &error);
    if (![self checkError:error]) {
        return;
    };
    id<LcdMLightNode> node = LcdNewMLightNode();
    [node setChainID:_chain_id error: &error];
    if (![self checkError:error]) {
        return;
    };
    [node setEndpoints:_primary_node witnesses:_trust_nodes error: &error];
    if (![self checkError:error]) {
        return;
    };
    [node setTrust:[NSString stringWithFormat:@"%d",_block_height] hash:_block_hash error: &error];
    if (![self checkError:error]) {
        return;
    };
    [node serve: @"tcp://127.0.0.1:26657" delegator:id<LcdMLightNodeDelegator>(self) error: &error];
    if (![self checkError:error]) {
        return;
    };
    
    _node = node;

}
-(void) deleteTrustStore {
    NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
    NSString *documentsDirectory = [paths objectAtIndex:0];
    NSString *trustStoreDirectory = [documentsDirectory stringByAppendingString:@"/.misestm/light/light-client-db.db"];
    NSFileManager* file_manager = [[NSFileManager alloc] init];
    [file_manager removeItemAtPath:trustStoreDirectory error:nil];
}
-(void) onError :(NSString*) reason{
    NSLog(@"[MISES_LCD_SERVICE] onError %@", reason);
    _retryCounter += 1;
    if (reason != nil && [reason length] > 0) {
        [self performSelector:@selector(deleteTrustStore) onThread:_lcdThread withObject:nil waitUntilDone:NO];
    }
    [self retry];
}
-(BOOL) checkError:(NSError*) error {
    if (error != nil) {
        _retryCounter += 1;
        [self retry];
        return NO;
    }
    return YES;

}

- (BOOL) fetchChainParams {
    NSString * apiURLStr =[NSString stringWithFormat:@"https://api.alb.mises.site/api/v1/mises/chaininfo"];
    NSMutableURLRequest *dataRqst = [NSMutableURLRequest requestWithURL:[NSURL URLWithString:apiURLStr] cachePolicy:NSURLRequestUseProtocolCachePolicy timeoutInterval:30.0];
    NSHTTPURLResponse *response =[[NSHTTPURLResponse alloc] init];
    NSError* error = nil;
    NSData *responseData = [NSURLConnection sendSynchronousRequest:dataRqst returningResponse:&response error:&error];
    NSString *responseString = [[NSString alloc] initWithBytes:[responseData bytes] length:[responseData length] encoding:NSUTF8StringEncoding];
    NSLog(@"[MISES_LCD_SERVICE] fetchChainParams %@",responseString);
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
    
    id block_hash = data[@"block_hash"];
    if (![block_hash isKindOfClass:[NSString class]]) {

        return NO;
    }
    _block_hash = [block_hash copy];
    
    id block_height = data[@"block_height"];
    if (![block_height isKindOfClass:[NSNumber class]]) {

        return NO;
    }
    _block_height = [block_height intValue];
    
    id chain_id = data[@"chain_id"];
    if (![chain_id isKindOfClass:[NSString class]]) {

        return NO;
    }
    _chain_id = [chain_id copy];
    
    id trust_nodes = data[@"trust_nodes"];
    if (![trust_nodes isKindOfClass:[NSArray class]]) {

        return NO;
    }
    
    for (id trust_node in trust_nodes) {
        if ([trust_node isKindOfClass:[NSString class]]) {
            if (_trust_nodes == nil) {
                _trust_nodes = [trust_node copy];
            } else {
                _trust_nodes = [_trust_nodes stringByAppendingString:@","];
                _trust_nodes = [_trust_nodes stringByAppendingString:trust_node];
            }
            
        }
    }
    
    if ([trust_nodes count] > 0) {
        int n = arc4random_uniform([trust_nodes count]);
        _primary_node = trust_nodes[n];
    } else {
        return NO;
    }
    
    
    return YES;
}

- (void) retryService{
    int retryDelay = 30000;
    if (_retryCounter < 0) {
        retryDelay = 30000;
    } else if (_retryCounter < 6) {
        retryDelay = (int)(_retryCounter * _retryCounter * 30000);
    } else {
        retryDelay = 960000;
    }
    NSLog(@"[MISES_LCD_SERVICE] retryService after delay %d", retryDelay);
    [self delayedRun:retryDelay/1000];
}
- (void) retry{
    [self performSelector:@selector(retryService) onThread:_lcdThread withObject:nil waitUntilDone:NO];
}
- (void) doRun{
    [self performSelector:@selector(runService) onThread:_lcdThread withObject:nil waitUntilDone:NO];
}

- (void) delayedRun :(float) delay{
    [self performSelector:@selector(doRun) withObject:nil afterDelay:delay];
}

- (void) checkService{
    if (_node == nil) {
        return;
    }
    NSString * serviceURLStr =[NSString stringWithFormat:@"http://127.0.0.1:26657"];
    NSMutableURLRequest *dataRqst = [NSMutableURLRequest requestWithURL:[NSURL URLWithString:serviceURLStr] cachePolicy:NSURLRequestUseProtocolCachePolicy timeoutInterval:30.0];
    NSHTTPURLResponse *response =[[NSHTTPURLResponse alloc] init];
    NSError* error = nil;
    [NSURLConnection sendSynchronousRequest:dataRqst returningResponse:&response error:&error];
    
    if (error) {
        NSLog(@"[MISES_LCD_SERVICE] checkService fail %@",error);
        if (_node != nil) {
            [_node restart: &error];
        }
    } else {
        NSLog(@"[MISES_LCD_SERVICE] checkService ok");
    }
}

- (void) doCheck{
    [self performSelector:@selector(checkService) onThread:_lcdThread withObject:nil waitUntilDone:NO];
}
- (void) delayedCheck{
    [self performSelector:@selector(doCheck) withObject:nil afterDelay:5.0];
    
}
@end

