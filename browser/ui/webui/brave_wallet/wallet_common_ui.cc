/* Copyright (c) 2021 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "mises/browser/ui/webui/brave_wallet/wallet_common_ui.h"

#include <memory>

#include "base/version.h"
#include "mises/browser/brave_wallet/blockchain_images_source.h"
#include "mises/components/brave_wallet/browser/brave_wallet_constants.h"
#include "mises/components/brave_wallet/browser/wallet_data_files_installer.h"
#include "mises/components/constants/webui_url_constants.h"
#include "chrome/browser/profiles/profile.h"
#if !BUILDFLAG(IS_ANDROID)
#include "chrome/browser/ui/browser.h"
#include "chrome/browser/ui/browser_list.h"
#include "chrome/browser/ui/tabs/tab_strip_model.h"
#include "chrome/browser/ui/webui/favicon_source.h"
#endif
#if BUILDFLAG(IS_ANDROID)
#include "chrome/browser/ui/android/tab_model/tab_model.h"
#include "chrome/browser/ui/android/tab_model/tab_model_list.h"
#include "content/public/browser/web_contents.h"
#include "chrome/browser/android/tab_android.h"
#endif

#include "components/favicon_base/favicon_url_parser.h"
#include "components/sessions/content/session_tab_helper.h"
#include "third_party/abseil-cpp/absl/types/optional.h"
#include "url/gurl.h"
#include "url/origin.h"

namespace brave_wallet {

void AddBlockchainTokenImageSource(Profile* profile) {
#if !BUILDFLAG(IS_ANDROID)
  content::URLDataSource::Add(
      profile, std::make_unique<FaviconSource>(
                   profile, chrome::FaviconUrlFormat::kFavicon2));
#endif
  base::FilePath path = profile->GetPath().DirName();
  path = path.AppendASCII(brave_wallet::kWalletBaseDirectory);
  content::URLDataSource::Add(
      profile, std::make_unique<brave_wallet::BlockchainImagesSource>(path));
}

bool IsBraveWalletOrigin(const url::Origin& origin) {
  return origin == url::Origin::Create(GURL(kBraveUIWalletPanelURL)) ||
         origin == url::Origin::Create(GURL(kBraveUIWalletPageURL));
}

content::WebContents* GetWebContentsFromTabId(Browser** browser,
                                              int32_t tab_id) {
#if !BUILDFLAG(IS_ANDROID)
  for (auto* target_browser : *BrowserList::GetInstance()) {
    TabStripModel* tab_strip_model = target_browser->tab_strip_model();
    for (int index = 0; index < tab_strip_model->count(); ++index) {
      content::WebContents* contents = tab_strip_model->GetWebContentsAt(index);
      if (sessions::SessionTabHelper::IdForTab(contents).id() == tab_id) {
        if (browser)
          *browser = target_browser;
        return contents;
      }
    }
  }
#endif
  return nullptr;
}

#if BUILDFLAG(IS_ANDROID)
content::WebContents* GetActiveWebContentsAndroid() {
  content::WebContents* contents = NULL;
  TabModel *tab_strip = nullptr;
  if (!TabModelList::models().empty())
    tab_strip = *(TabModelList::models().begin());
  if (tab_strip) {
    for (int i = 0; i < tab_strip->GetTabCount(); ++i) {
        int openingTab = (tab_strip->GetLastNonExtensionActiveIndex());
        if (openingTab == -1)
          openingTab = 0;

        if (i != openingTab)
          continue;

        contents = tab_strip->GetWebContentsAt(i);
    }
  }
  return contents;
}
#endif

content::WebContents* GetActiveWebContents() {
#if !BUILDFLAG(IS_ANDROID)
  return BrowserList::GetInstance()
      ->GetLastActive()
      ->tab_strip_model()
      ->GetActiveWebContents();
#else
  return GetActiveWebContentsAndroid();
#endif
}

}  // namespace brave_wallet
