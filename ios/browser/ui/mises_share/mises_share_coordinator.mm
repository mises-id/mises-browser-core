
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

#import "mises/ios/browser/ui/mises_share/mises_share_coordinator.h"
#import "mises/ios/browser/ui/mises_share/mises_share_view_controller.h"

#import <LinkPresentation/LinkPresentation.h>
#import <MobileCoreServices/MobileCoreServices.h>

#import "base/apple/foundation_util.h"
#include "base/metrics/user_metrics.h"
#include "base/metrics/user_metrics_action.h"
#include "base/strings/sys_string_conversions.h"
#include "ios/chrome/browser/shared/model/browser/browser.h"
#import "ios/chrome/browser/ui/activity_services/activity_params.h"
#import "ios/chrome/browser/ui/activity_services/activity_scenario.h"
#import "ios/chrome/browser/ui/activity_services/activity_service_coordinator.h"
#import "ios/chrome/browser/ui/activity_services/requirements/activity_service_positioner.h"
#import "ios/chrome/browser/ui/activity_services/requirements/activity_service_presentation.h"
#import "ios/chrome/browser/shared/public/commands/command_dispatcher.h"
#import "ios/chrome/browser/ui/commands/mises_share_commands.h"
#import "ios/chrome/common/ui/confirmation_alert/confirmation_alert_action_handler.h"
#import "ios/chrome/common/ui/elements/popover_label_view_controller.h"


#import "ios/web/public/web_state.h"
#include "ios/chrome/browser/ui/activity_services/data/chrome_activity_item_thumbnail_generator.h"
#import "ios/chrome/browser/shared/model/web_state_list/web_state_list.h"
#include "ios/chrome/browser/shared/model/browser_state/chrome_browser_state.h"

#include "ios/chrome/grit/ios_strings.h"
#import "ui/strings/grit/ui_strings.h"

#import "net/base/mac/url_conversions.h"
#include "ui/base/l10n/l10n_util_mac.h"

#include "ios/third_party/mises/mises_share_service.h"


#if !defined(__has_feature) || !__has_feature(objc_arc)
#error "This file requires ARC support."
#endif

namespace {

const CGFloat kScreenShotWidth = 256;
const CGFloat kScreenShotHeight = 256;

}  // namespace
using ItemBlock = void (^)(id idResponse, NSError* error);

@interface MisesShareCoordinator () <ActivityServicePositioner,
                                      ActivityServicePresentation,
                                      ConfirmationAlertActionHandler,
                                      MisesShareServiceDelegate> {
  // URL of a page to mises share for.
  GURL _URL;
}

@property(nonatomic, strong) id<MisesShareCommands> handler;
@property(nonatomic, strong) MisesShareViewController* viewController;

@property(nonatomic, assign) Browser* browser;


@property(nonatomic, strong) LPMetadataProvider* lpProvider;

@property(nonatomic, strong)
    ActivityServiceCoordinator* activityServiceCoordinator;

@property(nonatomic, copy) NSString* title;

@property(nonatomic, copy) UIImage* image;

@property(nonatomic, strong)
    PopoverLabelViewController* learnMoreViewController;

@end

@implementation MisesShareCoordinator
@synthesize browser = _browser;

- (instancetype)initWithBaseViewController:(UIViewController*)viewController
                                   browser:(Browser*)browser
                                     title:(NSString*)title
                                       URL:(const GURL&)URL
                                   handler:(id<MisesShareCommands>)handler {
  if (self = [super initWithBaseViewController:viewController browser:browser]) {
    _title = title;
    _URL = URL;
    _handler = handler;
    self.browser = browser;
  }
  return self;
}

#pragma mark - Chrome Coordinator

- (void)start {
  self.viewController = [[MisesShareViewController alloc]
      initWithTitle:self.title
            pageURL:net::NSURLWithGURL(_URL)];

  [self.viewController setModalPresentationStyle:UIModalPresentationFormSheet];
  [self.viewController setActionHandler:self];

  [self.baseViewController presentViewController:self.viewController
                                        animated:YES
                                      completion:nil];
  [self loadThumbImage];
  [self loadLinkMeta];
  [super start];
}

- (void)stop {
  [self.baseViewController dismissViewControllerAnimated:YES completion:nil];
  self.viewController = nil;
  self.learnMoreViewController = nil;

  [self.activityServiceCoordinator stop];
  self.activityServiceCoordinator = nil;

    
  [self.lpProvider cancel];
  [super stop];
}

#pragma mark - ConfirmationAlertActionHandler

- (void)confirmationAlertDismissAction {
  [self.handler hideMisesShare];
}

