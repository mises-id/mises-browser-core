#include "ui/views/event_monitor_android.h"

#include <memory>

#include "base/logging.h"
#include "base/scoped_observation.h"
#include "ui/events/event_observer.h"
#include "ui/events/event_target.h"

namespace views {

EventMonitorAndroid::EventMonitorAndroid(ui::EventObserver* event_observer,
                                   ui::EventTarget* event_target,
                                   const std::set<ui::EventType>& types) {
}

EventMonitorAndroid::~EventMonitorAndroid() {
}

namespace {

// An EventMonitorAndroid that removes its event observer on window destruction.
class WindowMonitorAndroid : public EventMonitorAndroid {
 public:
  WindowMonitorAndroid(ui::EventObserver* event_observer,
                    ui::EventTarget* target_window,
                    const std::set<ui::EventType>& types)
      : EventMonitorAndroid(event_observer, target_window, types) {
  }
  ~WindowMonitorAndroid() override = default;
  WindowMonitorAndroid(const WindowMonitorAndroid&) = delete;
  WindowMonitorAndroid& operator=(const WindowMonitorAndroid&) = delete;
};

}  // namespace

// static
std::unique_ptr<EventMonitor> EventMonitor::CreateApplicationMonitor(
    ui::EventObserver* event_observer,
    gfx::NativeWindow context,
    const std::set<ui::EventType>& types) {
  return std::make_unique<EventMonitorAndroid>(event_observer,
                                            nullptr, types);
}

// static
std::unique_ptr<EventMonitor> EventMonitor::CreateWindowMonitor(
    ui::EventObserver* event_observer,
    gfx::NativeWindow target_window,
    const std::set<ui::EventType>& types) {
  return std::make_unique<WindowMonitorAndroid>(event_observer, nullptr,
                                             types);
}

gfx::Point EventMonitorAndroid::GetLastMouseLocation() {
  return gfx::Point();
}

}  // namespace views
