#ifndef MISES_BROWSER_UI_UI_FEATURES_H_
#define MISES_BROWSER_UI_UI_FEATURES_H_

#include "src/chrome/browser/ui/ui_features.h"

namespace features {

#if defined(ANDROID)
BASE_DECLARE_FEATURE(kAccessCodeCastUI);
#endif

#if BUILDFLAG(IS_ANDROID)
BASE_DECLARE_FEATURE(kPressAndHoldEscToExitBrowserFullscreen);
#endif

#if defined(ANDROID)
BASE_DECLARE_FEATURE(kSidePanelCompanionDefaultPinned);

BASE_DECLARE_FEATURE(kSidePanelPinning);

BASE_DECLARE_FEATURE(kSidePanelMinimumWidth);
extern const base::FeatureParam<int> kSidePanelMinimumWidthParameter;
int GetSidePanelMinimumWidth();
#endif

#if BUILDFLAG(IS_ANDROID)
BASE_DECLARE_FEATURE(kHaTSWebUI);
#endif

#if BUILDFLAG(IS_ANDROID)
BASE_DECLARE_FEATURE(kKeyboardAndPointerLockPrompt);
#endif

BASE_DECLARE_FEATURE(kToolbarPinning);
bool IsToolbarPinningEnabled();

}  // namespace features

#endif  // CHROME_BROWSER_UI_UI_FEATURES_H_
