// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

#import "mises/ios/browser/ui/popup_menu/cells/popup_menu_account_item.h"

#include <stdlib.h>

#include "base/mac/foundation_util.h"
#import "ios/chrome/browser/ui/popup_menu/public/popup_menu_ui_constants.h"
#import "ios/chrome/browser/ui/reading_list/number_badge_view.h"
#import "ios/chrome/browser/ui/reading_list/text_badge_view.h"
#import "ios/chrome/browser/ui/table_view/chrome_table_view_styler.h"
#import "ios/chrome/browser/ui/util/uikit_ui_util.h"
#import "ios/chrome/common/material_timing.h"
#include "ios/chrome/common/string_util.h"
#import "ios/chrome/common/ui/colors/semantic_color_names.h"
#import "ios/chrome/common/ui/util/constraints_ui_util.h"

#if !defined(__has_feature) || !__has_feature(objc_arc)
#error "This file requires ARC support."
#endif

namespace {
const CGFloat kAvatarSize = 60;

const CGFloat kCellHeight = 133;
const CGFloat kMargin = 15;
const CGFloat kTopMargin = 8;
const CGFloat kMaxWidth = 200;
const CGFloat kMaxHeight = 200;


NSMutableAttributedString* GetAddressAttributedString(NSString* address) {
  NSDictionary* textAttributes = @{
    NSForegroundColorAttributeName : [UIColor colorNamed:kTextSecondaryColor],
    NSFontAttributeName :
        [UIFont preferredFontForTextStyle:UIFontTextStyleFootnote]
  };
  NSString *shortAddress;
  if ([address length] > 15) {
      shortAddress = [address stringByReplacingCharactersInRange:NSMakeRange(8, [address length]  - 12) withString:@"..."];
  } else {
    shortAddress = address;
  }
    NSAttributedString* attributedString =
        [[NSAttributedString alloc] initWithString:shortAddress
                                               attributes:textAttributes];
  // Create the leading enterprise icon.
  NSTextAttachment* attachment = [[NSTextAttachment alloc] init];
  attachment.image = [UIImage imageNamed:@"popup_menu_copy"];

  // Making sure the image is well centered vertically relative to the text,
  // and also that the image scales with the text size.
  CGFloat height = attributedString.size.height;
  CGFloat capHeight =
      [UIFont preferredFontForTextStyle:UIFontTextStyleFootnote].capHeight;
  CGFloat verticalOffset = roundf(capHeight - height) / 2.f;
  attachment.bounds = CGRectMake(0, verticalOffset, height, height);

  NSMutableAttributedString* outputString = [attributedString mutableCopy];
  [outputString appendAttributedString:[[NSAttributedString alloc] initWithString:@" "]];
  [outputString appendAttributedString:[NSAttributedString
                                        attributedStringWithAttachment:attachment]];

  return outputString;
}

}  // namespace

@implementation PopupMenuAccountItem

@synthesize actionIdentifier = _actionIdentifier;

- (instancetype)initWithType:(NSInteger)type {
  self = [super initWithType:type];
  if (self) {
    self.cellClass = [PopupMenuAccountCell class];
  }
  return self;
}

- (void)configureCell:(PopupMenuAccountCell*)cell
           withStyler:(ChromeTableViewStyler*)styler {
  [super configureCell:cell withStyler:styler];
  cell.userInteractionEnabled = YES;
  cell.nameLabel.text = self.name;
  NSMutableAttributedString* StringOfCell =
      GetAddressAttributedString(self.address);
  cell.addressAttributedString = StringOfCell;
  cell.addressLabel.attributedText = StringOfCell;

  if (self.avatar) {
    cell.avatarView.image = self.avatar;
  } else {
    cell.avatarView.image = [UIImage imageNamed:@"mises_user_default"];
  }
  
}

#pragma mark - PopupMenuItem

- (CGSize)cellSizeForWidth:(CGFloat)width {
  // TODO(crbug.com/828357): This should be done at the table view level.
  static PopupMenuAccountCell* cell;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    cell = [[PopupMenuAccountCell alloc] init];
    [cell registerForContentSizeUpdates];
  });

  [self configureCell:cell withStyler:[[ChromeTableViewStyler alloc] init]];
  cell.frame = CGRectMake(0, 0, kMaxWidth, kMaxHeight);
  [cell setNeedsLayout];
  [cell layoutIfNeeded];
   CGSize ret = [cell systemLayoutSizeFittingSize:CGSizeMake(width / 2, kMaxHeight)];
    return ret;
}

