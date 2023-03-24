#ifndef MISES_BROWSER_UI_VIEWS_FRAME_BROWSER_VIEW_H_
#define MISES_BROWSER_UI_VIEWS_FRAME_BROWSER_VIEW_H_

#include "chrome/browser/ui/browser_window.h"
#include "chrome/browser/ui/performance_controls/high_efficiency_iph_controller.h"

#if BUILDFLAG(IS_ANDROID)
#define HighEfficiencyIPHController HighEfficiencyIPHController_Mises
#define GetDownloadBubbleUIController GetDownloadBubbleUIController_Chromium();\
   DownloadBubbleUIController* GetDownloadBubbleUIController
class HighEfficiencyIPHController_Mises;
#endif
#include "src/chrome/browser/ui/views/frame/browser_view.h"
#if BUILDFLAG(IS_ANDROID)
#undef GetDownloadBubbleUIController
#undef HighEfficiencyIPHController
#endif

#endif  // CHROME_BROWSER_UI_VIEWS_FRAME_BROWSER_VIEW_H_