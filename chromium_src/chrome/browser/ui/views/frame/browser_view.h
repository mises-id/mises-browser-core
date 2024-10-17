#ifndef MISES_BROWSER_UI_VIEWS_FRAME_BROWSER_VIEW_H_
#define MISES_BROWSER_UI_VIEWS_FRAME_BROWSER_VIEW_H_

#include "chrome/browser/ui/browser_window.h"

#if BUILDFLAG(IS_ANDROID)
#define HighEfficiencyOptInIPHController HighEfficiencyOptInIPHController_Mises
#define GetDownloadBubbleUIController GetDownloadBubbleUIController_Chromium();\
   DownloadBubbleUIController* GetDownloadBubbleUIController
#define ShouldHideUIForFullscreen ShouldHideUIForFullscreen_Chromium() const;\
   bool ShouldHideUIForFullscreen
class HighEfficiencyOptInIPHController_Mises;
#endif
#include "src/chrome/browser/ui/views/frame/browser_view.h"
#if BUILDFLAG(IS_ANDROID)
#undef GetDownloadBubbleUIController
#undef MemorySaverOptInIPHController
#undef ShouldHideUIForFullscreen
#endif

#endif  // CHROME_BROWSER_UI_VIEWS_FRAME_BROWSER_VIEW_H_