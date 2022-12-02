/* Copyright (c) 2019 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "mises/browser/mises_browser_main_parts_mac.h"

// #include "mises/browser/sparkle_buildflags.h"

// #if BUILDFLAG(ENABLE_SPARKLE)
// #import "mises/browser/mac/sparkle_glue.h"
// #endif

void MisesBrowserMainPartsMac::PreCreateMainMessageLoop() {
  ChromeBrowserMainPartsMac::PreCreateMainMessageLoop();

// #if BUILDFLAG(ENABLE_SPARKLE)
//   // It would be no-op if udpate is disabled.
//   [[SparkleGlue sharedSparkleGlue] registerWithSparkle];
// #endif
}
