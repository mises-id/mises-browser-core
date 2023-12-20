#include "src/chrome/browser/ui/ui_features.cc"


namespace features {

#if defined(ANDROID) 
// Enables "Access Code Cast" UI.
BASE_FEATURE(kAccessCodeCastUI,
             "AccessCodeCastUI",
             base::FEATURE_ENABLED_BY_DEFAULT);
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


}  // namespace features
