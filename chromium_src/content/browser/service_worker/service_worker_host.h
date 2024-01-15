
#ifndef MISES_CONTENT_BROWSER_SERVICE_WORKER_SERVICE_WORKER_HOST_H_
#define MISES_CONTENT_BROWSER_SERVICE_WORKER_SERVICE_WORKER_HOST_H_

#include <memory>
#include <string>

#include "base/gtest_prod_util.h"
#include "base/memory/raw_ptr.h"
#include "base/memory/weak_ptr.h"
#include "base/task/single_thread_task_runner.h"
#include "content/browser/browser_interface_broker_impl.h"
#include "content/browser/buckets/bucket_context.h"
#include "content/browser/renderer_host/code_cache_host_impl.h"
#include "content/browser/service_worker/service_worker_container_host.h"
#include "content/common/content_export.h"
#include "content/public/browser/render_process_host.h"
#include "mojo/public/cpp/bindings/associated_receiver.h"
#include "mojo/public/cpp/bindings/associated_remote.h"
#include "mojo/public/cpp/bindings/pending_associated_receiver.h"
#include "mojo/public/cpp/bindings/pending_associated_remote.h"
#include "mojo/public/cpp/bindings/pending_receiver.h"
#include "mojo/public/cpp/bindings/receiver.h"
#include "mojo/public/cpp/bindings/unique_receiver_set.h"
#include "net/base/network_isolation_key.h"
#include "services/network/public/mojom/fetch_api.mojom.h"
#include "services/network/public/mojom/network_context.mojom.h"
#include "services/service_manager/public/cpp/interface_provider.h"
#include "third_party/blink/public/mojom/blob/blob_url_store.mojom-forward.h"
#include "third_party/blink/public/mojom/broadcastchannel/broadcast_channel.mojom.h"
#include "third_party/blink/public/mojom/fetch/fetch_api_request.mojom.h"
#include "third_party/blink/public/mojom/loader/code_cache.mojom.h"
#include "third_party/blink/public/mojom/service_worker/service_worker_container.mojom.h"
#include "third_party/blink/public/mojom/service_worker/service_worker_container_type.mojom.h"
#include "third_party/blink/public/mojom/service_worker/service_worker_provider.mojom.h"
#include "third_party/blink/public/mojom/usb/web_usb_service.mojom-forward.h"
#include "third_party/blink/public/mojom/use_counter/metrics/web_feature.mojom.h"
#include "third_party/blink/public/mojom/webtransport/web_transport_connector.mojom.h"
#include "url/origin.h"


#if BUILDFLAG(IS_ANDROID)

#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (0)


#include "src/content/browser/service_worker/service_worker_host.h"
#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (1)

#else

#include "src/content/browser/service_worker/service_worker_host.h"


#endif



#endif  