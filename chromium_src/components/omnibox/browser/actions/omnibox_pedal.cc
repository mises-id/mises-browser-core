#include "src/components/omnibox/browser/actions/omnibox_pedal.cc"

#if !defined(SUPPORT_PEDALS_VECTOR_ICONS)

#include "ui/gfx/paint_vector_icon.h"
const gfx::VectorIcon& OmniboxPedal::GetDefaultVectorIcon() {
  return gfx::kNoneIcon;
}

#endif

