// Copyright 2017 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

#import "mises/ios/browser/ui/content_suggestions/cells/content_suggestions_mises_item.h"

//#import <MaterialComponents/MaterialTypography.h>
#import <MaterialComponents/M3CButton.h>

#include "base/check_op.h"
#import "ios/chrome/browser/shared/ui/util/uikit_ui_util.h"
#include "ios/chrome/common/string_util.h"
#import "ios/chrome/common/ui/colors/semantic_color_names.h"
#import "ios/chrome/common/ui/util/constraints_ui_util.h"


#if !defined(__has_feature) || !__has_feature(objc_arc)
#error "This file requires ARC support."
#endif

namespace {

const CGFloat kLabelMargin = 20;
//const CGFloat kLabelLineSpacing = 4;
const CGFloat kLabelIconMargin = 8;
const CGFloat kboxTitleFontSize = 20;
const CGFloat kIconHeight = 55;
const CGFloat kIconWidth = 89;
const CGFloat kIconTopMargin = 10;
//const CGFloat kButtonHeight = 24;


}  // namespace

// #pragma mark - ContentSuggestionsMisesItem

// @implementation ContentSuggestionsMisesItem

// @synthesize suggestionIdentifier = _suggestionIdentifier;
// @synthesize metricsRecorded = _metricsRecorded;


// - (instancetype)initWithType:(NSInteger)type {
//   self = [super initWithType:type];
//   if (self) {
//     self.cellClass = [ContentSuggestionsMisesCell class];
//   }
//   return self;
// }

// - (void)configureCell:(ContentSuggestionsMisesCell*)cell {
//   [super configureCell:cell];
//   cell.accessibilityIdentifier = [[self class] accessibilityIdentifier];
// }

// - (CGFloat)cellHeightForWidth:(CGFloat)width {
//   return [self.cellClass heightForWidth:width];
// }

// + (NSString*)accessibilityIdentifier {
//   return @"ContentSuggestionsMisesIdentifier";
// }

// @end

#pragma mark - ContentSuggestionsMisesToggleCell

@interface ContentSuggestionsMisesToggleCell ()

@property(nonatomic, strong) UIView* containerView;

// Most visited items from the MostVisitedSites service currently displayed.

@end

@implementation ContentSuggestionsMisesToggleCell

@synthesize toggleButton = _toggleButton;
@synthesize containerView = _containerView;
@synthesize enterButton = _enterButton;

- (instancetype)initWithFrame:(CGRect)frame {
  self = [super initWithFrame:frame];
  if (self) {
      
    _toggleButton = [[M3CButton alloc] init];
    _containerView = [[UIView alloc] init];
    _enterButton = [[M3CButton alloc] init];


    _toggleButton.translatesAutoresizingMaskIntoConstraints = NO;
    _containerView.translatesAutoresizingMaskIntoConstraints = NO;
    _enterButton.translatesAutoresizingMaskIntoConstraints = NO;

      
    
    [_toggleButton setImage:[UIImage imageNamed:@"ntp_down"] forState:UIControlStateNormal];
      
      
    [_toggleButton setTitleColor:[UIColor colorNamed:kTextPrimaryColor] forState:UIControlStateNormal];
    [_toggleButton setBackgroundColor:[UIColor clearColor]];

    [_enterButton setTitleColor:[UIColor colorNamed:kTextPrimaryColor] forState:UIControlStateNormal];
    [_enterButton setBackgroundColor:[UIColor clearColor]];
        


    [self addSubview:_containerView];
    [_containerView addSubview:_toggleButton];
    [_containerView addSubview:_enterButton];


    ApplyVisualConstraintsWithMetrics(
      @[
        @"V:|[toggleButton]|",
        @"V:|[container]|",
        @"H:|[toggleButton]->=0-[enter]|",
        @"H:|[container]|"
      ],
      @{
        @"toggleButton" : _toggleButton,
        @"container" : _containerView,
        @"enter" : _enterButton,
      },
      @{
        @"margin" : @(kLabelMargin),
        @"iconMargin" : @(kIconTopMargin),
        @"iconHeight" : @(kIconHeight),
        @"iconWidth" : @(kIconWidth),
        @"spacing" : @(kLabelIconMargin)
      });
    [NSLayoutConstraint activateConstraints:@[
      [_containerView.centerXAnchor
          constraintEqualToAnchor:self.centerXAnchor]
    ]];
    [NSLayoutConstraint activateConstraints:@[
      [_toggleButton.heightAnchor
          constraintEqualToAnchor:_enterButton.heightAnchor]
    ]];
  }
  return self;
}

- (void) configureWith:(nonnull NSString*)title enter:(nonnull NSString*)enter {
  [_toggleButton setTitle:title forState:UIControlStateNormal];
  [_enterButton setTitle:enter forState:UIControlStateNormal];
}
+ (CGFloat)heightForWidth:(CGFloat)width {
  UILabel* label = [[UILabel alloc] init];
  label.font = [UIFont systemFontOfSize:kboxTitleFontSize];
  label.numberOfLines = 1;
  label.textAlignment = NSTextAlignmentLeft;
  CGSize sizeForLabel = CGSizeMake(width, 500);

  return 2 * kLabelMargin + [label sizeThatFits:sizeForLabel].height;
}

- (UIImage*)rotateUIImage:(UIImage*)sourceImage
{
    CGSize size = sourceImage.size;
    UIGraphicsBeginImageContext(CGSizeMake(size.height, size.width));
    [[UIImage imageWithCGImage:[sourceImage CGImage] scale:1.0 orientation:UIImageOrientationDown] drawInRect:CGRectMake(0,0,size.height ,size.width)];
    UIImage* newImage = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();

    return newImage;
}

- (void) toggle:(BOOL)on {
  if (on) {
    [_toggleButton setImage:[UIImage imageNamed:@"ntp_down"] forState:UIControlStateNormal];
  } else {
    [_toggleButton setImage:[self rotateUIImage:[UIImage imageNamed:@"ntp_down"]] forState:UIControlStateNormal];
  }

}

#pragma mark UIView


#pragma mark Private


@end


@implementation ContentSuggestionsMisesEmptyCell

+ (CGFloat)heightForWidth:(CGFloat)width {

  return kLabelMargin;
}
@end