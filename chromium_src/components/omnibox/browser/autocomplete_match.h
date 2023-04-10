#include "build/build_config.h"
#include "device/vr/buildflags/buildflags.h"
#if (BUILDFLAG(IS_ANDROID) && !BUILDFLAG(ENABLE_VR))
#include "components/vector_icons/vector_icons.h"
#define UpdateJavaDescription UpdateJavaDescription_unused() {}\
  static const gfx::VectorIcon& AnswerTypeToAnswerIcon(int type);\
  const gfx::VectorIcon& GetVectorIcon(bool is_bookmark) const;\
  void UpdateJavaDescription

#include "src/components/omnibox/browser/autocomplete_match.h"

#undef UpdateJavaDescription

#else

#include "src/components/omnibox/browser/autocomplete_match.h"

#endif



