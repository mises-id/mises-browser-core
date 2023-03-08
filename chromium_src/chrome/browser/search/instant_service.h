#ifndef MISES_BROWSER_SEARCH_INSTANT_SERVICE_H_
#define MISES_BROWSER_SEARCH_INSTANT_SERVICE_H_

#include <map>
#include <memory>
#include <set>
#include <vector>

#include "base/gtest_prod_util.h"
#include "base/memory/raw_ptr.h"
#include "base/memory/ref_counted.h"
#include "base/memory/weak_ptr.h"
#include "base/observer_list.h"
#include "base/scoped_observation.h"
#include "base/time/time.h"
#include "build/build_config.h"
#include "chrome/browser/themes/theme_service_observer.h"
#include "components/history/core/browser/history_types.h"
#include "components/keyed_service/core/keyed_service.h"
#include "components/ntp_tiles/most_visited_sites.h"
#include "components/ntp_tiles/ntp_tile.h"
#include "components/prefs/pref_change_registrar.h"
#include "components/prefs/pref_registry_simple.h"
#include "content/public/browser/notification_observer.h"
#include "content/public/browser/notification_registrar.h"
#include "ui/native_theme/native_theme.h"
#include "ui/native_theme/native_theme_observer.h"
#include "url/gurl.h"


#include "components/history/core/browser/history_service.h"
#include "chrome/common/search/instant_types.h"



namespace content {
class WebContents;
} 

#define UndoAllMostVisitedDeletions \
  OpenExtension(content::WebContents* web_contents, const GURL& url);\
  GURL GetExtensionURL(const std::string& extension_id);\
  void SearchComplete(history::QueryResults results);\
  std::vector<InstantMostVisitedItem> most_visited_items_;\
  std::vector<InstantMostVisitedItem> recent_extensions_;\
  base::CancelableTaskTracker task_tracker_;\
  void UndoAllMostVisitedDeletions


#if BUILDFLAG(IS_ANDROID)

#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (0)


#include "src/chrome/browser/search/instant_service.h"
#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (1)

#else

#include "src/chrome/browser/search/instant_service.h"


#endif


#undef  UndoAllMostVisitedDeletions


#endif  // CHROME_BROWSER_SEARCH_INSTANT_SERVICE_H_
