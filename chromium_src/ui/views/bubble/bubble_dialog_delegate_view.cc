#include "ui/views/bubble/bubble_dialog_delegate_view.h"

#include <algorithm>
#include <set>
#include <utility>
#include <vector>

#include "base/functional/bind.h"
#include "base/memory/ptr_util.h"
#include "base/memory/raw_ptr.h"
#include "base/memory/weak_ptr.h"
#include "base/metrics/histogram_macros.h"
#include "build/build_config.h"
#include "build/chromeos_buildflags.h"
#include "ui/accessibility/ax_enums.mojom.h"
#include "ui/accessibility/ax_node_data.h"
#include "ui/accessibility/ax_role_properties.h"
#include "ui/base/class_property.h"
#include "ui/base/default_style.h"
#include "ui/base/metadata/metadata_impl_macros.h"
#include "ui/base/resource/resource_bundle.h"
#include "ui/color/color_id.h"
#include "ui/color/color_provider.h"
#include "ui/color/color_provider_manager.h"
#include "ui/compositor/layer.h"
#include "ui/compositor/layer_animation_element.h"
#include "ui/compositor/layer_animator.h"
#include "ui/display/screen.h"
#include "ui/gfx/color_utils.h"
#include "ui/gfx/geometry/rect.h"
#include "ui/gfx/geometry/rounded_corners_f.h"
#include "ui/gfx/geometry/vector2d_conversions.h"
#include "ui/views/bubble/bubble_frame_view.h"
#include "ui/views/layout/layout_manager.h"
#include "ui/views/layout/layout_provider.h"
#include "ui/views/style/platform_style.h"
#include "ui/views/view_class_properties.h"
#include "ui/views/widget/widget.h"
#include "ui/views/widget/widget_observer.h"

#if BUILDFLAG(IS_WIN)
#include "ui/base/win/shell.h"
#endif

#if BUILDFLAG(IS_MAC)
#include "ui/views/widget/widget_utils_mac.h"
#else
#include "ui/aura/window.h"
#include "ui/aura/window_observer.h"
#endif


#if BUILDFLAG(IS_ANDROID)

namespace views {

gfx::Size GetWindowSizeForClientSize(Widget* widget, const gfx::Size& size) {
  return size;
}

}
#undef BUILDFLAG_INTERNAL_IS_MAC
#define BUILDFLAG_INTERNAL_IS_MAC() (1)


#include "src/ui/views/bubble/bubble_dialog_delegate_view.cc"
#undef BUILDFLAG_INTERNAL_IS_MAC
#define BUILDFLAG_INTERNAL_IS_MAC() (0)

#else

#include "src/ui/views/bubble/bubble_dialog_delegate_view.cc"


#endif
