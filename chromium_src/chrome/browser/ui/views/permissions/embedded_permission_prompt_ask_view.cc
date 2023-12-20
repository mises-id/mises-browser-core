#include "chrome/browser/ui/views/permissions/embedded_permission_prompt_ask_view.h"

#include "chrome/browser/ui/url_identity.h"
#include "chrome/grit/generated_resources.h"
#include "components/permissions/features.h"
#include "components/strings/grit/components_strings.h"
#include "components/vector_icons/vector_icons.h"
#include "ui/base/interaction/element_identifier.h"
#include "ui/base/l10n/l10n_util.h"
#include "ui/gfx/paint_vector_icon.h"

#include "build/build_config.h"
#if BUILDFLAG(IS_ANDROID)
namespace permissions {
  const gfx::VectorIcon& GetIconId_Mises(RequestType type) {
    return gfx::kNoneIcon; 
  }
}

#define GetIconId GetIconId_Mises

#endif
#include "src/chrome/browser/ui/views/permissions/embedded_permission_prompt_ask_view.cc"


