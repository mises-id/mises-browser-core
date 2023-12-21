
#include "src/chrome/common/webui_url_constants.cc"


namespace chrome {

#if BUILDFLAG(IS_ANDROID)
const char kChromeUIAppServiceInternalsHost[] = "app-service-internals";
const char kChromeUINearbyInternalsHost[] = "nearby-internals";
const char kChromeUINearbyInternalsURL[] = "chrome://nearby-internals";
const char kChromeUIBookmarksSidePanelHost[] =
    "bookmarks-side-panel.top-chrome";
const char kChromeUIBookmarksSidePanelURL[] =
    "chrome://bookmarks-side-panel.top-chrome/";
const char kChromeUICustomizeChromeSidePanelHost[] =
    "customize-chrome-side-panel.top-chrome";
const char kChromeUICustomizeChromeSidePanelURL[] =
    "chrome://customize-chrome-side-panel.top-chrome";
const char kChromeUIHistoryClustersSidePanelHost[] =
    "history-clusters-side-panel.top-chrome";
const char kChromeUIHistoryClustersSidePanelURL[] =
    "chrome://history-clusters-side-panel.top-chrome/";
const char kChromeUIReadLaterHost[] = "read-later.top-chrome";
const char kChromeUIReadLaterURL[] = "chrome://read-later.top-chrome/";
const char kChromeUIUntrustedCompanionSidePanelHost[] =
    "companion-side-panel.top-chrome";
const char kChromeUIUntrustedCompanionSidePanelURL[] =
    "chrome-untrusted://companion-side-panel.top-chrome/";
const char kChromeUIUntrustedReadAnythingSidePanelHost[] =
    "read-anything-side-panel.top-chrome";
const char kChromeUIUntrustedReadAnythingSidePanelURL[] =
    "chrome-untrusted://read-anything-side-panel.top-chrome/";
const char kChromeUIUntrustedFeedURL[] = "chrome-untrusted://feed/";
const char kChromeUIUserNotesSidePanelHost[] =
    "user-notes-side-panel.top-chrome";
const char kChromeUIUserNotesSidePanelURL[] =
    "chrome://user-notes-side-panel.top-chrome/";
const char kChromeUIOmniboxPopupHost[] = "omnibox-popup.top-chrome";
const char kChromeUIOmniboxPopupURL[] = "chrome://omnibox-popup.top-chrome/";
const char kChromeUISuggestInternalsHost[] = "suggest-internals";
const char kChromeUISuggestInternalsURL[] = "chrome://suggest-internals/";
const char kChromeUIWebAppInternalsHost[] = "web-app-internals";
const char kChromeUIWebUITestHost[] = "webui-test";
#endif


#if BUILDFLAG(IS_ANDROID)
const char kChromeUICommanderHost[] = "commander";
const char kChromeUICommanderURL[] = "chrome://commander";
const char kChromeUIDownloadShelfHost[] = "download-shelf.top-chrome";
const char kChromeUIDownloadShelfURL[] = "chrome://download-shelf.top-chrome/";
const char kChromeUITabSearchHost[] = "tab-search.top-chrome";
const char kChromeUITabSearchURL[] = "chrome://tab-search.top-chrome/";
#endif


#if BUILDFLAG(IS_ANDROID)
const char kChromeUIUntrustedHatsHost[] = "hats";
const char kChromeUIUntrustedHatsURL[] = "chrome-untrusted://hats/";
#endif  // !BUILDFLAG(IS_ANDROID)

#if BUILDFLAG(IS_ANDROID)
const char kChromeUIOnDeviceInternalsHost[] = "on-device-internals";
const char kChromeUISearchEngineChoiceHost[] = "search-engine-choice";
const char kChromeUISearchEngineChoiceURL[] = "chrome://search-engine-choice";
#endif

}  // namespace chrome
