// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

#ifndef IOS_CHROME_BROWSER_UI_MISES_SHARE_MISES_SHARE_VIEW_CONTROLLER_H_
#define IOS_CHROME_BROWSER_UI_MISES_SHARE_MISES_SHARE_VIEW_CONTROLLER_H_

#import "ios/chrome/browser/ui/commands/mises_share_commands.h"

#import <UIKit/UIKit.h>

@protocol ConfirmationAlertActionHandler;

// View controller that displays a mises share representing a given website.
@interface MisesShareViewController : UIViewController

// Initializes the view controller with the |title| to be displayed and the
// |pageURL|.
- (instancetype)initWithTitle:(NSString*)title pageURL:(NSURL*)pageURL;


- (void)updateThumbImage:(UIImage*)image;
- (void)updateTitle:(NSString*)title;
- (void)reset;

- (void)showLinkLoadingIndicator;
- (void)hideLinkLoadingIndicator;

// The action handler for interactions in this View Controller.
@property(nonatomic, weak) id<ConfirmationAlertActionHandler> actionHandler;

// Returns an image generated from the content of this view controller.
@property(nonatomic, readonly) UIImage* content;

// The button for the primary action.
//@property(nonatomic, readonly) UIButton* primaryActionButton;

// The help button item in the top left of the view.
@property(nonatomic, readonly) UIBarButtonItem* shareButton;

@property(nonatomic, readonly) NSString* commentText;

@end

#endif  // IOS_CHROME_BROWSER_UI_MISES_SHARE_MISES_SHARE_VIEW_CONTROLLER_H_
