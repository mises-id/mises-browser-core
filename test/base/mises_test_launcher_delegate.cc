/* Copyright 2019 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "mises/test/base/mises_test_launcher_delegate.h"

#include "mises/app/mises_main_delegate.h"
#include "build/build_config.h"

#if BUILDFLAG(IS_MAC) || BUILDFLAG(IS_LINUX)
#include "chrome/browser/first_run/first_run_internal.h"
#endif

MisesTestLauncherDelegate::MisesTestLauncherDelegate(
    ChromeTestSuiteRunner* runner)
    : ChromeTestLauncherDelegate(runner) {
  // Suppress first run dialg during the test. It can cause some tests timeout.
  // It's not used on Windows.
#if BUILDFLAG(IS_MAC) || BUILDFLAG(IS_LINUX)
  first_run::internal::ForceFirstRunDialogShownForTesting(false);
#endif

  // Suppress browser window closing dialog during the test.
  // It can cause some tests timeout.
  //MisesBrowser::SuppressBrowserWindowClosingDialogForTesting(true);
}

MisesTestLauncherDelegate::~MisesTestLauncherDelegate() = default;

content::ContentMainDelegate*
MisesTestLauncherDelegate::CreateContentMainDelegate() {
  return new MisesMainDelegate(base::TimeTicks::Now());
}
