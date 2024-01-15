
#ifndef MISES_CONTENT_BROWSER_SERVICE_WORKER_EMBEDDED_WORKER_INSTANCE_H_
#define MISES_CONTENT_BROWSER_SERVICE_WORKER_EMBEDDED_WORKER_INSTANCE_H_

#include <stdint.h>

#include <memory>
#include <optional>
#include <string>

#include "base/check_op.h"
#include "base/functional/callback_forward.h"
#include "base/gtest_prod_util.h"
#include "base/memory/raw_ptr.h"
#include "base/memory/weak_ptr.h"
#include "base/observer_list.h"
#include "base/unguessable_token.h"
#include "components/services/storage/public/cpp/buckets/bucket_locator.h"
#include "content/browser/service_worker/service_worker_metrics.h"
#include "content/common/content_export.h"
#include "content/public/browser/content_browser_client.h"
#include "mojo/public/cpp/bindings/associated_receiver.h"
#include "mojo/public/cpp/bindings/pending_receiver.h"
#include "mojo/public/cpp/bindings/pending_remote.h"
#include "mojo/public/cpp/bindings/remote.h"
#include "mojo/public/cpp/bindings/self_owned_receiver.h"
#include "services/network/public/mojom/client_security_state.mojom-forward.h"
#include "third_party/blink/public/common/service_worker/embedded_worker_status.h"
#include "third_party/blink/public/common/service_worker/service_worker_status_code.h"
#include "third_party/blink/public/common/tokens/tokens.h"
#include "third_party/blink/public/mojom/cache_storage/cache_storage.mojom.h"
#include "third_party/blink/public/mojom/service_worker/controller_service_worker.mojom.h"
#include "third_party/blink/public/mojom/service_worker/embedded_worker.mojom.h"
#include "third_party/blink/public/mojom/service_worker/service_worker.mojom.h"
#include "third_party/blink/public/mojom/service_worker/service_worker_installed_scripts_manager.mojom.h"
#include "third_party/blink/public/mojom/usb/web_usb_service.mojom-forward.h"
#include "third_party/blink/public/mojom/worker/subresource_loader_updater.mojom.h"
#include "url/gurl.h"




#if BUILDFLAG(IS_ANDROID)

#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (0)

#include "src/content/browser/service_worker/embedded_worker_instance.h"
#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (1)

#else

#include "src/content/browser/service_worker/embedded_worker_instance.h"


#endif

#endif