#ifndef MISES_COMPONENTS_MEDIA_ROUTER_BROWSER_MEDIA_ROUTER_H_
#define MISES_COMPONENTS_MEDIA_ROUTER_BROWSER_MEDIA_ROUTER_H_

#include <stdint.h>

#include <string>
#include <vector>

#include "base/functional/callback.h"
#include "base/callback_list.h"
#include "base/time/time.h"
#include "base/values.h"
#include "build/build_config.h"
#include "components/keyed_service/core/keyed_service.h"
#include "components/media_router/browser/presentation_connection_message_observer.h"
#include "components/media_router/common/media_route.h"
#include "components/media_router/common/media_route_provider_helper.h"
#include "components/media_router/common/media_sink.h"
#include "components/media_router/common/media_source.h"
#include "components/media_router/common/mojom/media_router.mojom.h"
#include "components/sessions/core/session_id.h"
#include "content/public/browser/presentation_service_delegate.h"
#include "media/base/flinging_controller.h"
#include "third_party/blink/public/mojom/presentation/presentation.mojom.h"


#if BUILDFLAG(IS_ANDROID)

#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (0)


#include "src/components/media_router/browser/media_router.h"
#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (1)

#else

#include "src/components/media_router/browser/media_router.h"


#endif


#endif  // COMPONENTS_MEDIA_ROUTER_BROWSER_MEDIA_ROUTER_H_
