// Copyright 2017 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

#import "ios/chrome/browser/ui/content_suggestions/cells/content_suggestions_mises_box_item.h"

#import <MaterialComponents/MaterialTypography.h>

#include "base/check_op.h"
#import "ios/chrome/browser/ui/util/uikit_ui_util.h"
#include "ios/chrome/common/string_util.h"
#import "ios/chrome/common/ui/colors/semantic_color_names.h"
#import "ios/chrome/common/ui/util/constraints_ui_util.h"


#if !defined(__has_feature) || !__has_feature(objc_arc)
#error "This file requires ARC support."
#endif

namespace {

}  // namespace

#pragma mark - ContentSuggestionsMisesBoxItem

@implementation ContentSuggestionsMisesBoxItem

@synthesize suggestionIdentifier = _suggestionIdentifier;
@synthesize metricsRecorded = _metricsRecorded;

- (instancetype)initWithType:(NSInteger)type {
  self = [super initWithType:type];
  if (self) {
    self.cellClass = [ContentSuggestionsMisesBoxCell class];
  }
  return self;
}

- (void)configureCell:(ContentSuggestionsMisesBoxCell*)cell {
  [super configureCell:cell];
  cell.accessibilityIdentifier = [[self class] accessibilityIdentifier];
}

- (CGFloat)cellHeightForWidth:(CGFloat)width {
  return [self.cellClass heightForWidth:width];
}

+ (NSString*)accessibilityIdentifier {
  return @"ContentSuggestionsMisesBoxIdentifier";
}

@end

#pragma mark - ContentSuggestionsMisesBoxCell

@interface ContentSuggestionsMisesBoxCell ()

@property(nonatomic, strong) UIView* containerView;

// Most visited items from the MostVisitedSites service currently displayed.

@end

@implementation ContentSuggestionsMisesBoxCell

@synthesize containerView = _containerView;

- (instancetype)initWithFrame:(CGRect)frame {
  self = [super initWithFrame:frame];
  if (self) {
      
    _containerView = [[UIView alloc] init];

    _containerView.translatesAutoresizingMaskIntoConstraints = NO;
      

    [self.contentView addSubview:_containerView];
  }
  return self;
}

+ (CGFloat)heightForWidth:(CGFloat)width {

  return 30;
}


#pragma mark UIView

// Implements -layoutSubviews as per instructions in documentation for
// +[MDCCollectionViewCell cr_preferredHeightForWidth:forItem:].
- (void)layoutSubviews {
  [super layoutSubviews];
}

#pragma mark Private

@end
