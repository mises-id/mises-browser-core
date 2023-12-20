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

// Use local MI service to make inaccessibile surfaces (e.g.
// canvases) accessible.
AX_BASE_EXPORT BASE_DECLARE_FEATURE(kLayoutExtraction);
AX_BASE_EXPORT bool IsLayoutExtractionEnabled();

// Use OCR to make inaccessible (i.e. untagged) PDFs
// accessibility. (Note: Due to the size of the OCR component, this feature
// targets only desktop versions of Chrome for now.)
AX_BASE_EXPORT BASE_DECLARE_FEATURE(kPdfOcr);
AX_BASE_EXPORT bool IsPdfOcrEnabled();

// Include the Read Anything feature. (Note: This feature shows
// users websites, such as articles, in a comfortable reading experience in a
// side panel)
AX_BASE_EXPORT BASE_DECLARE_FEATURE(kReadAnything);
AX_BASE_EXPORT bool IsReadAnythingEnabled();

// Make the Read Anything Side Panel local (don't persist when opening a new
// tab)
AX_BASE_EXPORT BASE_DECLARE_FEATURE(kReadAnythingLocalSidePanel);
AX_BASE_EXPORT bool IsReadAnythingLocalSidePanelEnabled();

// Show a reading mode icon in the omnibox.
AX_BASE_EXPORT BASE_DECLARE_FEATURE(kReadAnythingOmniboxIcon);
AX_BASE_EXPORT bool IsReadAnythingOmniboxIconEnabled();

// Show the Read Aloud feature in Read Anything.
AX_BASE_EXPORT BASE_DECLARE_FEATURE(kReadAnythingReadAloud);
AX_BASE_EXPORT bool IsReadAnythingReadAloudEnabled();

// Use the WebUI toolbar in Read Anything.
AX_BASE_EXPORT BASE_DECLARE_FEATURE(kReadAnythingWebUIToolbar);
AX_BASE_EXPORT bool IsReadAnythingWebUIToolbarEnabled();

// Use screen2x integration for Read Anything to distill web pages
// using an ML model.
AX_BASE_EXPORT BASE_DECLARE_FEATURE(kReadAnythingWithScreen2x);
AX_BASE_EXPORT bool IsReadAnythingWithScreen2xEnabled();

// Enable rules based algorithm for distilling content. Should be enabled by
// default.
AX_BASE_EXPORT BASE_DECLARE_FEATURE(kReadAnythingWithAlgorithm);
AX_BASE_EXPORT bool IsReadAnythingWithAlgorithmEnabled();

// Write some ScreenAI library debug data in /tmp.
AX_BASE_EXPORT BASE_DECLARE_FEATURE(kScreenAIDebugMode);
AX_BASE_EXPORT bool IsScreenAIDebugModeEnabled();
#endif  // !BUILDFLAG(IS_ANDROID)

}  // namespace features

#endif  // UI_ACCESSIBILITY_ACCESSIBILITY_FEATURES_H_
