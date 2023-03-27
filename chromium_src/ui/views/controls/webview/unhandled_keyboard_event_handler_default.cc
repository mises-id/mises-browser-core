#include "build/build_config.h"
#if BUILDFLAG(IS_ANDROID)
#include "ui/views/controls/webview/unhandled_keyboard_event_handler.h"
namespace views {

// static
bool UnhandledKeyboardEventHandler::HandleNativeKeyboardEvent(
    const content::NativeWebKeyboardEvent& event,
    FocusManager* focus_manager) {
  return false;
}

}  // namespace views
#else
#include "src/ui/views/controls/webview/unhandled_keyboard_event_handler.cc"
#endif
