/* Copyright (c) 2019 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#ifndef BRAVE_BROWSER_BRAVE_BROWSER_PROCESS_IMPL_H_
#define BRAVE_BROWSER_BRAVE_BROWSER_PROCESS_IMPL_H_

#include <memory>

#include "base/memory/ref_counted.h"
#include "mises/browser/mises_browser_process.h"
#include "chrome/browser/browser_process_impl.h"
#include "extensions/buildflags/buildflags.h"


class MisesBrowserProcessImpl : public MisesBrowserProcess,
                                public BrowserProcessImpl {
 public:
  explicit MisesBrowserProcessImpl(StartupData* startup_data);
  MisesBrowserProcessImpl(const MisesBrowserProcessImpl&) = delete;
  MisesBrowserProcessImpl& operator=(const MisesBrowserProcessImpl&) = delete;
  ~MisesBrowserProcessImpl() override;

  // BrowserProcess implementation.

  ProfileManager* profile_manager() override;
  NotificationPlatformBridge* notification_platform_bridge() override;

  // BraveBrowserProcess implementation.

  void StartMisesServices() override;

 private:
  // BrowserProcessImpl overrides:
  void Init() override;
#if !BUILDFLAG(IS_ANDROID)
  void StartTearDown() override;
#endif



  SEQUENCE_CHECKER(sequence_checker_);
};

#endif  // BRAVE_BROWSER_BRAVE_BROWSER_PROCESS_IMPL_H_
