// Copyright 2014 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

#import "mises/extensions/shell/browser/shell_native_app_window_ios.h"

#include "base/apple/foundation_util.h"
#include "base/memory/raw_ptr_exclusion.h"
#include "base/notreached.h"
#include "base/strings/sys_string_conversions.h"
#include "content/public/browser/web_contents.h"

#include "content/shell/app/shell_main_delegate.h"
#include "content/shell/browser/shell.h"
#include "content/shell/browser/shell_browser_context.h"
#include "content/shell/browser/shell_content_browser_client.h"

#include "ui/display/display.h"
#include "ui/display/screen.h"
#include "ui/gfx/geometry/size.h"

namespace extensions {

ShellNativeAppWindowIOS::ShellNativeAppWindowIOS(
    AppWindow* app_window,
    const AppWindow::CreateParams& params)
    : ShellNativeAppWindow(app_window, params) {
 
}

ShellNativeAppWindowIOS::~ShellNativeAppWindowIOS() {
}

bool ShellNativeAppWindowIOS::IsActive() const {
  return true;
}

gfx::NativeWindow ShellNativeAppWindowIOS::GetNativeWindow() const {
  return gfx::NativeWindow(window());
}

gfx::Rect ShellNativeAppWindowIOS::GetBounds() const {
  return gfx::Rect(GetContentMinimumSize());
}

void ShellNativeAppWindowIOS::Show() {
  
}

void ShellNativeAppWindowIOS::Hide() {
  NOTIMPLEMENTED();
}

bool ShellNativeAppWindowIOS::IsVisible() const {
  return true;
}

void ShellNativeAppWindowIOS::Activate() {
  // TODO(yoz): Activate in front of other applications.

}

void ShellNativeAppWindowIOS::Deactivate() {
  // See crbug.com/51364.
  NOTIMPLEMENTED();
}

void ShellNativeAppWindowIOS::SetBounds(const gfx::Rect& bounds) {
  // TODO(yoz): Windows should be fullscreen.
  NOTIMPLEMENTED();
}

gfx::Size ShellNativeAppWindowIOS::GetContentMinimumSize() const {
  // Content fills the display and cannot be resized.
  return display::Screen::GetScreen()->GetPrimaryDisplay().bounds().size();
}

gfx::Size ShellNativeAppWindowIOS::GetContentMaximumSize() const {
  return GetContentMinimumSize();
}

void ShellNativeAppWindowIOS::WindowWillClose() {

}

UIWindow* ShellNativeAppWindowIOS::window() const {
  UIWindow* window = content::Shell::windows()[0]->window().Get();
  return window;
}

}  // namespace extensions