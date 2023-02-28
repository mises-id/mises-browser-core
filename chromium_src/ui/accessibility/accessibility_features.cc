#include "src/ui/accessibility/accessibility_features.cc"

namespace features {

#if BUILDFLAG(IS_ANDROID)
const base::Feature kReadAnything{"ReadAnything",
                                  base::FEATURE_DISABLED_BY_DEFAULT};

bool IsReadAnythingEnabled() {
  return base::FeatureList::IsEnabled(::features::kReadAnything);
}

const base::Feature kReadAnythingWithScreen2x{
    "ReadAnythingWithScreen2x", base::FEATURE_DISABLED_BY_DEFAULT};

bool IsReadAnythingWithScreen2xEnabled() {
  return base::FeatureList::IsEnabled(::features::kReadAnythingWithScreen2x);
}

const base::Feature kScreenAI{"ScreenAI", base::FEATURE_DISABLED_BY_DEFAULT};

bool IsScreenAIVisualAnnotationsEnabled() {
  return base::FeatureList::IsEnabled(::features::kScreenAI);
}

bool IsScreenAIServiceNeeded() {
  return IsPdfOcrEnabled() || IsScreenAIVisualAnnotationsEnabled() ||
         IsReadAnythingWithScreen2xEnabled();
}

// This feature is only for debug purposes and for security/privacy reasons,
// should be never enabled by default .
const base::Feature kScreenAIDebugMode{"ScreenAIDebugMode",
                                       base::FEATURE_DISABLED_BY_DEFAULT};

bool IsScreenAIDebugModeEnabled() {
  return base::FeatureList::IsEnabled(::features::kScreenAIDebugMode);
}

const base::Feature kPdfOcr{"PdfOcr", base::FEATURE_DISABLED_BY_DEFAULT};

bool IsPdfOcrEnabled() {
  return base::FeatureList::IsEnabled(::features::kPdfOcr);
}

const base::Feature kTextBasedAudioDescription{
    "TextBasedAudioDescription", base::FEATURE_DISABLED_BY_DEFAULT};

bool IsTextBasedAudioDescriptionEnabled() {
  return base::FeatureList::IsEnabled(::features::kTextBasedAudioDescription);
}
#endif  // !BUILDFLAG(IS_ANDROID)

}  // namespace features
