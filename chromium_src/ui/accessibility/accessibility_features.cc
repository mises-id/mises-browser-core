#include "src/ui/accessibility/accessibility_features.cc"

namespace features {

#if BUILDFLAG(IS_ANDROID)
// This feature can be used as an emergency kill switch to disable Screen AI
// main content extraction service in case of security or other issues.
// Please talk to components/services/screen_ai/OWNERS if any changes to this
// feature or its functionality is needed.
BASE_FEATURE(kEmergencyDisableScreenAIMainContentExtraction,
             "EmergencyDisableScreenAIMainContentExtraction",
             base::FEATURE_DISABLED_BY_DEFAULT);

// This feature can be used as an emergency kill switch to disable Screen AI
// OCR service in case of security or other issues.
// Please talk to components/services/screen_ai/OWNERS if any changes to this
// feature or its functionality is needed.
BASE_FEATURE(kEmergencyDisableScreenAIOCR,
             "EmergencyDisableScreenAIOCR",
             base::FEATURE_DISABLED_BY_DEFAULT);

BASE_FEATURE(kAccessibilityService,
             "AccessibilityService",
             base::FEATURE_DISABLED_BY_DEFAULT);
bool IsAccessibilityServiceEnabled() {
  return base::FeatureList::IsEnabled(::features::kAccessibilityService);
}

// This feature is only used for generating training data for Screen2x and
// should never be used in any other circumstance, and should not be enabled by
// default.
BASE_FEATURE(kDataCollectionModeForScreen2x,
             "DataCollectionModeForScreen2x",
             base::FEATURE_DISABLED_BY_DEFAULT);
bool IsDataCollectionModeForScreen2xEnabled() {
  return base::FeatureList::IsEnabled(
      ::features::kDataCollectionModeForScreen2x);
}

BASE_FEATURE(kLayoutExtraction,
             "LayoutExtraction",
             base::FEATURE_DISABLED_BY_DEFAULT);
bool IsLayoutExtractionEnabled() {
  return base::FeatureList::IsEnabled(::features::kLayoutExtraction);
}

BASE_FEATURE(kPdfOcr,
             "PdfOcr",
#if BUILDFLAG(IS_CHROMEOS)
             base::FEATURE_ENABLED_BY_DEFAULT
#else
             base::FEATURE_DISABLED_BY_DEFAULT
#endif  // BUILDFLAG(IS_CHROMEOS)
);

bool IsPdfOcrEnabled() {
  return base::FeatureList::IsEnabled(::features::kPdfOcr) &&
         !base::FeatureList::IsEnabled(
             ::features::kEmergencyDisableScreenAIOCR);
}

BASE_FEATURE(kReadAnything, "ReadAnything", base::FEATURE_ENABLED_BY_DEFAULT);
bool IsReadAnythingEnabled() {
  return base::FeatureList::IsEnabled(::features::kReadAnything);
}

BASE_FEATURE(kReadAnythingLocalSidePanel,
             "ReadAnythingLocalSidePanel",
             base::FEATURE_DISABLED_BY_DEFAULT);
bool IsReadAnythingLocalSidePanelEnabled() {
  return base::FeatureList::IsEnabled(::features::kReadAnythingLocalSidePanel);
}

BASE_FEATURE(kReadAnythingOmniboxIcon,
             "ReadAnythingOmniboxIcon",
             base::FEATURE_DISABLED_BY_DEFAULT);
bool IsReadAnythingOmniboxIconEnabled() {
  return base::FeatureList::IsEnabled(::features::kReadAnythingOmniboxIcon);
}

BASE_FEATURE(kReadAnythingReadAloud,
             "ReadAnythingReadAloud",
             base::FEATURE_DISABLED_BY_DEFAULT);
bool IsReadAnythingReadAloudEnabled() {
  return base::FeatureList::IsEnabled(::features::kReadAnythingReadAloud);
}

BASE_FEATURE(kReadAnythingWebUIToolbar,
             "ReadAnythingWebUIToolbar",
             base::FEATURE_DISABLED_BY_DEFAULT);
bool IsReadAnythingWebUIToolbarEnabled() {
  return base::FeatureList::IsEnabled(::features::kReadAnythingWebUIToolbar);
}

BASE_FEATURE(kReadAnythingWithScreen2x,
             "ReadAnythingWithScreen2x",
             base::FEATURE_ENABLED_BY_DEFAULT);
bool IsReadAnythingWithScreen2xEnabled() {
  return base::FeatureList::IsEnabled(::features::kReadAnythingWithScreen2x) &&
         !base::FeatureList::IsEnabled(
             ::features::kEmergencyDisableScreenAIMainContentExtraction);
}

BASE_FEATURE(kReadAnythingWithAlgorithm,
             "ReadAnythingWithAlgorithm",
             base::FEATURE_ENABLED_BY_DEFAULT);
bool IsReadAnythingWithAlgorithmEnabled() {
  return base::FeatureList::IsEnabled(::features::kReadAnythingWithAlgorithm);
}

// This feature is only for debug purposes and for security/privacy reasons,
// should be never enabled by default .
BASE_FEATURE(kScreenAIDebugMode,
             "ScreenAIDebugMode",
             base::FEATURE_DISABLED_BY_DEFAULT);
bool IsScreenAIDebugModeEnabled() {
  return base::FeatureList::IsEnabled(::features::kScreenAIDebugMode);
}

#endif  // !BUILDFLAG(IS_ANDROID)

}  // namespace features
