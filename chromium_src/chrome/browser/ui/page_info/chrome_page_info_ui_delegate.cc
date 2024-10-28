/* Copyright (c) 2021 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "chrome/browser/ui/page_info/chrome_page_info_ui_delegate.h"

#include "chrome/browser/ui/browser_finder.h"
#include "chrome/browser/ui/browser_tabstrip.h"

#if BUILDFLAG(IS_ANDROID)
#include "chrome/browser/extensions/window_controller_list.h"
#include "chrome/browser/ui/browser.h"
#include "chrome/browser/ui/browser_finder.h"
#include "chrome/browser/ui/tabs/tab_strip_model.h"
#include "chrome/browser/ui/web_applications/web_app_ui_utils.h"
#include "chrome/browser/page_info/about_this_site_service_factory.h"
#include "chrome/browser/ui/page_info/about_this_site_side_panel.h"
#endif


#include "src/chrome/browser/ui/page_info/chrome_page_info_ui_delegate.cc"

bool ChromePageInfoUiDelegate::AddIPFSTabForURL(const GURL& ipfs_url) {
#if !BUILDFLAG(IS_ANDROID)
  chrome::AddTabAt(chrome::FindLastActiveWithProfile(GetProfile()),
                   GURL(ipfs_url), -1, true);
  return true;
#else
  return false;
#endif  // !BUILDFLAG(IS_ANDROID)
}

#if BUILDFLAG(IS_ANDROID)
bool ChromePageInfoUiDelegate::ShouldShowSiteSettings(int* link_text_id,
                                                      int* tooltip_text_id) {
  if (GetProfile()->IsGuestSession())
    return false;

  if (web_app::GetLabelIdsForAppManagementLinkInPageInfo(
          web_contents_, link_text_id, tooltip_text_id)) {
    return true;
  }

  *link_text_id = IDS_PAGE_INFO_SITE_SETTINGS_LINK;
  *tooltip_text_id = IDS_PAGE_INFO_SITE_SETTINGS_TOOLTIP;

  return true;
}

// TODO(crbug.com/1227074): Reconcile with LastTabStandingTracker.
bool ChromePageInfoUiDelegate::IsMultipleTabsOpen() {
  const extensions::WindowControllerList::ControllerList& windows =
      extensions::WindowControllerList::GetInstance()->windows();
  int count = 0;
  auto site_origin = site_url_.DeprecatedGetOriginAsURL();
  for (extensions::WindowController* window : windows) {
    const Browser* const browser = window->GetBrowser();
    if (!browser)
      continue;
    const TabStripModel* const tabs = browser->tab_strip_model();
    DCHECK(tabs);
    for (int i = 0; i < tabs->count(); ++i) {
      content::WebContents* const web_contents = tabs->GetWebContentsAt(i);
      if (web_contents->GetLastCommittedURL().DeprecatedGetOriginAsURL() ==
          site_origin) {
        count++;
      }
    }
  }
  return count > 1;
}

std::u16string ChromePageInfoUiDelegate::GetPermissionDetail(
    ContentSettingsType type) {
  switch (type) {
    // TODO(crbug.com/1228243): Reconcile with SiteDetailsPermissionElement.
    case ContentSettingsType::ADS:
      return l10n_util::GetStringUTF16(IDS_PAGE_INFO_PERMISSION_ADS_SUBTITLE);
    default:
      return {};
  }
}

bool ChromePageInfoUiDelegate::IsBlockAutoPlayEnabled() {
  return GetProfile()->GetPrefs()->GetBoolean(prefs::kBlockAutoplayEnabled);
}


std::optional<page_info::proto::SiteInfo>
ChromePageInfoUiDelegate::GetAboutThisSiteInfo() {
  Browser* browser = chrome::FindBrowserWithTab(web_contents_);
  if (!browser || !browser->is_type_normal()) {
    // TODO(crbug.com/1435450): SidePanel is not available. Evaluate if we can
    //                          show ATP in a different way.
    return std::nullopt;
  }
  if (auto* service =
          AboutThisSiteServiceFactory::GetForProfile(GetProfile())) {
    return service->GetAboutThisSiteInfo(
        site_url_, web_contents_->GetPrimaryMainFrame()->GetPageUkmSourceId(),
        AboutThisSiteTabHelper::FromWebContents(web_contents_));
  }

  return std::nullopt;
}

void ChromePageInfoUiDelegate::SettingsLinkClicked(ContentSettingsType type) {
 
}

void ChromePageInfoUiDelegate::ShowPrivacySandboxSettings() {
  Browser* browser = chrome::FindBrowserWithTab(web_contents_);
  chrome::ShowPrivacySandboxSettings(browser);
}

void ChromePageInfoUiDelegate::OpenMoreAboutThisPageUrl(
    const GURL& url,
    const ui::Event& event) {
  DCHECK(page_info::IsAboutThisSiteFeatureEnabled());
  //ShowAboutThisSiteSidePanel(web_contents_, url);
}

void ChromePageInfoUiDelegate::OpenSiteSettingsFileSystem() {
  //chrome::ShowSiteSettingsFileSystem(GetProfile(), site_url_);
}

bool ChromePageInfoUiDelegate::ShouldShowSettingsLinkForPermission(
    ContentSettingsType type,
    int* text_id,
    int* link_id) {
  return false;
}
#endif