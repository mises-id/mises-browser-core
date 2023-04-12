

#include "src/components/omnibox/browser/autocomplete_match.cc"

#if (BUILDFLAG(IS_ANDROID) && !BUILDFLAG(ENABLE_VR))
#include "ui/gfx/paint_vector_icon.h"
const gfx::VectorIcon& AutocompleteMatch::AnswerTypeToAnswerIcon(int type) {
  return gfx::kNoneIcon;
}
const gfx::VectorIcon& AutocompleteMatch::GetVectorIcon(bool is_bookmark) const {
  return gfx::kNoneIcon;
}


#endif



