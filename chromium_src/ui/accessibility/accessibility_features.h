#ifndef MISES_UI_ACCESSIBILITY_ACCESSIBILITY_FEATURES_H_
#define MISES_UI_ACCESSIBILITY_ACCESSIBILITY_FEATURES_H_

#include "src/ui/accessibility/accessibility_features.h"

namespace features {

#if BUILDFLAG(IS_ANDROID)
// Use the experimental Accessibility Service.
// TODO(katydek): Provide a more descriptive name here.
AX_BASE_EXPORT BASE_DECLARE_FEATURE(kAccessibilityService);
AX_BASE_EXPORT bool IsAccessibilityServiceEnabled();

// Open Read Anything side panel when the browser is opened, and
// call distill after the navigation's load-complete event. (Note: The browser
// is only being opened to render one webpage, for the sake of generating
// training data for Screen2x data collection. The browser is intended to be
// closed by the user who launches Chrome once the first distill call finishes
// executing.)
//
// Note: This feature should be used along with 'ScreenAIDebugModeEnabled=true'
// and --no-sandbox.
AX_BASE_EXPORT BASE_DECLARE_FEATURE(kDataCollectionModeForScreen2x);
AX_BASE_EXPORT bool IsDataCollectionModeForScreen2xEnabled();

// Identify and annotate the main node of the AXTree where one was not already
// provided.
AX_BASE_EXPORT BASE_DECLARE_FEATURE(kMainNodeAnnotations);
AX_BASE_EXPORT bool IsMainNodeAnnotationsEnabled();

// Use OCR to make inaccessible (i.e. untagged) PDFs
// accessibility. (Note: Due to the size of the OCR component, this feature
// targets only desktop versions of Chrome for now.)
AX_BASE_EXPORT BASE_DECLARE_FEATURE(kPdfOcr);
AX_BASE_EXPORT bool IsPdfOcrEnabled();

// Show the Read Aloud feature in Read Anything.
AX_BASE_EXPORT BASE_DECLARE_FEATURE(kReadAnythingReadAloud);
AX_BASE_EXPORT bool IsReadAnythingReadAloudEnabled();

// Use automatic voice switching in the Read Aloud feature in Read Anything.
AX_BASE_EXPORT BASE_DECLARE_FEATURE(kReadAloudAutoVoiceSwitching);
AX_BASE_EXPORT bool IsReadAloudAutoVoiceSwitchingEnabled();

// Use automatic voice switching in the Read Aloud feature in Read Anything.
AX_BASE_EXPORT BASE_DECLARE_FEATURE(kReadAloudLanguagePackDownloading);
AX_BASE_EXPORT bool IsReadAloudLanguagePackDownloadingEnabled();

// Enable automatic word highlighting in Read Anything Read Aloud.
AX_BASE_EXPORT BASE_DECLARE_FEATURE(
    kReadAnythingReadAloudAutomaticWordHighlighting);
AX_BASE_EXPORT bool IsReadAnythingReadAloudAutomaticWordHighlightingEnabled();

// Enable phrase highlighting in Read Anything Read Aloud.
AX_BASE_EXPORT BASE_DECLARE_FEATURE(kReadAnythingReadAloudPhraseHighlighting);
AX_BASE_EXPORT bool IsReadAnythingReadAloudPhraseHighlightingEnabled();

// Use screen2x integration for Read Anything to distill web pages
// using an ML model.
AX_BASE_EXPORT BASE_DECLARE_FEATURE(kReadAnythingWithScreen2x);
AX_BASE_EXPORT bool IsReadAnythingWithScreen2xEnabled();

// Enable rules based algorithm for distilling content. Should be enabled by
// default.
AX_BASE_EXPORT BASE_DECLARE_FEATURE(kReadAnythingWithAlgorithm);
AX_BASE_EXPORT bool IsReadAnythingWithAlgorithmEnabled();

// Enable images to be distilled via algorithm. Should be disabled by
// default.
AX_BASE_EXPORT BASE_DECLARE_FEATURE(kReadAnythingImagesViaAlgorithm);
AX_BASE_EXPORT bool IsReadAnythingImagesViaAlgorithmEnabled();

// Enable Reading Mode to work on Google Docs. Should be disabled by default.
AX_BASE_EXPORT BASE_DECLARE_FEATURE(kReadAnythingDocsIntegration);
AX_BASE_EXPORT bool IsReadAnythingDocsIntegrationEnabled();

// Enable "load more" button to show at the end of Reading Mode panel.
// Should be disabled by default.
AX_BASE_EXPORT BASE_DECLARE_FEATURE(kReadAnythingDocsLoadMoreButton);
AX_BASE_EXPORT bool IsReadAnythingDocsLoadMoreButtonEnabled();

// Write some ScreenAI library debug data in /tmp.
AX_BASE_EXPORT BASE_DECLARE_FEATURE(kScreenAIDebugMode);
AX_BASE_EXPORT bool IsScreenAIDebugModeEnabled();

// ScreenAI library's Main Content Extraction service is enabled.
AX_BASE_EXPORT bool IsScreenAIMainContentExtractionEnabled();

// ScreenAI library's OCR service is enabled.
AX_BASE_EXPORT bool IsScreenAIOCREnabled();

// Enables to use the Screen AI component available for testing.
// If enabled, ScreenAI library will be loaded from //third_party/screen-ai.
AX_BASE_EXPORT BASE_DECLARE_FEATURE(kScreenAITestMode);
AX_BASE_EXPORT bool IsScreenAITestModeEnabled();

#endif  // !BUILDFLAG(IS_ANDROID)

}  // namespace features

#endif  // UI_ACCESSIBILITY_ACCESSIBILITY_FEATURES_H_
