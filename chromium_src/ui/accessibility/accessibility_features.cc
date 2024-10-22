#include "src/ui/accessibility/accessibility_features.cc"

namespace features {

#if BUILDFLAG(IS_ANDROID)
bool IsScreenAIMainContentExtractionEnabled() {
  return base::FeatureList::IsEnabled(
      ax::mojom::features::kScreenAIMainContentExtractionEnabled);
}

bool IsScreenAIOCREnabled() {
  return base::FeatureList::IsEnabled(ax::mojom::features::kScreenAIOCREnabled);
}

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

BASE_FEATURE(kMainNodeAnnotations,
             "MainNodeAnnotations",
             base::FEATURE_DISABLED_BY_DEFAULT);
bool IsMainNodeAnnotationsEnabled() {
  return base::FeatureList::IsEnabled(::features::kMainNodeAnnotations);
}

// This feature has a 10% holdback to measure memory impact.
BASE_FEATURE(kPdfOcr, "PdfOcr", base::FEATURE_ENABLED_BY_DEFAULT);

bool IsPdfOcrEnabled() {
  return base::FeatureList::IsEnabled(::features::kPdfOcr);
}

BASE_FEATURE(kReadAnythingReadAloud,
             "ReadAnythingReadAloud",
             base::FEATURE_DISABLED_BY_DEFAULT);
bool IsReadAnythingReadAloudEnabled() {
  return base::FeatureList::IsEnabled(::features::kReadAnythingReadAloud);
}

BASE_FEATURE(kReadAloudAutoVoiceSwitching,
             "ReadAloudAutoVoiceSwitching",
             base::FEATURE_DISABLED_BY_DEFAULT);
bool IsReadAloudAutoVoiceSwitchingEnabled() {
  return IsReadAnythingReadAloudEnabled() &&
         base::FeatureList::IsEnabled(::features::kReadAloudAutoVoiceSwitching);
}

BASE_FEATURE(kReadAloudLanguagePackDownloading,
             "ReadAloudLanguagePackDownloading",
             base::FEATURE_DISABLED_BY_DEFAULT);
bool IsReadAloudLanguagePackDownloadingEnabled() {
  return IsReadAnythingReadAloudEnabled() &&
         base::FeatureList::IsEnabled(
             ::features::kReadAloudLanguagePackDownloading);
}

BASE_FEATURE(kReadAnythingReadAloudAutomaticWordHighlighting,
             "ReadAnythingReadAloudAutomaticWordHighlighting",
             base::FEATURE_DISABLED_BY_DEFAULT);
bool IsReadAnythingReadAloudAutomaticWordHighlightingEnabled() {
  return base::FeatureList::IsEnabled(::features::kReadAnythingReadAloud) &&
         base::FeatureList::IsEnabled(
             ::features::kReadAnythingReadAloudAutomaticWordHighlighting);
}

BASE_FEATURE(kReadAnythingReadAloudPhraseHighlighting,
             "ReadAnythingReadAloudPhraseHighlighting",
             base::FEATURE_DISABLED_BY_DEFAULT);
bool IsReadAnythingReadAloudPhraseHighlightingEnabled() {
  return base::FeatureList::IsEnabled(::features::kReadAnythingReadAloud) &&
         base::FeatureList::IsEnabled(
             ::features::kReadAnythingReadAloudPhraseHighlighting);
}

BASE_FEATURE(kReadAnythingWithScreen2x,
             "ReadAnythingWithScreen2x",
             base::FEATURE_ENABLED_BY_DEFAULT);
bool IsReadAnythingWithScreen2xEnabled() {
  return base::FeatureList::IsEnabled(::features::kReadAnythingWithScreen2x);
}

BASE_FEATURE(kReadAnythingWithAlgorithm,
             "ReadAnythingWithAlgorithm",
             base::FEATURE_ENABLED_BY_DEFAULT);
bool IsReadAnythingWithAlgorithmEnabled() {
  return base::FeatureList::IsEnabled(::features::kReadAnythingWithAlgorithm);
}

BASE_FEATURE(kReadAnythingImagesViaAlgorithm,
             "ReadAnythingImagesViaAlgorithm",
             base::FEATURE_DISABLED_BY_DEFAULT);
bool IsReadAnythingImagesViaAlgorithmEnabled() {
  return base::FeatureList::IsEnabled(
             ::features::kReadAnythingImagesViaAlgorithm) &&
         IsReadAnythingWithAlgorithmEnabled();
}

BASE_FEATURE(kReadAnythingDocsIntegration,
             "ReadAnythingDocsIntegration",
             base::FEATURE_DISABLED_BY_DEFAULT);
bool IsReadAnythingDocsIntegrationEnabled() {
  return base::FeatureList::IsEnabled(::features::kReadAnythingDocsIntegration);
}

BASE_FEATURE(kReadAnythingDocsLoadMoreButton,
             "ReadAnythingDocsLoadMoreButton",
             base::FEATURE_DISABLED_BY_DEFAULT);
bool IsReadAnythingDocsLoadMoreButtonEnabled() {
  return base::FeatureList::IsEnabled(
      ::features::kReadAnythingDocsLoadMoreButton);
}

// This feature is only for debug purposes and for security/privacy reasons,
// should be never enabled by default .
BASE_FEATURE(kScreenAIDebugMode,
             "ScreenAIDebugMode",
             base::FEATURE_DISABLED_BY_DEFAULT);
bool IsScreenAIDebugModeEnabled() {
  return base::FeatureList::IsEnabled(::features::kScreenAIDebugMode);
}

// This feature is only used in tests and must not be enabled by default.
BASE_FEATURE(kScreenAITestMode,
             "ScreenAITestMode",
             base::FEATURE_DISABLED_BY_DEFAULT);
bool IsScreenAITestModeEnabled() {
  return base::FeatureList::IsEnabled(::features::kScreenAITestMode);
}

#endif  // !BUILDFLAG(IS_ANDROID)

}  // namespace features
