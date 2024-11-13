#include "extensions/common/command.h"

#include <stddef.h>

#include "base/check.h"
#include "base/strings/string_number_conversions.h"
#include <string_view>
#include "base/strings/string_split.h"
#include "base/strings/string_util.h"
#include "base/strings/utf_string_conversions.h"
#include "base/values.h"
#include "build/build_config.h"
#include "extensions/common/error_utils.h"
#include "extensions/common/extension.h"
#include "extensions/common/manifest_constants.h"
#include "ui/base/accelerators/media_keys_listener.h"


#if BUILDFLAG(IS_ANDROID)

#undef BUILDFLAG_INTERNAL_IS_LINUX
#define BUILDFLAG_INTERNAL_IS_LINUX() (1)


#include "src/extensions/common/command.cc"
#undef BUILDFLAG_INTERNAL_IS_LINUX
#define BUILDFLAG_INTERNAL_IS_LINUX() (0)

#else

#include "src/extensions/common/command.cc"


#endif

