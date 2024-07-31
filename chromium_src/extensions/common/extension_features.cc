#include "src/extensions/common/extension_features.cc"


#include "base/feature_override.h"


namespace extensions_features {

#if BUILDFLAG(IS_IOS) || BUILDFLAG(IS_ANDROID)
OVERRIDE_FEATURE_DEFAULT_STATES({{
    {kExtensionsZipFileInstalledInProfileDir, base::FEATURE_DISABLED_BY_DEFAULT},
}});
#endif


}  // namespace segmentation_platform::features