- (void)confirmationAlertPrimaryAction {
  base::RecordAction(base::UserMetricsAction("MobileShareToMisesDiscover"));

   NSString* shareTitle = self.title;
   NSString* shareURL = [net::NSURLWithGURL(_URL) absoluteString];
  
  MisesShareItem * item = [[MisesShareItem alloc] initWithUrl:shareURL title:shareTitle message:self.viewController.commentText image:self.image];

  [[MisesShareService wrapper] setDelegate:self];
  [[MisesShareService wrapper] share:item];
}

- (void)confirmationAlertLearnMoreAction {
//  NSString* message =
//      l10n_util::GetNSString(IDS_IOS_MISES_SHARE_LEARN_MORE_MESSAGE);
//  self.learnMoreViewController =
//      [[PopoverLabelViewController alloc] initWithMessage:message];
//
//  self.learnMoreViewController.popoverPresentationController.barButtonItem =
//      self.viewController.helpButton;
//  self.learnMoreViewController.popoverPresentationController
//      .permittedArrowDirections = UIPopoverArrowDirectionUp;
//
//  [self.viewController presentViewController:self.learnMoreViewController
//                                    animated:YES
//                                  completion:nil];
}

#pragma mark - ActivityServicePositioner

- (UIView*)sourceView {
  return self.viewController.view;
}

- (CGRect)sourceRect {
  return self.viewController.view.bounds;
}

#pragma mark - ActivityServicePresentation

- (void)activityServiceDidEndPresenting {
  [self.activityServiceCoordinator stop];
  self.activityServiceCoordinator = nil;
}


- (void)loadThumbImage {
    web::WebState* web_state = _browser->GetWebStateList()->GetActiveWebState();
    if (!web_state || web_state->GetBrowserState()->IsOffTheRecord()) {
        return;
    }
    ChromeActivityItemThumbnailGenerator* thumbnail_generator = [[ChromeActivityItemThumbnailGenerator alloc]
                    initWithWebState:web_state];
    CGSize size = CGSizeMake(kScreenShotWidth, kScreenShotHeight);
    UIImage* thumbnail = [thumbnail_generator thumbnailWithSize:size];
    self.image = thumbnail;
    [self.viewController updateThumbImage:thumbnail];

}

- (void)hideLoadingLinkMeta {
    dispatch_async(dispatch_get_main_queue(), ^{
        [self.viewController hideLinkLoadingIndicator];
    });
}
- (void)loadLinkMeta {
  [self.viewController showLinkLoadingIndicator];
  LPMetadataProvider *provider = [[LPMetadataProvider alloc] init];
  provider.timeout = 10;
  provider.shouldFetchSubresources = YES;
  NSURL *url = net::NSURLWithGURL(_URL);
  [provider startFetchingMetadataForURL:url completionHandler:^(LPLinkMetadata * _Nullable metadata, NSError * _Nullable error) {
      if (error) {
          [self hideLoadingLinkMeta];
          return;
      }
      NSString *lpTitle = metadata.title;
      if (lpTitle) {
          dispatch_async(dispatch_get_main_queue(), ^{
              self.title = lpTitle;
              [self.viewController updateTitle:lpTitle];
          });
          
      }
      
      NSItemProvider *thumbProvider = metadata.imageProvider;
      if (!thumbProvider) {
          thumbProvider = metadata.iconProvider;
      }

      if (thumbProvider) {
        [thumbProvider loadObjectOfClass:UIImage.class completionHandler:^(UIImage* _Nullable image, NSError * _Nullable error) {
            [self hideLoadingLinkMeta];
            dispatch_async(dispatch_get_main_queue(), ^{
                
                if (image) {
                    
                    self.image = image;
                    [self.viewController updateThumbImage:image];
                    
                }
            });
           
            
        }];
      } else {
          [self hideLoadingLinkMeta];
      }
  }];
    
    self.lpProvider = provider;
}


#pragma mark - MisesShareServiceDelegate
- (void) shareFinish:(BOOL)ok {
  if (ok) {
    [self.handler hideMisesShare];
  } else {
      
    [self.viewController reset];
    NSString* title = @"Share Failed";
    NSString* message = @"Please try again later";
    [self presentAlertWithTitle:title message:message];
  }
  
}


- (void)presentAlertWithTitle:(NSString*)title message:(NSString*)msg {

  UIAlertController* alert =
      [UIAlertController alertControllerWithTitle:title
                                          message:msg
                                   preferredStyle:UIAlertControllerStyleAlert];
  UIAlertAction* defaultAction =
      [UIAlertAction actionWithTitle:l10n_util::GetNSString(IDS_APP_OK)
                               style:UIAlertActionStyleDefault
                             handler:^(UIAlertAction* action){
                             }];
  [alert addAction:defaultAction];
  UIViewController* presenter = self.viewController;
  while (presenter.presentedViewController) {
    presenter = presenter.presentedViewController;
  }
  [presenter presentViewController:alert animated:YES completion:nil];
}

@end
