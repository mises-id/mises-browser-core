#include "src/components/feature_engagement/internal/tracker_impl.cc"

namespace feature_engagement {

namespace {


#if BUILDFLAG(IS_ANDROID)


// Reads event data from `config` and - if valid - places it into `result` along
// with the event count in the appropriate window.
void MaybeGetEventData(Tracker::EventList& result,
                       const EventConfig& config,
                       const EventModel& event_model,
                       uint32_t current_day) {
  if (config.name.empty()) {
    return;
  }
  result.emplace_back(std::make_pair(
      config,
      event_model.GetEventCount(config.name, current_day, config.window)));
}

#endif  // !BUILDFLAG(IS_ANDROID)

}  // namespace

#if BUILDFLAG(IS_ANDROID)
void TrackerImpl::NotifyUsedEvent(const base::Feature& feature) {
  const auto& feature_config = configuration_->GetFeatureConfig(feature);
  if (!feature_config.used.name.empty()) {
    NotifyEvent(feature_config.used.name);
  }
}

void TrackerImpl::ClearEventData(const base::Feature& feature) {
  const auto& feature_config = configuration_->GetFeatureConfig(feature);
  if (!feature_config.trigger.name.empty()) {
    event_model_->ClearEvent(feature_config.trigger.name);
  }
  if (!feature_config.used.name.empty()) {
    event_model_->ClearEvent(feature_config.used.name);
  }
  for (const auto& event_config : feature_config.event_configs) {
    event_model_->ClearEvent(event_config.name);
  }
}

Tracker::EventList TrackerImpl::ListEvents(const base::Feature& feature) const {
  EventList result;
  if (!IsInitialized()) {
    return result;
  }
  const auto& feature_config = configuration_->GetFeatureConfig(feature);
  const auto current_day = time_provider_->GetCurrentDay();
  MaybeGetEventData(result, feature_config.trigger, *event_model_, current_day);
  MaybeGetEventData(result, feature_config.used, *event_model_, current_day);
  for (const auto& event_config : feature_config.event_configs) {
    MaybeGetEventData(result, event_config, *event_model_, current_day);
  }
  return result;
}
#endif  // !BUILDFLAG(IS_ANDROID)

}  // namespace


