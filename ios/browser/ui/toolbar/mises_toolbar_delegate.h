// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

#ifndef IOS_CHROME_BROWSER_UI_TOOLBAR_MISES_TOOLBAR_DELEGATE_H_
#define IOS_CHROME_BROWSER_UI_TOOLBAR_MISES_TOOLBAR_DELEGATE_H_


// Coordinator for the secondary part of the adaptive toolbar. It is the part
// containing the controls displayed only on specific size classes.

@protocol MisesToolbarDelegate
- (void)updateMisesAvatar:(UIImage*)image;
@end

#endif  // IOS_CHROME_BROWSER_UI_TOOLBAR_MISES_TOOLBAR_DELEGATE_H_
