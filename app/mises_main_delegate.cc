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
#include "mises/common/resource_bundle_helper.h"
#include "mises/renderer/mises_content_renderer_client.h"
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

#if !defined(CHROME_MULTIPLE_DLL_BROWSER)
base::LazyInstance<MisesContentRendererClient>::DestructorAtExit
    g_mises_content_renderer_client = LAZY_INSTANCE_INITIALIZER;
#endif

#if !defined(CHROME_MULTIPLE_DLL_CHILD)
base::LazyInstance<MisesContentBrowserClient>::DestructorAtExit
    g_mises_content_browser_client = LAZY_INSTANCE_INITIALIZER;
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

content::ContentRendererClient*
MisesMainDelegate::CreateContentRendererClient() {
#if defined(CHROME_MULTIPLE_DLL_BROWSER)
  return NULL;
#else
  return g_mises_content_renderer_client.Pointer();
#endif
}


void MisesMainDelegate::PreSandboxStartup() {
  ChromeMainDelegate::PreSandboxStartup();
#if BUILDFLAG(IS_LINUX) || BUILDFLAG(IS_MAC)
  // Setup NativeMessagingHosts to point to the default Chrome locations
  // because that's where native apps will create them
  base::FilePath chrome_user_data_dir;
  base::FilePath native_messaging_dir;
#if BUILDFLAG(IS_MAC)
  base::PathService::Get(base::DIR_APP_DATA, &chrome_user_data_dir);
  chrome_user_data_dir = chrome_user_data_dir.Append("Google/Chrome");
  native_messaging_dir = base::FilePath(
      FILE_PATH_LITERAL("/Library/Google/Chrome/NativeMessagingHosts"));
#else
  chrome::GetDefaultUserDataDirectory(&chrome_user_data_dir);
  native_messaging_dir = base::FilePath(
      FILE_PATH_LITERAL("/etc/opt/chrome/native-messaging-hosts"));
#endif  // BUILDFLAG(IS_MAC)
  base::PathService::OverrideAndCreateIfNeeded(
      chrome::DIR_USER_NATIVE_MESSAGING,
      chrome_user_data_dir.Append(FILE_PATH_LITERAL("NativeMessagingHosts")),
      false, true);
  base::PathService::OverrideAndCreateIfNeeded(
      chrome::DIR_NATIVE_MESSAGING, native_messaging_dir, false, true);
#endif  // BUILDFLAG(IS_LINUX) || BUILDFLAG(IS_MAC)

#if BUILDFLAG(IS_POSIX) && !BUILDFLAG(IS_MAC)
  base::PathService::OverrideAndCreateIfNeeded(
      chrome::DIR_POLICY_FILES,
      base::FilePath(FILE_PATH_LITERAL("/etc/mises/policies")), true, false);
#endif

  if (mises::SubprocessNeedsResourceBundle()) {
    mises::InitializeResourceBundle();
  }
}