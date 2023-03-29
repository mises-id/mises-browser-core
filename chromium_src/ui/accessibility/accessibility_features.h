#ifndef MISES_UI_ACCESSIBILITY_ACCESSIBILITY_FEATURES_H_
#define MISES_UI_ACCESSIBILITY_ACCESSIBILITY_FEATURES_H_

#include "src/ui/accessibility/accessibility_features.h"

namespace features {

#if BUILDFLAG(IS_ANDROID)
AX_BASE_EXPORT extern const base::Feature kReadAnything;

// Returns true if read anything is enabled. This feature shows users websites,
// such as articles, in a comfortable reading experience in a side panel.
AX_BASE_EXPORT bool IsReadAnythingEnabled();

AX_BASE_EXPORT extern const base::Feature kReadAnythingWithScreen2x;

// Returns true if read anything is enabled with screen2x integration, which
// distills web pages using an ML model.
AX_BASE_EXPORT bool IsReadAnythingWithScreen2xEnabled();

// Enables using Screen AI library to add metadata for accessibility tools.
AX_BASE_EXPORT extern const base::Feature kScreenAI;

// Returns true if Screen AI Visual Annotations feature is enabled. This feature
// uses a local machine intelligence library to process browser screenshots and
// add metadata to the accessibility tree.
AX_BASE_EXPORT bool IsScreenAIVisualAnnotationsEnabled();

// Returns true if Screen AI Service is needed as either
// ScreenAIVisualAnnotations or ReadAnythingWithScreen2x are enabled.
AX_BASE_EXPORT bool IsScreenAIServiceNeeded();

// If enabled, ScreenAI library writes some debug data in /tmp.
AX_BASE_EXPORT bool IsScreenAIDebugModeEnabled();

// Enables a feature whereby inaccessible (i.e. untagged) PDFs are made
// accessible using an optical character recognition service. Due to the size of
// the OCR component, this feature targets desktop versions of Chrome for now.
AX_BASE_EXPORT extern const base::Feature kPdfOcr;

// Returns true if OCR will be performed on inaccessible (i.e. untagged) PDFs
// and the resulting text, together with its layout information, will be added
// to the accessibility tree.
AX_BASE_EXPORT bool IsPdfOcrEnabled();

// Enables a setting that can turn on/off browser vocalization of 'descriptions'
// tracks.
AX_BASE_EXPORT extern const base::Feature kTextBasedAudioDescription;

// Returns true if the setting to turn on text based audio descriptions is
// enabled.
AX_BASE_EXPORT bool IsTextBasedAudioDescriptionEnabled();
#endif  // !BUILDFLAG(IS_ANDROID)

}  // namespace features

#endif  // UI_ACCESSIBILITY_ACCESSIBILITY_FEATURES_H_
