#ifndef MISES_BROWSER_RESOURCE_COORDINATOR_RESOURCE_COORDINATOR_PARTS_H_
#define MISES_BROWSER_RESOURCE_COORDINATOR_RESOURCE_COORDINATOR_PARTS_H_

#include "build/build_config.h"
#include "chrome/browser/resource_coordinator/tab_load_tracker.h"
#include "chrome/browser/resource_coordinator/tab_memory_metrics_reporter.h"


#if BUILDFLAG(IS_ANDROID)

#include "chrome/browser/resource_coordinator/tab_lifecycle_unit_source.h"
#include "chrome/browser/resource_coordinator/tab_manager.h"

namespace resource_coordinator {

class TabManager;
class TabLifecycleUnitSource;
}

#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (0)


#include "src/chrome/browser/resource_coordinator/resource_coordinator_parts.h"
#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (1)

#else

#include "src/chrome/browser/resource_coordinator/resource_coordinator_parts.h"


#endif


#endif  // CHROME_BROWSER_RESOURCE_COORDINATOR_RESOURCE_COORDINATOR_PARTS_H__
