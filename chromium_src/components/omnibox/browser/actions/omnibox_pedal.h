#include "build/build_config.h"
#include "device/vr/buildflags/buildflags.h"
#if (BUILDFLAG(IS_ANDROID) && !BUILDFLAG(ENABLE_VR))
#include "components/vector_icons/vector_icons.h"
#define SetNavigationUrl SetNavigationUrl_unused() {}\
  static const gfx::VectorIcon& GetDefaultVectorIcon();\
  void SetNavigationUrl

#include "src/components/omnibox/browser/actions/omnibox_pedal.h"

#undef SetNavigationUrl

#else

#include "src/components/omnibox/browser/actions/omnibox_pedal.h"

#endif

