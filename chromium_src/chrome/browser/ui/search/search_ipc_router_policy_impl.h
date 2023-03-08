#ifndef MISES_BROWSER_UI_SEARCH_SEARCH_IPC_ROUTER_POLICY_IMPL_H_
#define MISES_BROWSER_UI_SEARCH_SEARCH_IPC_ROUTER_POLICY_IMPL_H_

#include "base/memory/raw_ptr.h"
#include "build/build_config.h"
#include "chrome/browser/ui/search/search_ipc_router.h"


#if BUILDFLAG(IS_ANDROID)

#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (0)


#include "src/chrome/browser/ui/search/search_ipc_router_policy_impl.h"
#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (1)

#else

#include "src/chrome/browser/ui/search/search_ipc_router_policy_impl.h"


#endif


#endif  // CHROME_BROWSER_UI_SEARCH_SEARCH_IPC_ROUTER_POLICY_IMPL_H_
