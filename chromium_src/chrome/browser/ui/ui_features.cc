#include "src/chrome/browser/ui/ui_features.cc"


namespace features {

#if defined(ANDROID) 
// Enables "Access Code Cast" UI.
BASE_FEATURE(kAccessCodeCastUI,
             "AccessCodeCastUI",
             base::FEATURE_ENABLED_BY_DEFAULT);
#endif

#if BUILDFLAG(IS_ANDROID)
BASE_FEATURE(kPressAndHoldEscToExitBrowserFullscreen,
             "PressAndHoldEscToExitBrowserFullscreen",
             base::FEATURE_ENABLED_BY_DEFAULT
);
#endif

#if defined(ANDROID)
BASE_FEATURE(kSidePanelCompanionDefaultPinned,
             "SidePanelCompanionDefaultPinned",
             base::FEATURE_DISABLED_BY_DEFAULT);

BASE_FEATURE(kSidePanelPinning,
             "SidePanelPinning",
             base::FEATURE_DISABLED_BY_DEFAULT);

BASE_FEATURE(kSidePanelMinimumWidth,
             "SidePanelMinimumWidth",
             base::FEATURE_DISABLED_BY_DEFAULT);
const base::FeatureParam<int> kSidePanelMinimumWidthParameter{
    &kSidePanelMinimumWidth, "minPanelWidth", 360};
int GetSidePanelMinimumWidth() {
  if (base::FeatureList::IsEnabled(kSidePanelMinimumWidth)) {
    return kSidePanelMinimumWidthParameter.Get();
  }

  // This is the default value used without this feature.
  return 320;
}

#endif

#if BUILDFLAG(IS_ANDROID)
// Enables or disables the Happiness Tracking Surveys being delivered via chrome
// webui, rather than a separate static website.
BASE_FEATURE(kHaTSWebUI, "HaTSWebUI", base::FEATURE_DISABLED_BY_DEFAULT);
#endif  // !BUILDFLAG(IS_ANDROID)

}  // namespace features
