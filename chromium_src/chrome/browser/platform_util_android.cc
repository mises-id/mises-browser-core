
#include "src/chrome/browser/platform_util_android.cc"
namespace platform_util {

gfx::NativeView GetViewForWindow(gfx::NativeWindow window) {
  NOTIMPLEMENTED();
  return window;
}

bool IsBrowserLockedFullscreen(const Browser* browser) {
  return false;
}

} // namespace platform_util
