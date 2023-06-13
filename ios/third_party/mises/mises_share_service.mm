#import "mises_share_service.h"


#include "base/logging.h"
#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

#import "mises_utils.h"

#if !defined(__has_feature) || !__has_feature(objc_arc)
#error "This file requires ARC support."
#endif




@implementation MisesShareItem
- (id) initWithUrl:(NSString*) url title:(NSString*) title message:(NSString*) msg image:(UIImage *) image {
    self = [super init];
    if (self) {
        if (url) {
            self.url = url;
        } else {
            self.url  = @"";
        }
        if (title) {
            self.title = title;
        } else {
            self.title  = @"";
        }
        if (msg) {
            self.message = msg;
        } else {
            self.message  = @"";
        }
         self.image = image;
    }
    return self;
}
@end

@implementation MisesShareService
{
    NSThread *_thread;
    int _retryCounter;
    __weak id<MisesShareServiceDelegate> _delegate;
}

+ (instancetype)wrapper
{  
    static MisesShareService *sharedInstance = nil;
    @synchronized (self) {
        if (!sharedInstance) {
            sharedInstance = [[MisesShareService alloc] init];
        }
    return sharedInstance;
    }
}

- (instancetype)init
{
    DLOG(WARNING) << "MisesShareService init";
    self = [super init];
    if (self) {
         _thread = [[NSThread alloc] initWithTarget:self selector:@selector(threadEntryPoint:) object:nil];
        [_thread start];
        _retryCounter = 0;
    }
    return self;
}


- (void)threadEntryPoint:(id)__unused object {

    @autoreleasepool {

        [[NSThread currentThread] setName:@"MisesShareService"];

        NSRunLoop *runLoop = [NSRunLoop currentRunLoop];

        [runLoop addPort:[NSMachPort port] forMode:NSDefaultRunLoopMode];

        [runLoop run];

    }
}

- (void) runService: (id) object{
    BOOL ret = [self doShare:(MisesShareItem*)object];
    dispatch_async(dispatch_get_main_queue(), ^{
        if (self->_delegate) {
            [self->_delegate shareFinish:ret];
        }
    });
}


- (NSString*) uploadImage: (UIImage*) image{
    NSData *imageData = UIImageJPEGRepresentation(image, .9);


    NSURL *url = [NSURL URLWithString:@"https://api.alb.mises.site/api/v1/upload"];
    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:url];
    [request setHTTPMethod:@"POST"];
    NSString *authValueToken = [@"Bearer " stringByAppendingString:[[Mises account] misesToken]];
    [request setValue:authValueToken forHTTPHeaderField:@"Authorization"];
    [request setValue:@"Keep-alive" forHTTPHeaderField:@"Connection"];
    [request setValue:@"UTF-8" forHTTPHeaderField:@"Charset"];
    [request setValue:@"Mises Browser iOS" forHTTPHeaderField:@"User-Agent"];
    NSMutableData *body = [NSMutableData data];

    NSString *boundary = [NSString stringWithFormat:@"---------------------------%d", arc4random()] ;
    NSString *contentType = [NSString stringWithFormat:@"multipart/form-data; boundary=%@", boundary];
    [request addValue:contentType forHTTPHeaderField:@"Content-Type"];

    
    [body appendData:[[NSString stringWithFormat:@"--%@\r\n", boundary] dataUsingEncoding:NSUTF8StringEncoding]];
    [body appendData:[@"Content-Disposition: form-data; name=\"file_type\"\r\n\r\nimage\r\n" dataUsingEncoding:NSUTF8StringEncoding]];
    [body appendData:[[NSString stringWithFormat:@"--%@\r\n", boundary] dataUsingEncoding:NSUTF8StringEncoding]];
    [body appendData:[[NSString stringWithFormat:@"Content-Disposition: form-data; name=\"file\";filename=\"%d.jpg\"\r\n",arc4random()] dataUsingEncoding:NSUTF8StringEncoding]];
    [body appendData:[@"Content-Type: application/octet-stream\r\n\r\n" dataUsingEncoding:NSUTF8StringEncoding]];
    [body appendData:[NSData dataWithData:imageData]];
    [body appendData:[@"\r\n" dataUsingEncoding:NSUTF8StringEncoding]];
    // close form
    [body appendData:[[NSString stringWithFormat:@"--%@--\r\n", boundary] dataUsingEncoding:NSUTF8StringEncoding]];
    // set request body
    [request setHTTPBody:body];


    //return and test
    NSData *returnData = [NSURLConnection sendSynchronousRequest:request returningResponse:nil error:nil];
    NSString *returnString = [[NSString alloc] initWithData:returnData encoding:NSUTF8StringEncoding];

    NSLog(@"%@", returnString); 
    NSData *stringData = [returnString dataUsingEncoding:NSUTF8StringEncoding];
    id json = [NSJSONSerialization JSONObjectWithData:stringData options:0 error:nil];

    if (![json isKindOfClass:[NSDictionary class]]) {

        return NULL;
    }
   
    id code = json [@"code"];

    if (![code isKindOfClass:[NSNumber class]]) {

        return NULL;
    }
    if ([code intValue] != 0) {
        return NULL;
    }

    id data = json [@"data"];

    if (![data isKindOfClass:[NSDictionary class]]) {

        return NULL;
    }

    id path = data [@"path"];

    if (![path isKindOfClass:[NSString class]]) {

        return NULL;
    }

    return (NSString*)path;
    

}

- (BOOL) doShare: (MisesShareItem*) item{
    NSString* imageUrl = NULL;
    if (item.image) {
        imageUrl = [self uploadImage:item.image];
    }
    if (imageUrl == NULL) {
        imageUrl = @"";
    }
    NSString * apiURLStr =[NSString stringWithFormat:@"https://api.alb.mises.site/api/v1/status"];
    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:[NSURL URLWithString:apiURLStr] cachePolicy:NSURLRequestUseProtocolCachePolicy timeoutInterval:30.0];
    NSString *authValueToken = [@"Bearer " stringByAppendingString:[[Mises account] misesToken]];
    [request setValue:authValueToken forHTTPHeaderField:@"Authorization"];
    [request setValue:@"Keep-alive" forHTTPHeaderField:@"Connection"];
    [request setValue:@"UTF-8" forHTTPHeaderField:@"Charset"];
    [request setValue:@"application/json" forHTTPHeaderField:@"Content-Type"];
    [request setHTTPMethod:@"POST"];
    [request setValue:@"application/json" forHTTPHeaderField:@"Accept"];

    NSString * host = [[NSURL URLWithString:item.url] host];
    NSDictionary *linkDict = @{
       @"host" : host,
        @"link" : item.url,
        @"title" : item.title,
        @"attachment_path" : imageUrl
    };
    NSDictionary *jsonDict = @{
       @"status_type" : @"link",
        @"from_type" : @"forward",
        @"content" : item.message,
         @"link_meta" : linkDict
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
    
    
    return YES;
}


- (void) share:(MisesShareItem*) item {
    [self performSelector:@selector(runService:) onThread:_thread withObject:item waitUntilDone:NO];
}

- (void) setDelegate:(id<MisesShareServiceDelegate>)delegate {
    _delegate = delegate;
}
@end
