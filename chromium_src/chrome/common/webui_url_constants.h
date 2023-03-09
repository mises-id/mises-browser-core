#ifndef MISES_COMMON_WEBUI_URL_CONSTANTS_H_
#define MISES_COMMON_WEBUI_URL_CONSTANTS_H_


#include "src/chrome/common/webui_url_constants.h"

namespace chrome {

#if BUILDFLAG(IS_ANDROID)
extern const char kChromeUIAppServiceInternalsHost[];
extern const char kChromeUINearbyInternalsHost[];
extern const char kChromeUINearbyInternalsURL[];
extern const char kChromeUIBookmarksSidePanelHost[];
extern const char kChromeUIBookmarksSidePanelURL[];
extern const char kChromeUICustomizeChromeSidePanelHost[];
extern const char kChromeUIHistoryClustersSidePanelHost[];
extern const char kChromeUIHistoryClustersSidePanelURL[];
extern const char kChromeUIReadAnythingSidePanelHost[];
extern const char kChromeUIReadAnythingSidePanelURL[];
extern const char kChromeUIReadLaterHost[];
extern const char kChromeUIReadLaterURL[];
extern const char kChromeUIUntrustedFeedURL[];
extern const char kChromeUIWebAppInternalsHost[];
extern const char kChromeUIWebUITestHost[];
#endif  // BUILDFLAG(IS_ANDROID)


#if BUILDFLAG(IS_ANDROID) 
extern const char kChromeUIDiscardsHost[];
extern const char kChromeUIDiscardsURL[];
#endif

#if BUILDFLAG(IS_ANDROID) 
extern const char kChromeUIWebAppSettingsURL[];
extern const char kChromeUIWebAppSettingsHost[];
#endif


#if BUILDFLAG(IS_ANDROID) 
extern const char kChromeUIBrowserSwitchHost[];
extern const char kChromeUIBrowserSwitchURL[];
extern const char kChromeUIEnterpriseProfileWelcomeHost[];
extern const char kChromeUIEnterpriseProfileWelcomeURL[];
extern const char kChromeUIProfileCustomizationHost[];
extern const char kChromeUIProfileCustomizationURL[];
extern const char kChromeUIProfilePickerHost[];
extern const char kChromeUIProfilePickerUrl[];
extern const char kChromeUIProfilePickerStartupQuery[];
#endif


#if BUILDFLAG(IS_ANDROID)
extern const char kChromeUICommanderHost[];
extern const char kChromeUICommanderURL[];
extern const char kChromeUIDownloadShelfHost[];
extern const char kChromeUIDownloadShelfURL[];
extern const char kChromeUITabSearchHost[];
extern const char kChromeUITabSearchURL[];
#endif


}  // namespace chrome

#endif  // CHROME_COMMON_WEBUI_URL_CONSTANTS_H_
