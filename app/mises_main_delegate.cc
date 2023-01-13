/* Copyright (c) 2019 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "mises/app/mises_main_delegate.h"

#include <memory>
#include <string>
#include <unordered_set>

#include "base/base_switches.h"
#include "base/lazy_instance.h"
#include "base/path_service.h"
#include "base/time/time.h"
#include "mises/browser/mises_content_browser_client.h"
#include "build/build_config.h"
#include "chrome/common/chrome_features.h"
#include "chrome/common/chrome_paths.h"
#include "chrome/common/chrome_paths_internal.h"
#include "chrome/common/chrome_switches.h"
#include "components/component_updater/component_updater_switches.h"
#include "components/dom_distiller/core/dom_distiller_switches.h"
#include "components/embedder_support/switches.h"
#include "components/sync/base/command_line_switches.h"
#include "components/variations/variations_switches.h"
#include "content/public/common/content_switches.h"
#include "google_apis/gaia/gaia_switches.h"

namespace {



}  // namespace

#if !defined(CHROME_MULTIPLE_DLL_CHILD)
base::LazyInstance<MisesContentBrowserClient>::DestructorAtExit
    g_brave_content_browser_client = LAZY_INSTANCE_INITIALIZER;
#endif

MisesMainDelegate::MisesMainDelegate() : ChromeMainDelegate() {}

MisesMainDelegate::MisesMainDelegate(base::TimeTicks exe_entry_point_ticks)
    : ChromeMainDelegate(exe_entry_point_ticks) {}

MisesMainDelegate::~MisesMainDelegate() {}

content::ContentBrowserClient* MisesMainDelegate::CreateContentBrowserClient() {
#if defined(CHROME_MULTIPLE_DLL_CHILD)
  return NULL;
#else
  if (chrome_content_browser_client_ == nullptr) {
    chrome_content_browser_client_ =
        std::make_unique<MisesContentBrowserClient>();
  }
  return chrome_content_browser_client_.get();
#endif
}
