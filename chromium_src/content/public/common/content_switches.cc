#include "src/content/public/common/content_switches.cc"

namespace switches {

#if BUILDFLAG(IS_ANDROID) 
const char kSharedArrayBufferUnrestrictedAccessAllowed[] =
    "shared-array-buffer-unrestricted-access-allowed";
#endif


}  // namespace switches
