#ifndef MISES_COMMON_WEBUI_URL_CONSTANTS_H_
#define MISES_COMMON_WEBUI_URL_CONSTANTS_H_


#include "src/chrome/common/webui_url_constants.h"

namespace chrome {

#if BUILDFLAG(IS_ANDROID)
inline constexpr char kAdPrivacySubPagePath[] = "/adPrivacy";
inline constexpr char kChromeUIAppServiceInternalsHost[] =
    "app-service-internals";
inline constexpr char kChromeUIAppServiceInternalsURL[] =
    "chrome://app-service-internals";
inline constexpr char kChromeUIBookmarksSidePanelHost[] =
    "bookmarks-side-panel.top-chrome";
inline constexpr char kChromeUIBookmarksSidePanelURL[] =
    "chrome://bookmarks-side-panel.top-chrome/";
inline constexpr char kChromeUICustomizeChromeSidePanelHost[] =
    "customize-chrome-side-panel.top-chrome";
inline constexpr char kChromeUICustomizeChromeSidePanelURL[] =
    "chrome://customize-chrome-side-panel.top-chrome";
inline constexpr char kChromeUIHistoryClustersSidePanelHost[] =
    "history-clusters-side-panel.top-chrome";
inline constexpr char kChromeUIHistoryClustersSidePanelURL[] =
    "chrome://history-clusters-side-panel.top-chrome/";
inline constexpr char kChromeUILensHost[] = "lens";
inline constexpr char kChromeUILensSidePanelHost[] = "lens";
inline constexpr char kChromeUILensUntrustedSidePanelAPIURL[] =
    "chrome-untrusted://lens/side_panel/side_panel.html";
inline constexpr char kChromeUILensUntrustedSidePanelURL[] =
    "chrome-untrusted://lens/";
inline constexpr char kChromeUILensOverlayHost[] = "lens-overlay";
inline constexpr char kChromeUILensOverlayUntrustedURL[] =
    "chrome-untrusted://lens-overlay/";
inline constexpr char kChromeUILensUntrustedURL[] = "chrome-untrusted://lens/";
inline constexpr char kChromeUINearbyInternalsHost[] = "nearby-internals";
inline constexpr char kChromeUINearbyInternalsURL[] =
    "chrome://nearby-internals";
inline constexpr char kChromeUINearbyShareHost[] = "nearby";
inline constexpr char kChromeUINearbyShareURL[] = "chrome://nearby/";
inline constexpr char kChromeUIOnDeviceInternalsHost[] = "on-device-internals";
inline constexpr char kChromeUIReadLaterHost[] = "read-later.top-chrome";
inline constexpr char kChromeUIReadLaterURL[] =
    "chrome://read-later.top-chrome/";
inline constexpr char kChromeUISearchEngineChoiceHost[] =
    "search-engine-choice";
inline constexpr char kChromeUISearchEngineChoiceURL[] =
    "chrome://search-engine-choice";
inline constexpr char kChromeUITabSearchHost[] = "tab-search.top-chrome";
inline constexpr char kChromeUITabSearchURL[] =
    "chrome://tab-search.top-chrome/";
inline constexpr char kChromeUIUntrustedCompanionSidePanelHost[] =
    "companion-side-panel.top-chrome";
inline constexpr char kChromeUIUntrustedCompanionSidePanelURL[] =
    "chrome-untrusted://companion-side-panel.top-chrome/";
inline constexpr char kChromeUIUntrustedFeedURL[] = "chrome-untrusted://feed/";
inline constexpr char kChromeUIUntrustedHatsHost[] = "hats";
inline constexpr char kChromeUIUntrustedHatsURL[] = "chrome-untrusted://hats/";
inline constexpr char kChromeUIUntrustedReadAnythingSidePanelHost[] =
    "read-anything-side-panel.top-chrome";
inline constexpr char kChromeUIUntrustedReadAnythingSidePanelURL[] =
    "chrome-untrusted://read-anything-side-panel.top-chrome/";
inline constexpr char kChromeUIUntrustedWebUITestURL[] =
    "chrome-untrusted://webui-test/";
inline constexpr char kChromeUIWebAppInternalsHost[] = "web-app-internals";
inline constexpr char kChromeUIWebAppInternalsURL[] =
    "chrome://web-app-internals";
inline constexpr char kChromeUIWebUITestHost[] = "webui-test";
inline constexpr char kCookiesSubPagePath[] = "/cookies";
inline constexpr char kTrackingProtectionSubPagePath[] = "/trackingProtection";
#endif  // BUILDFLAG(IS_ANDROID)


#if BUILDFLAG(IS_ANDROID) 
inline constexpr char kChromeUIDiscardsHost[] = "discards";
inline constexpr char kChromeUIDiscardsURL[] = "chrome://discards/";
#endif

#if BUILDFLAG(IS_ANDROID) 
inline constexpr char kChromeUIWebAppSettingsHost[] = "app-settings";
inline constexpr char kChromeUIWebAppSettingsURL[] = "chrome://app-settings/";
inline constexpr char kChromeUIWhatsNewHost[] = "whats-new";
inline constexpr char kChromeUIWhatsNewURL[] = "chrome://whats-new/";
#endif


#if BUILDFLAG(IS_ANDROID) 
inline constexpr char kChromeUIBrowserSwitchHost[] = "browser-switch";
inline constexpr char kChromeUIBrowserSwitchURL[] = "chrome://browser-switch/";
inline constexpr char kChromeUIIntroDefaultBrowserSubPage[] = "default-browser";
inline constexpr char kChromeUIIntroDefaultBrowserURL[] =
    "chrome://intro/default-browser";
inline constexpr char kChromeUIIntroHost[] = "intro";
inline constexpr char kChromeUIIntroURL[] = "chrome://intro";
inline constexpr char kChromeUIManagedUserProfileNoticeHost[] =
    "managed-user-profile-notice";
inline constexpr char kChromeUIManagedUserProfileNoticeUrl[] =
    "chrome://managed-user-profile-notice/";
inline constexpr char kChromeUIProfileCustomizationHost[] =
    "profile-customization";
inline constexpr char kChromeUIProfileCustomizationURL[] =
    "chrome://profile-customization";
inline constexpr char kChromeUIProfilePickerHost[] = "profile-picker";
inline constexpr char kChromeUIProfilePickerStartupQuery[] = "startup";
inline constexpr char kChromeUIProfilePickerUrl[] = "chrome://profile-picker/";
#endif




}  // namespace chrome

#endif  // CHROME_COMMON_WEBUI_URL_CONSTANTS_H_
