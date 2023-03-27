#ifndef UI_VIEWS_EVENT_MONITOR_ANDROID_H_
#define UI_VIEWS_EVENT_MONITOR_ANDROID_H_

#include "base/memory/raw_ptr.h"
#include "ui/views/event_monitor.h"

namespace ui {
class EventTarget;
}

namespace views {

// Observes events by installing a pre-target handler on the ui::EventTarget.
class EventMonitorAndroid : public EventMonitor {
 public:
  EventMonitorAndroid(ui::EventObserver* event_observer,
                   ui::EventTarget* event_target,
                   const std::set<ui::EventType>& types);
  EventMonitorAndroid(const EventMonitorAndroid&) = delete;
    EventMonitorAndroid& operator=(const EventMonitorAndroid&) = delete;
  ~EventMonitorAndroid() override;

  // EventMonitor:
  gfx::Point GetLastMouseLocation() override;

 protected:

};

}  // namespace views

#endif  // UI_VIEWS_EVENT_MONITOR_Android_H_
