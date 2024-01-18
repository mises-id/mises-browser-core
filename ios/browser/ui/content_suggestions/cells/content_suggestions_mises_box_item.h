// Copyright 2017 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

#ifndef IOS_CHROME_BROWSER_UI_CONTENT_SUGGESTIONS_CELLS_CONTENT_SUGGESTIONS_MISES_BOX_ITEM_H_
#define IOS_CHROME_BROWSER_UI_CONTENT_SUGGESTIONS_CELLS_CONTENT_SUGGESTIONS_MISES_BOX_ITEM_H_


#import "ios/chrome/browser/ui/content_suggestions/cells/suggested_content.h"

// Item to display what is new in the ContentSuggestions.
@interface ContentSuggestionsMisesBoxItem : NSObject



+ (nonnull NSString*)accessibilityIdentifier;

@end

// Associated cell, displaying what is new.
@interface ContentSuggestionsMisesBoxCell : UIView


// Returns the height needed by a cell contained in |width| containing |text|.
+ (CGFloat)heightForWidth:(CGFloat)width;

@end


#endif  // IOS_CHROME_BROWSER_UI_CONTENT_SUGGESTIONS_CELLS_CONTENT_SUGGESTIONS_WHATS_NEW_ITEM_H_
