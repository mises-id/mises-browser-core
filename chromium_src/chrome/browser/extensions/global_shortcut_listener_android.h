#ifndef CHROME_BROWSER_EXTENSIONS_GLOBAL_SHORTCUT_LISTENER_ANDROID_H_
#define CHROME_BROWSER_EXTENSIONS_GLOBAL_SHORTCUT_LISTENER_ANDROID_H_

#include <set>

#include "base/memory/raw_ptr.h"
#include "chrome/browser/extensions/global_shortcut_listener.h"
#include "ui/events/keycodes/keyboard_codes.h"

namespace ui {
class Accelerator;
}  // namespace ui

namespace extensions {

// Ozone-specific implementation of the GlobalShortcutListener interface.
//
// Connects Aura with the platform implementation, and manages data conversions
// required on the way: Aura operates with ui::Accelerator while the platform is
// only aware of the basic components such as the key code and modifiers.
class GlobalShortcutListenerAndroid
    : public GlobalShortcutListener {
 public:
  GlobalShortcutListenerAndroid();

  GlobalShortcutListenerAndroid(const GlobalShortcutListenerAndroid&) = delete;
  GlobalShortcutListenerAndroid& operator=(const GlobalShortcutListenerAndroid&) =
      delete;

  ~GlobalShortcutListenerAndroid() override;

 private:
  // GlobalShortcutListener:
  void StartListening() override;
  void StopListening() override;
  bool RegisterAcceleratorImpl(const ui::Accelerator& accelerator) override;
  void UnregisterAcceleratorImpl(const ui::Accelerator& accelerator) override;

  void OnKeyPressed(ui::KeyboardCode key_code,
                    bool is_alt_down,
                    bool is_ctrl_down,
                    bool is_shift_down);
  void OnPlatformListenerDestroyed() ;
  bool is_listening_ = false;
  std::set<ui::Accelerator> registered_hot_keys_;

};

}  // namespace extensions

#endif  // CHROME_BROWSER_EXTENSIONS_GLOBAL_SHORTCUT_LISTENER_OZONE_H_
