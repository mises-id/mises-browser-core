#include "src/extensions/shell/browser/shell_app_window_client.cc"
#if BUILDFLAG(IS_ANDROID)
#include "extensions/shell/browser/shell_app_window_client.h"
#include "extensions/shell/browser/shell_native_app_window.h"
#include <memory>
#include "extensions/browser/app_window/app_window.h"
#include "ui/android/window_android.h"
namespace extensions {

class ShellNativeAppWindowAndroid : public ShellNativeAppWindow {
 public:
  ShellNativeAppWindowAndroid(extensions::AppWindow* app_window,
                           const AppWindow::CreateParams& params);

  ShellNativeAppWindowAndroid(const ShellNativeAppWindowAndroid&) = delete;
  ShellNativeAppWindowAndroid& operator=(const ShellNativeAppWindowAndroid&) = delete;

   ~ShellNativeAppWindowAndroid() override;

  // ui::BaseWindow:
  bool IsActive() const override;
  gfx::NativeWindow GetNativeWindow() const override;
  gfx::Rect GetBounds() const override;
  void Show() override;
  void Hide() override;
  bool IsVisible() const override;
  void Activate() override;
  void Deactivate() override;
  void SetBounds(const gfx::Rect& bounds) override;

  // NativeAppWindow:
  gfx::Size GetContentMinimumSize() const override;
  gfx::Size GetContentMaximumSize() const override;
private:
  bool visible_;
  bool activate_;
  gfx::Rect bounds_;
};

ShellNativeAppWindowAndroid::ShellNativeAppWindowAndroid(
    AppWindow* app_window,
    const AppWindow::CreateParams& params)
    : ShellNativeAppWindow(app_window, params) {
      visible_ = true;
      activate_ = true;
}
ShellNativeAppWindowAndroid::~ShellNativeAppWindowAndroid() {
}


bool ShellNativeAppWindowAndroid::IsActive() const {
  return activate_;
}

gfx::NativeWindow ShellNativeAppWindowAndroid::GetNativeWindow() const {
  return app_window()->web_contents()->GetTopLevelNativeWindow();
}

gfx::Rect ShellNativeAppWindowAndroid::GetBounds() const {
  return bounds_;
}

void ShellNativeAppWindowAndroid::Show() {
  visible_ = true;
}

void ShellNativeAppWindowAndroid::Hide() {
  visible_ = false;
}

bool ShellNativeAppWindowAndroid::IsVisible() const {
  return visible_;
}

void ShellNativeAppWindowAndroid::Activate() {
  activate_ = true;
}

void ShellNativeAppWindowAndroid::Deactivate() {
  activate_ = false;
}
void ShellNativeAppWindowAndroid::SetBounds(const gfx::Rect& bounds) {
  bounds_ = bounds;
}

gfx::Size ShellNativeAppWindowAndroid::GetContentMinimumSize() const {
  // Content fills the desktop and cannot be resized.
  return bounds_.size();
}

gfx::Size ShellNativeAppWindowAndroid::GetContentMaximumSize() const {
  return GetContentMinimumSize();
}

std::unique_ptr<NativeAppWindow> ShellAppWindowClient::CreateNativeAppWindow(
    AppWindow* window,
    AppWindow::CreateParams* params) {
  return std::make_unique<ShellNativeAppWindowAndroid>(window, *params);
}

}  // namespace extensions
#endif