@end

#pragma mark - PopupMenuAccountCell

@implementation PopupMenuAccountCell

- (instancetype)initWithStyle:(UITableViewCellStyle)style
              reuseIdentifier:(NSString*)reuseIdentifier {
  self = [super initWithStyle:style reuseIdentifier:reuseIdentifier];
  if (self) {
    UIView* selectedBackgroundView = [[UIView alloc] init];
    selectedBackgroundView.backgroundColor =
        [UIColor colorNamed:kTableViewRowHighlightColor];
    self.selectedBackgroundView = selectedBackgroundView;

    _nameLabel = [[UILabel alloc] init];
    _nameLabel.numberOfLines = 1;
    _nameLabel.translatesAutoresizingMaskIntoConstraints = NO;
    _nameLabel.adjustsFontForContentSizeCategory = YES;

    _addressLabel = [[UILabel alloc] init];
    _addressLabel.numberOfLines = 1;
    _addressLabel.translatesAutoresizingMaskIntoConstraints = NO;
    _addressLabel.adjustsFontForContentSizeCategory = YES;

    _avatarView = [[UIImageView alloc] init];
    _avatarView.translatesAutoresizingMaskIntoConstraints = NO;

    [_avatarView.layer setCornerRadius:kAvatarSize/2];
    [_avatarView.layer setMasksToBounds:YES];

    [self.contentView addSubview:_avatarView];
    [self.contentView addSubview:_nameLabel];
    [self.contentView addSubview:_addressLabel];

    [NSLayoutConstraint activateConstraints:@[
      [self.contentView.heightAnchor
          constraintGreaterThanOrEqualToConstant:kCellHeight],
    ]];

    ApplyVisualConstraintsWithMetrics(
        @[
          @"H:|-(margin)-[avatar(avatarSize)]",
          @"H:|-(margin)-[name]",
          @"H:|-(margin)-[address]",
          @"V:|-(>=topMargin)-[avatar(avatarSize)]-[name]-[address]-(>=topMargin)-|"
        ],
        @{
          @"name" : self.nameLabel,
          @"address" : self.addressLabel,
          @"avatar" : self.avatarView,
        },
        @{
          @"margin" : @(kMargin),
          @"topMargin" : @(kTopMargin),
          @"avatarSize" : @(kAvatarSize),
        });

    // The height constraint is used to have something as small as possible when
    // calculating the size of the prototype cell.
    NSLayoutConstraint* heightConstraint =
        [self.contentView.heightAnchor constraintEqualToConstant:kCellHeight];
    heightConstraint.priority = UILayoutPriorityDefaultLow;
    heightConstraint.active = YES;
  }
  return self;
}

- (void)registerForContentSizeUpdates {
  // This is needed because if the cell is static (used for height),
  // adjustsFontForContentSizeCategory isn't working.
  [[NSNotificationCenter defaultCenter]
      addObserver:self
         selector:@selector(preferredContentSizeDidChange:)
             name:UIContentSizeCategoryDidChangeNotification
           object:nil];
}

#pragma mark - UIView

- (void)layoutSubviews {
  [super layoutSubviews];

  // Adjust the text label preferredMaxLayoutWidth when the parent's width
  // changes, for instance on screen rotation.
  CGFloat parentWidth = CGRectGetWidth(self.contentView.bounds);
  self.addressLabel.preferredMaxLayoutWidth = parentWidth - kMargin * 2;
  self.nameLabel.preferredMaxLayoutWidth = parentWidth - kMargin * 2;

  // Re-layout with the new preferred width to allow the label to adjust its
  // height.
  [super layoutSubviews];
}

#pragma mark - UITableViewCell

- (void)prepareForReuse {
  [super prepareForReuse];
  self.userInteractionEnabled = NO;
  self.accessibilityTraits &= ~UIAccessibilityTraitNotEnabled;
}

#pragma mark - Accessibility

- (NSString*)accessibilityLabel {
  return self.addressAttributedString.string;
}

#pragma mark - Private

// Callback when the preferred Content Size change.
- (void)preferredContentSizeDidChange:(NSNotification*)notification {
  self.addressLabel.attributedText = self.addressAttributedString;
}

@end
