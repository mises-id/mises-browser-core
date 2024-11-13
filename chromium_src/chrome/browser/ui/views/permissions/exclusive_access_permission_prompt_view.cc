
#include "build/build_config.h"
#include "chrome/browser/ui/views/permissions/exclusive_access_permission_prompt_view.h"

#include "chrome/browser/platform_util.h"
#include "chrome/browser/ui/browser.h"
#include "chrome/browser/ui/browser_window.h"
#include "chrome/browser/ui/color/chrome_color_id.h"
#include "chrome/browser/ui/url_identity.h"
#include "chrome/browser/ui/views/chrome_layout_provider.h"
#include "chrome/browser/ui/views/chrome_widget_sublevel.h"
#include "chrome/grit/generated_resources.h"
#include "components/permissions/features.h"
#include "components/strings/grit/components_strings.h"
#include "components/vector_icons/vector_icons.h"
#include "ui/base/interaction/element_identifier.h"
#include "ui/base/l10n/l10n_util.h"
#include "ui/base/metadata/metadata_impl_macros.h"
#include "ui/gfx/paint_vector_icon.h"

#if BUILDFLAG(IS_ANDROID)
namespace permissions {
  static const gfx::VectorIcon& GetIconId_Mises(RequestType type) {
    return gfx::kNoneIcon; 
  }
}

#define GetIconId GetIconId_Mises

#endif

#include "src/chrome/browser/ui/views/permissions/exclusive_access_permission_prompt_view.cc"
