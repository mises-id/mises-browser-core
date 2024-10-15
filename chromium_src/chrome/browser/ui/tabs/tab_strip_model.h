#ifndef MISES_BROWSER_UI_TABS_TAB_STRIP_MODEL_H_
#define MISES_BROWSER_UI_TABS_TAB_STRIP_MODEL_H_

#include <stddef.h>
#include <stdint.h>

#include <map>
#include <memory>
#include <string>
#include <vector>

#include "base/containers/span.h"
#include "base/gtest_prod_util.h"
#include "base/memory/raw_ptr.h"
#include "base/memory/weak_ptr.h"
#include "base/observer_list.h"
#include "base/scoped_multi_source_observation.h"
#include "base/scoped_observation.h"
#include "build/build_config.h"
#include "chrome/browser/ui/tabs/tab_group_controller.h"
#include "chrome/browser/ui/tabs/tab_model.h"
#include "chrome/browser/ui/tabs/tab_strip_scrubbing_metrics.h"
#include "chrome/browser/ui/tabs/tab_strip_user_gesture_details.h"
#include "components/sessions/core/session_id.h"
#include "components/tab_groups/tab_group_id.h"
#include "components/tab_groups/tab_group_visual_data.h"
#include <optional>
#include "third_party/perfetto/include/perfetto/tracing/traced_value_forward.h"
#include "ui/base/models/list_selection_model.h"
#include "ui/base/page_transition_types.h"


#if BUILDFLAG(IS_ANDROID)

#define TabModel TabModelDesktop


#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (0)


#define active_index\
  active_index_unused1(){return kNoTab;}\
  int active_index() const {\
    return selection_model_.active() && selection_model_.active().has_value()\
               ? static_cast<int>(selection_model_.active().value()) : kNoTab;\
  }\
  int active_index_unused2

#include "src/chrome/browser/ui/tabs/tab_strip_model.h"
#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (1)

#undef active_index


#undef TabModel

#else

#include "src/chrome/browser/ui/tabs/tab_strip_model.h"


#endif


#endif  // CHROME_BROWSER_UI_TABS_TAB_STRIP_MODEL_H_
