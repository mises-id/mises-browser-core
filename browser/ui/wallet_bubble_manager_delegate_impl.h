/* Copyright (c) 2021 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#ifndef BRAVE_BROWSER_UI_WALLET_BUBBLE_MANAGER_DELEGATE_IMPL_H_
#define BRAVE_BROWSER_UI_WALLET_BUBBLE_MANAGER_DELEGATE_IMPL_H_

#include "mises/browser/ui/brave_wallet/wallet_bubble_manager_delegate.h"

#include <memory>
#include <vector>

#include "base/memory/raw_ptr.h"
#include "mises/browser/ui/webui/brave_wallet/wallet_panel_ui.h"
#include "url/gurl.h"

namespace brave_wallet {

class WalletWebUIBubbleManager;

class WalletBubbleManagerDelegateImpl : public WalletBubbleManagerDelegate {
 public:
  explicit WalletBubbleManagerDelegateImpl(content::WebContents* web_contents,
                                           const GURL& webui_url);
  WalletBubbleManagerDelegateImpl(const WalletBubbleManagerDelegateImpl&) =
      delete;
  WalletBubbleManagerDelegateImpl& operator=(
      const WalletBubbleManagerDelegateImpl&) = delete;
  ~WalletBubbleManagerDelegateImpl() override;

  void ShowBubble() override;
  void CloseBubble() override;
  bool IsShowingBubble() override;
  void CloseOnDeactivate(bool close) override;
  bool IsBubbleClosedForTesting() override;
  content::WebContents* GetWebContentsForTesting() override;
  const std::vector<int32_t>& GetPopupIdsForTesting() override;

 private:
  raw_ptr<content::WebContents> web_contents_ = nullptr;
  GURL webui_url_;
  std::unique_ptr<WalletWebUIBubbleManager> webui_bubble_manager_;
};

}  // namespace brave_wallet

#endif  // BRAVE_BROWSER_UI_WALLET_BUBBLE_MANAGER_DELEGATE_IMPL_H_
