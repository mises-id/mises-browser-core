/* Copyright (c) 2021 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#ifndef MISES_CHROMIUM_SRC_CHROME_BROWSER_UI_PAGE_INFO_CHROME_PAGE_INFO_UI_DELEGATE_H_
#define MISES_CHROMIUM_SRC_CHROME_BROWSER_UI_PAGE_INFO_CHROME_PAGE_INFO_UI_DELEGATE_H_

#include "components/page_info/page_info_ui_delegate.h"

#define ShouldShowAsk                     \
  AddIPFSTabForURL(const GURL& ipfs_url); \
  bool ShouldShowAsk

#include "src/chrome/browser/ui/page_info/chrome_page_info_ui_delegate.h"

#undef ShouldShowAsk

#endif  // MISES_CHROMIUM_SRC_CHROME_BROWSER_UI_PAGE_INFO_CHROME_PAGE_INFO_UI_DELEGATE_H_
class ChromePageInfoUiDelegate : public PageInfoUiDelegate {
 public:
  ChromePageInfoUiDelegate(content::WebContents* web_contents,
                           const GURL& site_url);
  ~ChromePageInfoUiDelegate() override = default;

  // Whether the combobox option for allowing a permission should be shown for
  // `type`.
  bool ShouldShowAllow(ContentSettingsType type);

  // Whether the combobox option to ask a permission should be shown for `type`.
  bool   AddIPFSTabForURL(const GURL& ipfs_url);
  bool ShouldShowAsk(ContentSettingsType type);

  // If "allow" option is not available, return the reason why.
  std::u16string GetAutomaticallyBlockedReason(ContentSettingsType type);

  // Returns "About this site" info for the active page.
  absl::optional<page_info::proto::SiteInfo> GetAboutThisSiteInfo();

  // Opens the source URL in a new tab.
  void AboutThisSiteSourceClicked(GURL url, const ui::Event& event);

  // Handles opening the "More about this page" URL in a new tab.
  void OpenMoreAboutThisPageUrl(const GURL& url, const ui::Event& event);

#if true || !BUILDFLAG(IS_ANDROID)
  // If PageInfo should show a link to the site or app's settings page, this
  // will return true and set the params to the appropriate resource IDs (IDS_*).
  // Otherwise, it will return false.
  bool ShouldShowSiteSettings(int* link_text_id, int* tooltip_text_id);

  // The returned string, if non-empty, should be added as a sublabel that gives
  // extra details to the user concerning the granted permission.
  std::u16string GetPermissionDetail(ContentSettingsType type);

  // Opens Privacy Sandbox's "Ad Personalzation" settings page.
  void ShowPrivacySandboxAdPersonalization();

  // PageInfoUiDelegate implementation
  bool IsBlockAutoPlayEnabled() override;
  bool IsMultipleTabsOpen() override;
#endif  // !BUILDFLAG(IS_ANDROID)
  permissions::PermissionResult GetPermissionStatus(
      ContentSettingsType type) override;
  absl::optional<permissions::PermissionResult> GetEmbargoResult(
      ContentSettingsType type) override;

 private:
  Profile* GetProfile() const;

  raw_ptr<content::WebContents> web_contents_;
  GURL site_url_;
};

#endif  // CHROME_BROWSER_UI_PAGE_INFO_CHROME_PAGE_INFO_UI_DELEGATE_H_
