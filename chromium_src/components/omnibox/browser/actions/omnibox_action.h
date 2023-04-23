#include "build/build_config.h"
#include "device/vr/buildflags/buildflags.h"
#if (BUILDFLAG(IS_ANDROID) && !BUILDFLAG(ENABLE_VR))
#include "ui/gfx/paint_vector_icon.h"
#define TakesOverMatch TakesOverMatch_unused() const {return false;}\
  const gfx::VectorIcon& GetVectorIcon() const {return gfx::kNoneIcon;}\
  bool TakesOverMatch

#include "src/components/omnibox/browser/actions/omnibox_action.h"

#undef TakesOverMatch

#else

#include "src/components/omnibox/browser/actions/omnibox_action.h"

#endif

