#include "build/build_config.h"
#if BUILDFLAG(IS_ANDROID)
#include "ui/views/controls/webview/unhandled_keyboard_event_handler.h"
#include "components/input/native_web_keyboard_event.h"
#include "ui/events/event.h"
#include "ui/views/focus/focus_manager.h"
namespace views {

// static
bool UnhandledKeyboardEventHandler::HandleNativeKeyboardEvent(
    const input::NativeWebKeyboardEvent& event,
    FocusManager* focus_manager) {
  return false;
}

}  // namespace views
#else
#include "src/ui/views/controls/webview/unhandled_keyboard_event_handler.cc"
#endif
