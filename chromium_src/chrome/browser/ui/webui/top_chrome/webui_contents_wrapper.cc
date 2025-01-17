/* Copyright (c) 2024 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at https://mozilla.org/MPL/2.0/. */

#include "chrome/browser/ui/webui/top_chrome/webui_contents_wrapper.h"

#include "chrome/browser/page_load_metrics/page_load_metrics_initialize.h"
#include "chrome/browser/task_manager/web_contents_tags.h"
#include "chrome/browser/ui/browser_window.h"
#include "chrome/browser/ui/prefs/prefs_tab_helper.h"
#include "chrome/browser/ui/webui/top_chrome/webui_contents_preload_manager.h"
#include "chrome/common/chrome_render_frame.mojom.h"
#include "components/input/native_web_keyboard_event.h"
#include "components/site_engagement/content/site_engagement_helper.h"
#include "components/site_engagement/content/site_engagement_service.h"
#include "content/public/browser/keyboard_event_processing_result.h"
#include "content/public/browser/render_frame_host.h"
#include "content/public/browser/render_widget_host_view.h"
#include "third_party/blink/public/common/associated_interfaces/associated_interface_provider.h"
#include "ui/base/models/menu_model.h"
#include "ui/gfx/geometry/rounded_corners_f.h"
#include "ui/gfx/geometry/size.h"

#include <utility>

#include "components/sessions/content/session_tab_helper.h"
#include "components/site_engagement/content/site_engagement_helper.h"
#include "content/public/browser/web_contents.h"
#include "content/public/browser/web_contents_delegate.h"
#include "content/public/browser/web_contents_observer.h"

// The buble delegate doesnt allow to open popups and we use
// the Browser window delegate to redirect opening new popup content
// to the Browser delegate instead of default one.
// In order to close all popups we also save tab ids of each opened popup window
// and close all with the bubble together.
#define PrimaryPageChanged                                                    \
  SetWebContentsAddNewContentsDelegate(                                       \
      base::WeakPtr<content::WebContentsDelegate> browser_delegate) {         \
    browser_delegate_ = std::move(browser_delegate);                          \
  }                                                                           \
  content::WebContents* WebUIContentsWrapper::AddNewContents(                 \
      content::WebContents* source,                                           \
      std::unique_ptr<content::WebContents> new_contents,                     \
      const GURL& target_url, WindowOpenDisposition disposition,              \
      const blink::mojom::WindowFeatures& window_features, bool user_gesture, \
      bool* was_blocked) {                                                    \
    if (!browser_delegate_) {                                                 \
      return nullptr;                                                         \
    }                                                                         \
    auto* raw_popup_contents = new_contents.get();                            \
    auto* contents = browser_delegate_->AddNewContents(                       \
        source, std::move(new_contents), target_url,                          \
        WindowOpenDisposition::NEW_POPUP, window_features, user_gesture,      \
        was_blocked);                                                         \
    auto tab_id =                                                             \
        sessions::SessionTabHelper::IdForTab(raw_popup_contents).id();        \
    popup_ids_.push_back(tab_id);                                             \
    return contents;                                                          \
  }                                                                           \
  void WebUIContentsWrapper::ClearPopupIds() {                                \
    popup_ids_.clear();                                                       \
  }                                                                           \
  void WebUIContentsWrapper::PrimaryPageChanged

#include "src/chrome/browser/ui/webui/top_chrome/webui_contents_wrapper.cc"
#undef PrimaryPageChanged
