#include "extensions/browser/api/messaging/message_service.h"

#include <stdint.h>

#include <limits>
#include <memory>
#include <utility>

#include "base/functional/bind.h"
#include "base/functional/callback.h"
#include "base/containers/contains.h"
#include "base/json/json_writer.h"
#include "base/lazy_instance.h"
#include "base/metrics/field_trial_params.h"
#include "base/metrics/histogram_macros.h"
#include "base/values.h"
#include "build/build_config.h"
#include "components/back_forward_cache/back_forward_cache_disable.h"
#include "content/public/browser/back_forward_cache.h"
#include "content/public/browser/browser_context.h"
#include "content/public/browser/browser_thread.h"
#include "content/public/browser/render_frame_host.h"
#include "content/public/browser/render_process_host.h"
#include "content/public/browser/render_view_host.h"
#include "content/public/browser/render_widget_host.h"
#include "content/public/browser/render_widget_host_view.h"
#include "content/public/browser/site_instance.h"
#include "content/public/browser/web_contents.h"
#include "content/public/browser/child_process_host.h"
#include "content/public/common/content_features.h"
#include "extensions/browser/api/extensions_api_client.h"
#include "extensions/browser/api/messaging/channel_endpoint.h"
#include "extensions/browser/api/messaging/extension_message_port.h"
#include "extensions/browser/api/messaging/message_port.h"
#include "extensions/browser/api/messaging/messaging_delegate.h"
#include "extensions/browser/event_router.h"
#include "extensions/browser/extension_api_frame_id_map.h"
#include "extensions/browser/extension_prefs.h"
#include "extensions/browser/extension_registry.h"
#include "extensions/browser/extension_system.h"
#include "extensions/browser/extension_util.h"
#include "extensions/browser/extension_web_contents_observer.h"
#include "extensions/browser/extensions_browser_client.h"
#include "extensions/browser/guest_view/web_view/web_view_guest.h"
#include "extensions/browser/pref_names.h"
#include "extensions/browser/process_manager.h"
#include "extensions/common/api/messaging/messaging_endpoint.h"
#include "extensions/common/api/messaging/port_context.h"
#include "extensions/common/constants.h"
#include "extensions/common/extension.h"
#include "extensions/common/extension_features.h"
#include "extensions/common/manifest_constants.h"
#include "extensions/common/manifest_handlers/background_info.h"
#include "extensions/common/manifest_handlers/externally_connectable.h"
#include "extensions/common/manifest_handlers/incognito_info.h"
#include "extensions/common/permissions/permissions_data.h"
#include "net/http/http_response_headers.h"
#include "third_party/blink/public/common/origin_trials/trial_token_validator.h"
#include "url/gurl.h"



#if BUILDFLAG(IS_ANDROID)

#undef BUILDFLAG_INTERNAL_IS_LINUX
#define BUILDFLAG_INTERNAL_IS_LINUX() (1)


#include "src/extensions/browser/api/messaging/message_service.cc"
#undef BUILDFLAG_INTERNAL_IS_LINUX
#define BUILDFLAG_INTERNAL_IS_LINUX() (0)

#else

#include "src/extensions/browser/api/messaging/message_service.cc"


#endif

