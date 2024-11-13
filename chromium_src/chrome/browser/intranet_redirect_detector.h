#ifndef MISES_BROWSER_INTRANET_REDIRECT_DETECTOR_H_
#define MISES_BROWSER_INTRANET_REDIRECT_DETECTOR_H_

#include <map>
#include <memory>
#include <string>
#include <vector>

#include "base/memory/weak_ptr.h"
#include "build/build_config.h"
#include "components/pref_registry/pref_registry_syncable.h"
#include "mojo/public/cpp/bindings/receiver.h"
#include "services/network/public/cpp/network_connection_tracker.h"
#include "services/network/public/mojom/host_resolver.mojom.h"
#include "url/gurl.h"

#if BUILDFLAG(IS_ANDROID)

#undef BUILDFLAG_INTERNAL_IS_LINUX
#define BUILDFLAG_INTERNAL_IS_LINUX() (1)


#include "src/chrome/browser/intranet_redirect_detector.h"
#undef BUILDFLAG_INTERNAL_IS_LINUX
#define BUILDFLAG_INTERNAL_IS_LINUX() (0)

#else

#include "src/chrome/browser/intranet_redirect_detector.h"


#endif



#endif  // CHROME_BROWSER_INTRANET_REDIRECT_DETECTOR_H_
