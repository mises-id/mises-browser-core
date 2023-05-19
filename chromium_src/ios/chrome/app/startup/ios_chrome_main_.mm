// Copyright 2012 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

#import "ios/chrome/app/startup/ios_chrome_main.h"

#import <UIKit/UIKit.h>

#import <vector>

#import "base/check.h"
#import "base/strings/string_piece.h"
#import "base/strings/sys_string_conversions.h"
#import "base/time/time.h"
#import "ios/web/public/init/web_main.h"

#if !defined(__has_feature) || !__has_feature(objc_arc)
#error "This file requires ARC support."
#endif

namespace {
base::TimeTicks* g_start_time;
MisesCoreMain* g_core_main;
}  // namespace

IOSChromeMain::IOSChromeMain() {
   auto core = [[MisesCoreMain alloc] initWithUserAgent:@"Test"];
  [core scheduleLowPriorityStartupTasks];
  g_core_main = core;
}

IOSChromeMain::~IOSChromeMain() {}

// static
void IOSChromeMain::InitStartTime() {
  DCHECK(!g_start_time);
  g_start_time = new base::TimeTicks(base::TimeTicks::Now());
}

// static
const base::TimeTicks& IOSChromeMain::StartTime() {
  CHECK(g_start_time);
  return *g_start_time;
}