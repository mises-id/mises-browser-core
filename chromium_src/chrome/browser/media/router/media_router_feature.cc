#include "build/build_config.h"

#if BUILDFLAG(IS_ANDROID)

 
#include "chrome/browser/media/router/media_router_feature.h"

#include "base/base64.h"
#include "base/command_line.h"
#include "base/containers/flat_map.h"
#include "base/feature_list.h"
#include "base/no_destructor.h"
#include "base/strings/string_util.h"
#include "build/build_config.h"
#include "chrome/browser/profiles/profile.h"
#include "chrome/common/pref_names.h"
#include "components/media_router/common/pref_names.h"
#include "components/prefs/pref_service.h"
#include "components/user_prefs/user_prefs.h"
#include "content/public/browser/browser_context.h"
#include "content/public/browser/web_contents.h"
#include "content/public/common/content_features.h"
#include "crypto/random.h"
#include "media/base/media_switches.h"
#include "ui/base/buildflags.h"

#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (0)


#include "src/chrome/browser/media/router/media_router_feature.cc"
#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (1)



namespace media_router {

BASE_FEATURE(kCafMRPDeferredDiscovery,
             "CafMRPDeferredDiscovery",
             base::FEATURE_ENABLED_BY_DEFAULT);



}


#else

#include "src/chrome/browser/media/router/media_router_feature.cc"


#endif



