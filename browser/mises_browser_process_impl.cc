/* Copyright (c) 2019 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "mises/browser/mises_browser_process_impl.h"

#include <memory>
#include <string>
#include <utility>

#include "base/bind.h"
#include "base/path_service.h"
#include "base/task/thread_pool.h"
#include "build/build_config.h"
#include "chrome/browser/component_updater/component_updater_utils.h"
#include "chrome/browser/net/system_network_context_manager.h"
#include "chrome/common/buildflags.h"
#include "chrome/common/chrome_paths.h"
#include "components/component_updater/component_updater_service.h"
#include "components/component_updater/timer_update_scheduler.h"
#include "content/public/browser/browser_thread.h"
#include "content/public/browser/child_process_security_policy.h"
#include "services/network/public/cpp/resource_request.h"
#include "services/network/public/cpp/shared_url_loader_factory.h"
#include "url/gurl.h"

#if BUILDFLAG(IS_ANDROID)
#include "chrome/browser/flags/android/chrome_feature_list.h"
#else
#include "chrome/browser/ui/browser.h"
#include "chrome/browser/ui/browser_list.h"
#endif
#if BUILDFLAG(ENABLE_IPFS)
#include "mises/components/ipfs/brave_ipfs_client_updater.h"
#include "mises/components/ipfs/ipfs_constants.h"
#endif


using content::BrowserThread;

MisesBrowserProcessImpl::~MisesBrowserProcessImpl() = default;

MisesBrowserProcessImpl::MisesBrowserProcessImpl(StartupData* startup_data)
    : BrowserProcessImpl(startup_data) {
  g_browser_process = this;
  g_mises_browser_process = this;
}

void MisesBrowserProcessImpl::Init() {
  BrowserProcessImpl::Init();

}

#if !BUILDFLAG(IS_ANDROID)
void MisesBrowserProcessImpl::StartTearDown() {
  BrowserProcessImpl::StartTearDown();
}
#endif

#if BUILDFLAG(ENABLE_IPFS)
ipfs::BraveIpfsClientUpdater* MisesBrowserProcessImpl::ipfs_client_updater() {
/*
      	if (ipfs_client_updater_)
    return ipfs_client_updater_.get();

  base::FilePath user_data_dir;
  base::PathService::Get(chrome::DIR_USER_DATA, &user_data_dir);

  ipfs_client_updater_ = ipfs::BraveIpfsClientUpdaterFactory(
      brave_component_updater_delegate(), user_data_dir);
  return ipfs_client_updater_.get();
  */
	ipfs::BraveIpfsClientUpdater *t=nullptr;
  return t;

}
#endif  // BUILDFLAG(ENABLE_IPFS)

// ProfileManager* MisesBrowserProcessImpl::profile_manager() {
//   return BrowserProcessImpl::profile_manager();
// }

void MisesBrowserProcessImpl::StartMisesServices() {
  DCHECK_CURRENTLY_ON(content::BrowserThread::UI);
}


NotificationPlatformBridge*
MisesBrowserProcessImpl::notification_platform_bridge() {
  return BrowserProcessImpl::notification_platform_bridge();
}
