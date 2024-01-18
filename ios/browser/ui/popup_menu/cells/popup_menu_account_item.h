// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

#ifndef IOS_CHROME_BROWSER_UI_POPUP_MENU_CELLS_POPUP_MENU_ACCOUNT_ITEM_H_
#define IOS_CHROME_BROWSER_UI_POPUP_MENU_CELLS_POPUP_MENU_ACCOUNT_ITEM_H_

#import "ios/chrome/browser/ui/popup_menu/public/cells/popup_menu_item.h"
#import "ios/chrome/browser/shared/ui/table_view/cells/table_view_item.h"

// A non interactable textual item. The text wraps a leading image and
// description message.
@interface PopupMenuAccountItem : TableViewItem <PopupMenuItem>

// The avatar image.
@property(nonatomic, copy) UIImage* avatar;

// user name.
@property(nonatomic, copy) NSString* name;

// user crypto address.
@property(nonatomic, copy) NSString* address;

@end

// Associated cell for the PopupMenuTextItem.
@interface PopupMenuAccountCell : TableViewCell

// Text label for the cell.
@property(nonatomic, strong) UIImageView * avatarView;
@property(nonatomic, strong) UILabel* nameLabel;
@property(nonatomic, strong) UILabel* addressLabel;

@property(nonatomic, strong) NSMutableAttributedString* addressAttributedString;


// After this is called, the cell is listening for the
// UIContentSizeCategoryDidChangeNotification notification and updates its font
// size to the new category.
- (void)registerForContentSizeUpdates;

@end

#endif  // IOS_CHROME_BROWSER_UI_POPUP_MENU_CELLS_POPUP_MENU_TEXT_ITEM_H_
