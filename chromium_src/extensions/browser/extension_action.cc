#include "extensions/common/constants.h"
#include "build/build_config.h"

#if BUILDFLAG(IS_ANDROID)
#define EXTENSION_ICON_BITTY EXTENSION_ICON_MEDIUM
#endif
#include "src/extensions/browser/extension_action.cc"


