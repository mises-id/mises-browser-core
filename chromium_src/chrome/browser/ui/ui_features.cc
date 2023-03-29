#include "src/chrome/browser/ui/ui_features.cc"


namespace features {

#if defined(ANDROID) 
// Enables "Access Code Cast" UI.
const base::Feature kAccessCodeCastUI{"AccessCodeCastUI",
                                      base::FEATURE_ENABLED_BY_DEFAULT};
#endif


}  // namespace features
