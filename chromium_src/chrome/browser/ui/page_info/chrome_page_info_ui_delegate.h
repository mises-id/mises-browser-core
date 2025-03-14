/* Copyright (c) 2021 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#ifndef MISES_CHROMIUM_SRC_CHROME_BROWSER_UI_PAGE_INFO_CHROME_PAGE_INFO_UI_DELEGATE_H_
#define MISES_CHROMIUM_SRC_CHROME_BROWSER_UI_PAGE_INFO_CHROME_PAGE_INFO_UI_DELEGATE_H_

#include "components/page_info/page_info_ui_delegate.h"

#if BUILDFLAG(IS_ANDROID)
#include "components/page_info/core/proto/about_this_site_metadata.pb.h"
#endif

#if !BUILDFLAG(IS_ANDROID)
#define ShouldShowAsk                     \
  AddIPFSTabForURL(const GURL& ipfs_url); \
  bool ShouldShowAsk

#else

#define ShouldShowAsk                     \
  AddIPFSTabForURL(const GURL& ipfs_url); \
  std::optional<page_info::proto::SiteInfo> GetAboutThisSiteInfo();\
  void OpenMoreAboutThisPageUrl(const GURL& url, const ui::Event& event);\
  bool ShouldShowSiteSettings(int* link_text_id, int* tooltip_text_id); \
  std::u16string GetPermissionDetail(ContentSettingsType type); \
  bool ShouldShowSettingsLinkForPermission(ContentSettingsType type,\
                                           int* text_id,\
                                           int* link_id);\
  void SettingsLinkClicked(ContentSettingsType type);\
  void ShowPrivacySandboxSettings();\
  bool IsBlockAutoPlayEnabled() override; \
  bool IsMultipleTabsOpen() override; \
  void OpenSiteSettingsFileSystem() override; \
  bool ShouldShowAsk

#endif

#include "src/chrome/browser/ui/page_info/chrome_page_info_ui_delegate.h"

#undef ShouldShowAsk

#endif  // MISES_CHROMIUM_SRC_CHROME_BROWSER_UI_PAGE_INFO_CHROME_PAGE_INFO_UI_DELEGATE_H_

