#include "build/build_config.h"
#include "base/process/kill.h"
#if BUILDFLAG(IS_ANDROID)
#define TERMINATION_STATUS_MAX_ENUM \
     TERMINATION_STATUS_OOM_PROTECTED: \
       return "oom protected"; \
      case base::TERMINATION_STATUS_MAX_ENUM


#include "src/extensions/browser/guest_view/web_view/web_view_guest.cc"

#undef TERMINATION_STATUS_MAX_ENUM

#else 

#include "src/extensions/browser/guest_view/web_view/web_view_guest.cc"
#endif

