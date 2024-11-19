/* Copyright (c) 2019 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#ifndef MISES_BROWSER_EXTENSION_WEB_CONTENTS_HELPER_H_
#define MISES_BROWSER_EXTENSION_WEB_CONTENTS_HELPER_H_

#include "content/public/browser/web_contents_observer.h"
#include "content/public/browser/web_contents_user_data.h"
#include "components/sessions/core/session_id.h"

class ExtensionWebContentsHelper
    : public content::WebContentsObserver,
      public content::WebContentsUserData<ExtensionWebContentsHelper> {
 public:
  explicit ExtensionWebContentsHelper(content::WebContents* contents);
  ExtensionWebContentsHelper(const ExtensionWebContentsHelper&) =
      delete;
  ExtensionWebContentsHelper& operator=(
      const ExtensionWebContentsHelper&) = delete;
  ~ExtensionWebContentsHelper() override;

  void SetExtensionInfo(const std::string& extenison_id, SessionID::id_type extension_window_id);
  // content::WebContentsObserver overrides:
  void WebContentsDestroyed() override;


  WEB_CONTENTS_USER_DATA_KEY_DECL();
private:
  SessionID::id_type extension_window_id_ = -1;
  std::string extension_id_;
};

#endif  // BRAVE_BROWSER_ANDROID_PREFERENCES_BACKGROUND_VIDEO_PLAYBACK_TAB_HELPER_H_
