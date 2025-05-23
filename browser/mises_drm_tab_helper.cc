/* Copyright (c) 2019 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "mises/browser/mises_drm_tab_helper.h"

#include <utility>
#include <vector>

#include "base/containers/contains.h"
#include "mises/browser/widevine/widevine_utils.h"
#include "mises/components/constants/pref_names.h"
#include "mises/components/widevine/constants.h"
#include "build/build_config.h"
#include "chrome/browser/browser_process_impl.h"
#include "chrome/browser/profiles/profile.h"
#include "components/prefs/pref_service.h"
#include "content/public/browser/navigation_controller.h"
#include "content/public/browser/navigation_handle.h"

#if !BUILDFLAG(IS_ANDROID)
#include "chrome/browser/ui/browser.h"
#include "chrome/browser/ui/browser_finder.h"
#include "chrome/browser/ui/tabs/tab_strip_model.h"
#endif

using component_updater::ComponentUpdateService;

namespace {
#if !BUILDFLAG(IS_ANDROID)
bool IsAlreadyRegistered(ComponentUpdateService* cus) {
  return base::Contains(cus->GetComponentIDs(), kWidevineComponentId);
}
#if !BUILDFLAG(IS_LINUX)
content::WebContents* GetActiveWebContents() {
  if (Browser* browser = chrome::FindLastActive())
    return browser->tab_strip_model()->GetActiveWebContents();
  return nullptr;
}

void ReloadIfActive(content::WebContents* web_contents) {
  if (GetActiveWebContents() == web_contents)
    web_contents->GetController().Reload(content::ReloadType::NORMAL, false);
}
#endif  // !BUILDFLAG(IS_LINUX)
#endif  // !BUILDFLAG(IS_ANDROID)
}  // namespace

MisesDrmTabHelper::MisesDrmTabHelper(content::WebContents* contents)
    : WebContentsObserver(contents),
      content::WebContentsUserData<MisesDrmTabHelper>(*contents),
      brave_drm_receivers_(contents, this) {
#if !BUILDFLAG(IS_ANDROID)
  auto* updater = g_browser_process->component_updater();
  // We don't need to observe if widevine is already registered.
  if (!IsAlreadyRegistered(updater))
    observer_.Observe(updater);
#endif
}

MisesDrmTabHelper::~MisesDrmTabHelper() = default;

// static
void MisesDrmTabHelper::BindMisesDRM(
    mojo::PendingAssociatedReceiver<mises_drm::mojom::MisesDRM> receiver,
    content::RenderFrameHost* rfh) {
  auto* web_contents = content::WebContents::FromRenderFrameHost(rfh);
  if (!web_contents)
    return;

  auto* tab_helper = MisesDrmTabHelper::FromWebContents(web_contents);
  if (!tab_helper)
    return;
  tab_helper->brave_drm_receivers_.Bind(rfh, std::move(receiver));
}

bool MisesDrmTabHelper::ShouldShowWidevineOptIn() const {
  // If the user already opted in, don't offer it.
  PrefService* prefs =
      static_cast<Profile*>(web_contents()->GetBrowserContext())->GetPrefs();
  if (IsWidevineEnabled() || !prefs->GetBoolean(kAskEnableWidvine)) {
    return false;
  }

  return is_widevine_requested_;
}

void MisesDrmTabHelper::DidStartNavigation(
    content::NavigationHandle* navigation_handle) {
  if (!navigation_handle->IsInMainFrame() ||
      navigation_handle->IsSameDocument()) {
    return;
  }
  is_widevine_requested_ = false;
  is_permission_requested_ = false;
}

void MisesDrmTabHelper::OnWidevineKeySystemAccessRequest() {
  is_widevine_requested_ = true;
#if BUILDFLAG(IS_ANDROID)
  bool for_restart = true;
#else
  bool for_restart = false;
#endif

  if (ShouldShowWidevineOptIn() && !is_permission_requested_) {
    is_permission_requested_ = true;
    RequestWidevinePermission(web_contents(), for_restart);
  }
}

void MisesDrmTabHelper::OnEvent(Events event, const std::string& id) {
#if !BUILDFLAG(IS_ANDROID)
  if (event == ComponentUpdateService::Observer::Events::COMPONENT_UPDATED &&
      id == kWidevineComponentId) {
#if BUILDFLAG(IS_LINUX)
    // Ask restart instead of reloading. Widevine is only usable after
    // restarting on linux. This restart permission request is only shown if
    // this tab asks widevine explicitely.
    if (is_widevine_requested_)
      RequestWidevinePermission(web_contents(), true /* for_restart*/);
#else
    // When widevine is ready to use, only active tab that requests widevine is
    // reloaded automatically.
    if (is_widevine_requested_)
      ReloadIfActive(web_contents());
#endif  // BUILDFLAG(IS_LINUX)
    // Stop observing component update event.
    observer_.Reset();
  }
#endif  // !BUILDFLAG(IS_ANDROID)
}

WEB_CONTENTS_USER_DATA_KEY_IMPL(MisesDrmTabHelper);
