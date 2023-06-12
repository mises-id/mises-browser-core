// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

#ifndef IOS_CHROME_BROWSER_UI_TOOLBAR_MISES_TOOLBAR_COORDINATOR_H_
#define IOS_CHROME_BROWSER_UI_TOOLBAR_MISES_TOOLBAR_COORDINATOR_H_

#import "ios/chrome/browser/ui/toolbar/adaptive_toolbar_coordinator.h"
#import "mises/ios/browser/ui/toolbar/mises_toolbar_delegate.h"

// Coordinator for the secondary part of the adaptive toolbar. It is the part
// containing the controls displayed only on specific size classes.


@interface MisesToolbarCoordinator : ChromeCoordinator

@property(nonatomic, strong) id<MisesToolbarDelegate> delegate;

- (instancetype)initWithBrowser:(Browser*)browser NS_DESIGNATED_INITIALIZER;

- (instancetype)initWithBaseViewController:(UIViewController*)viewController
                                   browser:(Browser*)browser NS_UNAVAILABLE;

- (void) activate;
@end

#endif  // IOS_CHROME_BROWSER_UI_TOOLBAR_MISES_TOOLBAR_COORDINATOR_H_
