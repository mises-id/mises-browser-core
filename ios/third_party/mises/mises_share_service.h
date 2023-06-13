#ifndef IOS_CHROME_APP_MISES_SHARE_SERVICE_H_
#define IOS_CHROME_APP_MISES_SHARE_SERVICE_H_
#import <UIKit/UIKit.h>

@interface MisesShareItem: NSObject

@property (nonatomic, strong) NSString *url;
@property (nonatomic, strong) NSString *title;
@property (nonatomic, strong) NSString *message;
@property (nonatomic, strong) UIImage *image;


- (id) initWithUrl:(NSString*) url title:(NSString*) title message:(NSString*) msg image:(UIImage *) image;

@end


@protocol MisesShareServiceDelegate
- (void)shareFinish:(BOOL)ok;
@end

@interface MisesShareService: NSObject

- (void) share:(MisesShareItem*) item;

- (void) setDelegate:(id<MisesShareServiceDelegate>)delegate;

+ (instancetype)wrapper;

@end
#endif  // IOS_CHROME_APP_MISES_SHARE_SERVICE_H_

