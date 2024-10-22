#include "build/build_config.h"
#if BUILDFLAG(IS_ANDROID)
#include "chrome/browser/ui/views/find_bar_host.h"

#include <algorithm>

#include "base/check_is_test.h"
#include "base/i18n/rtl.h"
#include "build/build_config.h"
#include "chrome/browser/ui/browser.h"
#include "chrome/browser/ui/find_bar/find_bar_controller.h"
#include "chrome/browser/ui/view_ids.h"
#include "chrome/browser/ui/views/find_bar_view.h"
#include "chrome/browser/ui/views/frame/browser_view.h"
#include "chrome/browser/ui/views/theme_copying_widget.h"
#include "components/find_in_page/find_tab_helper.h"
#include "components/find_in_page/find_types.h"
#include "components/strings/grit/components_strings.h"
#include "content/public/browser/render_view_host.h"
#include "content/public/browser/render_widget_host.h"
#include "content/public/browser/web_contents.h"
#include "content/public/browser/web_contents_user_data.h"
#include "ui/accessibility/ax_enums.mojom.h"
#include "ui/base/l10n/l10n_util.h"
#include "ui/compositor/layer.h"
#include "ui/events/event.h"
#include "ui/events/keycodes/keyboard_codes.h"
#include "ui/gfx/animation/slide_animation.h"
#include "ui/gfx/geometry/rect.h"
#include "ui/views/border.h"
#include "ui/views/focus/external_focus_tracker.h"
#include "ui/views/widget/root_view.h"
#include "ui/views/widget/widget.h"
#include "ui/views/widget/widget_delegate.h"

#include "components/input/native_web_keyboard_event.h"
namespace input {
  struct NativeWebKeyboardEvent_Mises : public NativeWebKeyboardEvent {
    explicit NativeWebKeyboardEvent_Mises(const ui::KeyEvent& key_event);
  };

  NativeWebKeyboardEvent_Mises::NativeWebKeyboardEvent_Mises(const ui::KeyEvent& key_event)
    : NativeWebKeyboardEvent(WebInputEvent::Type::kChar, 0, base::TimeTicks::Now()) {
  }

}

#define NativeWebKeyboardEvent NativeWebKeyboardEvent_Mises
#endif

#include "src/chrome/browser/ui/views/find_bar_host.cc"
