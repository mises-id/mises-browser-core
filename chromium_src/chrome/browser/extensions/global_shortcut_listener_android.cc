#include "chrome/browser/extensions/global_shortcut_listener_android.h"

#include "base/containers/contains.h"
#include "content/public/browser/browser_thread.h"
#include "ui/base/accelerators/accelerator.h"

using content::BrowserThread;

namespace extensions {

GlobalShortcutListenerAndroid::GlobalShortcutListenerAndroid() {
  CHECK(BrowserThread::CurrentlyOn(BrowserThread::UI));

}

GlobalShortcutListenerAndroid::~GlobalShortcutListenerAndroid() {
  if (is_listening_)
    StopListening();

}

void GlobalShortcutListenerAndroid::StartListening() {
  DCHECK(!is_listening_);
  DCHECK(!registered_hot_keys_.empty());


  is_listening_ = true;
}

void GlobalShortcutListenerAndroid::StopListening() {
  DCHECK(is_listening_);
  DCHECK(registered_hot_keys_.empty());


  is_listening_ = false;
}

bool GlobalShortcutListenerAndroid::RegisterAcceleratorImpl(
    const ui::Accelerator& accelerator) {
  DCHECK(!base::Contains(registered_hot_keys_, accelerator));


  const bool registered = false;
  if (registered)
    registered_hot_keys_.insert(accelerator);
  return registered;
}

void GlobalShortcutListenerAndroid::UnregisterAcceleratorImpl(
    const ui::Accelerator& accelerator) {
  DCHECK(base::Contains(registered_hot_keys_, accelerator));
  // Otherwise how could the accelerator be registered?
  registered_hot_keys_.erase(accelerator);
}

void GlobalShortcutListenerAndroid::OnKeyPressed(ui::KeyboardCode key_code,
                                               bool is_alt_down,
                                               bool is_ctrl_down,
                                               bool is_shift_down) {
  int modifiers = 0;
  if (is_alt_down)
    modifiers |= ui::EF_ALT_DOWN;
  if (is_ctrl_down)
    modifiers |= ui::EF_CONTROL_DOWN;
  if (is_shift_down)
    modifiers |= ui::EF_SHIFT_DOWN;

  NotifyKeyPressed(ui::Accelerator(key_code, modifiers));
}

void GlobalShortcutListenerAndroid::OnPlatformListenerDestroyed() {
}

// static
GlobalShortcutListener* GlobalShortcutListener::GetInstance() {
  CHECK(BrowserThread::CurrentlyOn(BrowserThread::UI));
  static GlobalShortcutListenerAndroid* instance =
      new GlobalShortcutListenerAndroid();
  return instance;
}

}  // namespace extensions
