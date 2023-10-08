/* Copyright (c) 2019 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "mises/browser/ui/browser_commands.h"

#include <string>

#include "base/files/file_path.h"
#include "chrome/browser/browser_process.h"
#include "chrome/browser/profiles/profile.h"
#include "chrome/browser/profiles/profile_manager.h"
#include "chrome/browser/profiles/profile_metrics.h"
#include "chrome/browser/profiles/profile_window.h"
#include "chrome/browser/ui/browser.h"
#include "chrome/browser/ui/browser_commands.h"
#include "chrome/browser/ui/browser_tabstrip.h"
#include "chrome/browser/ui/profile_picker.h"
#include "chrome/browser/ui/tabs/tab_enums.h"
#include "chrome/browser/ui/tabs/tab_strip_model.h"
#include "chrome/browser/ui/tabs/tab_utils.h"
#include "chrome/browser/ui/browser_list.h"
#include "chrome/common/pref_names.h"
#include "content/public/browser/browser_thread.h"
#include "content/public/browser/web_contents.h"
#include "ui/base/clipboard/clipboard_buffer.h"
#include "ui/base/clipboard/scoped_clipboard_writer.h"

#include "mises/browser/brave_wallet/brave_wallet_tab_helper.h"
#include "mises/components/brave_wallet/browser/brave_wallet_utils.h"
#include "mises/browser/ui/webui/brave_wallet/wallet_common_ui.h"
#include "mises/components/brave_wallet/browser/pref_names.h"
#include "mises/components/brave_wallet/common/features.h"
#include "mises/browser/brave_wallet/brave_wallet_provider_delegate_impl_helper.h"


using content::WebContents;


namespace mises {


void ShowWalletBubble(Browser* browser) {
// #if defined(TOOLKIT_VIEWS)
//   static_cast<BraveBrowserView*>(browser->window())->CreateWalletBubble();
// #endif
  brave_wallet::ShowPanel(brave_wallet::GetActiveWebContents());
}

void ShowApproveWalletBubble(Browser* browser) {
// #if defined(TOOLKIT_VIEWS)
//   static_cast<BraveBrowserView*>(browser->window())
//       ->CreateApproveWalletBubble();
// #endif
  brave_wallet::ShowApprovePanel(brave_wallet::GetActiveWebContents());
}

void CloseWalletBubble(Browser* browser) {
// #if defined(TOOLKIT_VIEWS)
//   static_cast<BraveBrowserView*>(browser->window())->CloseWalletBubble();
// #endif
 brave_wallet::ClosePanel(brave_wallet::GetActiveWebContents());
}

}  // namespace brave
