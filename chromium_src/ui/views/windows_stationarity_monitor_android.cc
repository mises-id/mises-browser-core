// Copyright 2023 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

#include "ui/views/windows_stationarity_monitor_android.h"

#include "base/functional/bind.h"
#include "base/no_destructor.h"
#include "ui/gfx/geometry/rect.h"
#include "ui/views/widget/native_widget_android.h"
#include "ui/views/widget/widget.h"

namespace views {

WindowsStationarityMonitorAndroid::WindowsStationarityMonitorAndroid() {
}

WindowsStationarityMonitorAndroid::~WindowsStationarityMonitorAndroid() {
  for (auto* widget : tracked_windows_) {
    widget->RemoveObserver(this);
  }
  tracked_windows_.clear();
  init_native_widget_subscription_ = {};
}

// static
WindowsStationarityMonitorAndroid* WindowsStationarityMonitorAndroid::GetInstance() {
  static base::NoDestructor<WindowsStationarityMonitorAndroid> instance;
  return instance.get();
}

void WindowsStationarityMonitorAndroid::OnWidgetDestroying(Widget* widget) {
  widget->RemoveObserver(this);
  std::erase(tracked_windows_, widget);
  NotifyWindowStationaryStateChanged();
}

void WindowsStationarityMonitorAndroid::OnWidgetBoundsChanged(
    Widget* widget,
    const gfx::Rect& new_bounds) {
  NotifyWindowStationaryStateChanged();
}

void WindowsStationarityMonitorAndroid::OnNativeWidgetAdded(
    NativeWidgetAndroid* native_widget) {
  auto* widget = native_widget->GetWidget();
  DCHECK(widget);
  tracked_windows_.push_back(widget);
  widget->AddObserver(this);
}

// static
WindowsStationarityMonitor* WindowsStationarityMonitor::GetInstance() {
  return WindowsStationarityMonitorAndroid::GetInstance();
}

}  // namespace views