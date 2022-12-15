/* Copyright (c) 2021 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

// This interface is for managing the global services of the application. Each
// service is lazily created when requested the first time. The service getters
// will return NULL if the service is not available, so callers must check for
// this condition.

#ifndef BRAVE_BROWSER_BRAVE_BROWSER_PROCESS_H_
#define BRAVE_BROWSER_BRAVE_BROWSER_PROCESS_H_

#include "extensions/buildflags/buildflags.h"

class MisesBrowserProcess {
 public:
  MisesBrowserProcess();
  virtual ~MisesBrowserProcess();
  virtual void StartMisesServices() = 0;
};

extern MisesBrowserProcess* g_mises_browser_process;

#endif  // BRAVE_BROWSER_BRAVE_BROWSER_PROCESS_H_
