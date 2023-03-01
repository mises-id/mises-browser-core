
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
const char kChromeUIHistoryClustersSidePanelHost[] =
    "history-clusters-side-panel.top-chrome";
const char kChromeUIHistoryClustersSidePanelURL[] =
    "chrome://history-clusters-side-panel.top-chrome/";
const char kChromeUIReadAnythingSidePanelHost[] =
    "read-anything-side-panel.top-chrome";
const char kChromeUIReadAnythingSidePanelURL[] =
    "chrome://read-anything-side-panel.top-chrome/";
const char kChromeUIReadLaterHost[] = "read-later.top-chrome";
const char kChromeUIReadLaterURL[] = "chrome://read-later.top-chrome/";
const char kChromeUIUntrustedFeedURL[] = "chrome-untrusted://feed/";
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


}  // namespace chrome
