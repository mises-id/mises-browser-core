#ifndef MISES_BROWSER_UI_SEARCH_SEARCH_IPC_ROUTER_H_
#define MISES_BROWSER_UI_SEARCH_SEARCH_IPC_ROUTER_H_

#include <memory>
#include <utility>
#include <vector>

#include "base/gtest_prod_util.h"
#include "base/memory/raw_ptr.h"
#include "base/time/time.h"
#include "build/build_config.h"
#include "chrome/common/search/instant_types.h"
#include "chrome/common/search/ntp_logging_events.h"
#include "chrome/common/search/search.mojom.h"
#include "components/ntp_tiles/ntp_tile_impression.h"
#include "components/omnibox/common/omnibox_focus_state.h"
#include "mojo/public/cpp/bindings/associated_receiver.h"


#define OnUndoMostVisitedDeletion OnOpenExtension(const GURL& url) = 0; \
      virtual void OnUndoMostVisitedDeletion
#define OnTabDeactivated OnMisesInfoChanged(); \
  void SendMostVisitedInfo_Chromium(const InstantMostVisitedInfo& most_visited_info); \
  void OpenExtension(const GURL& url) override; \
  void OnTabDeactivated


#if BUILDFLAG(IS_ANDROID)

#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (0)



#include "src/chrome/browser/ui/search/search_ipc_router.h"
#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (1)


#else

#include "src/chrome/browser/ui/search/search_ipc_router.h"


#endif


#undef OnUndoMostVisitedDeletion
#undef OnTabDeactivated



#endif