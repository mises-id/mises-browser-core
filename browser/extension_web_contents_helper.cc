/* Copyright (c) 2019 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "mises/browser/extension_web_contents_helper.h"

#include <string>

#include "base/strings/utf_string_conversions.h"
#include "mises/browser/android/preferences/features.h"
#include "mises/components/constants/pref_names.h"
#include "chrome/browser/content_settings/host_content_settings_map_factory.h"
#include "chrome/browser/profiles/profile.h"
#include "components/prefs/pref_service.h"
#include "content/browser/web_contents/web_contents_impl.h"
#include "content/public/browser/navigation_controller.h"
#include "content/public/browser/navigation_entry.h"
#include "content/public/browser/navigation_handle.h"
#include "content/public/browser/web_contents.h"
#include "net/base/registry_controlled_domains/registry_controlled_domain.h"
#include "url/gurl.h"

#include "chrome/browser/ui/browser.h"
#include "chrome/browser/ui/browser_list.h"
#include "chrome/browser/ui/browser_window.h"
#include "chrome/browser/extensions/browser_extension_window_controller.h"

namespace {

}  // namespace

ExtensionWebContentsHelper::ExtensionWebContentsHelper(
    content::WebContents* contents)
    : WebContentsObserver(contents),
      content::WebContentsUserData<ExtensionWebContentsHelper>(
          *contents) {}

ExtensionWebContentsHelper::~ExtensionWebContentsHelper() {}

void ExtensionWebContentsHelper::SetExtensionInfo(const std::string& extension_id, SessionID::id_type extension_window_id) {
  extension_id_ = extension_id;
  extension_window_id_ = extension_window_id;
}

void ExtensionWebContentsHelper::WebContentsDestroyed() {
  LOG(INFO) << "WebContentsDestroyed:" << this;

  if (extension_window_id_ == -1) {
    LOG(INFO) << "WebContentsDestroyed step - 1a";
    return;
  }
  Browser* browser_to_remove = nullptr;
  for (Browser* browser : *BrowserList::GetInstance()) {
    if (browser->session_id().id() == extension_window_id_){
      browser_to_remove = browser;
      break;
    }
  }
  LOG(INFO) << "WebContentsDestroyed step - 2";
  if(browser_to_remove) {
    extensions::WindowController* controller = browser_to_remove->extension_window_controller();
    LOG(INFO) << "WebContentsDestroyed step - 3";
    if (controller) {
        LOG(INFO) << "WebContentsDestroyed step - 4";
        controller->window()->Close();
    }
  }
}
WEB_CONTENTS_USER_DATA_KEY_IMPL(ExtensionWebContentsHelper);
