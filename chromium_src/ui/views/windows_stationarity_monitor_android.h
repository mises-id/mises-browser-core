// Copyright 2023 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

#ifndef UI_VIEWS_WINDOWS_STATIONARITY_MONITOR_ANDROID_H_
#define UI_VIEWS_WINDOWS_STATIONARITY_MONITOR_ANDROID_H_

#include <vector>

#include "base/callback_list.h"
#include "ui/views/widget/widget_observer.h"
#include "ui/views/windows_stationarity_monitor.h"

namespace views {

class NativeWidgetAndroid;
class Widget;

class WindowsStationarityMonitorAndroid : public WindowsStationarityMonitor,
                                      WidgetObserver {
 public:
  WindowsStationarityMonitorAndroid();

  WindowsStationarityMonitorAndroid(const WindowsStationarityMonitorAndroid&) = delete;
  WindowsStationarityMonitorAndroid& operator=(
      const WindowsStationarityMonitorAndroid&) = delete;

  static WindowsStationarityMonitorAndroid* GetInstance();

  // views::WidgetObserver
  void OnWidgetDestroying(Widget* widget) override;
  void OnWidgetBoundsChanged(Widget* widget,
                             const gfx::Rect& new_bounds) override;

 private:
  ~WindowsStationarityMonitorAndroid() override;

  void OnNativeWidgetAdded(NativeWidgetAndroid* native_widget);

  std::vector<Widget*> tracked_windows_;

  // Callback to run whenever a |NativeWidgetMac| is created.
  base::CallbackListSubscription init_native_widget_subscription_;
};

}  // namespace views

#endif  // UI_VIEWS_WINDOWS_STATIONARITY_MONITOR_MAC_H_