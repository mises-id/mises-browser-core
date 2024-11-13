/* Copyright (c) 2020 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#ifndef MISES_APP_BRAVE_MAIN_DELEGATE_H_
#define MISES_APP_BRAVE_MAIN_DELEGATE_H_

#include <string>

#include "build/build_config.h"
#include "chrome/app/chrome_main_delegate.h"

// Chrome implementation of ContentMainDelegate.
class MisesMainDelegate : public ChromeMainDelegate {
 public:
  MisesMainDelegate(const MisesMainDelegate&) = delete;
  MisesMainDelegate& operator=(const MisesMainDelegate&) = delete;
  MisesMainDelegate();

  // |exe_entry_point_ticks| is the time at which the main function of the
  // executable was entered, or null if not available.
  explicit MisesMainDelegate(const StartupTimestamps& timestamps);
  ~MisesMainDelegate() override;

 protected:
  // content::ContentMainDelegate implementation:
  content::ContentBrowserClient* CreateContentBrowserClient() override;
  content::ContentRendererClient* CreateContentRendererClient() override;
  void PreSandboxStartup() override;
};

#endif  // BRAVE_APP_BRAVE_MAIN_DELEGATE_H_
