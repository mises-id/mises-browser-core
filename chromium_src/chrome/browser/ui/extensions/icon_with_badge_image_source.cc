#include "build/build_config.h"
#include "ui/gfx/geometry/rect.h"
#include "ui/gfx/geometry/rect_f.h"
#if BUILDFLAG(IS_ANDROID)
  #define ClampToCenteredSize(A) ClampToCenteredSize(A + A)
#endif 
#include "src/chrome/browser/ui/extensions/icon_with_badge_image_source.cc"