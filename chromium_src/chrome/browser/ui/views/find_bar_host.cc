#include "build/build_config.h"
#if BUILDFLAG(IS_ANDROID)
#include "content/public/common/input/native_web_keyboard_event.h"
namespace content {
  struct CONTENT_EXPORT NativeWebKeyboardEvent_Mises : public NativeWebKeyboardEvent {
    explicit NativeWebKeyboardEvent_Mises(const ui::KeyEvent& key_event);
  };

  NativeWebKeyboardEvent_Mises::NativeWebKeyboardEvent_Mises(const ui::KeyEvent& key_event)
    : NativeWebKeyboardEvent(WebInputEvent::Type::kChar, 0, base::TimeTicks::Now()) {
  }

}

#define NativeWebKeyboardEvent NativeWebKeyboardEvent_Mises
#endif

#include "src/chrome/browser/ui/views/find_bar_host.cc"
