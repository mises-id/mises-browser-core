#ifndef MISES_BROWSER_UI_SEARCH_SEARCH_TAB_HELPER_H_
#define MISES_BROWSER_UI_SEARCH_SEARCH_TAB_HELPER_H_

#include <memory>
#include <string>
#include <vector>

#include "base/gtest_prod_util.h"
#include "base/memory/raw_ptr.h"
#include "base/memory/weak_ptr.h"
#include "base/time/time.h"
#include "build/build_config.h"
#include "chrome/browser/search/instant_service_observer.h"
#include "chrome/browser/ui/omnibox/omnibox_tab_helper.h"
#include "chrome/browser/ui/search/search_ipc_router.h"
#include "chrome/common/search/instant_types.h"
#include "chrome/common/search/ntp_logging_events.h"
#include "components/ntp_tiles/ntp_tile_impression.h"
#include "components/omnibox/common/omnibox_focus_state.h"
#include "content/public/browser/reload_type.h"
#include "content/public/browser/web_contents_observer.h"
#include "content/public/browser/web_contents_user_data.h"


#define  NavigationEntryCommitted NavigationEntryCommitted_Chromium( \
      const content::LoadCommittedDetails& load_details); \
      void NavigationEntryCommitted

#if BUILDFLAG(IS_ANDROID)

#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (0)


#include "src/chrome/browser/ui/search/search_tab_helper.h"

#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (1)


#else

#include "src/chrome/browser/ui/search/search_tab_helper.h"


#endif

#undef NavigationEntryCommitted

#endif
