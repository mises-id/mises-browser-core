#ifndef MISES_CONTENT_PUBLIC_COMMON_CONTENT_SWITCHES_H_
#define MISES_CONTENT_PUBLIC_COMMON_CONTENT_SWITCHES_H_

#include "src/content/public/common/content_switches.h"
#include "content/common/content_export.h"

namespace switches {
#if BUILDFLAG(IS_ANDROID)
CONTENT_EXPORT extern const char kSharedArrayBufferUnrestrictedAccessAllowed[];
#endif

}  // namespace switches

#endif  // CONTENT_PUBLIC_COMMON_CONTENT_SWITCHES_H_
