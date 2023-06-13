// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

#ifndef IOS_CHROME_BROWSER_UI_MISES_SHARE_MISES_SHARE_COORDINATOR_H_
#define IOS_CHROME_BROWSER_UI_MISES_SHARE_MISES_SHARE_COORDINATOR_H_

#import "ios/chrome/browser/ui/coordinators/chrome_coordinator.h"
#include "url/gurl.h"

@protocol MisesShareCommands;


@interface MisesShareCoordinator : ChromeCoordinator

- (instancetype)initWithBaseViewController:(UIViewController*)viewController
                                   browser:(Browser*)browser
                                     title:(NSString*)title
                                       URL:(const GURL&)URL
                                   handler:(id<MisesShareCommands>)handler
    NS_DESIGNATED_INITIALIZER;

// Unavailable, use -initWithBaseViewController:browser:title:URL:.
- (instancetype)initWithBaseViewController:(UIViewController*)viewController
                                   browser:(Browser*)browser NS_UNAVAILABLE;

@end

#endif  // IOS_CHROME_BROWSER_UI_MISES_SHARE_MISES_SHARE_COORDINATOR_H_
