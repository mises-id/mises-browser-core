#include "src/content/browser/service_worker/service_worker_host.cc"

namespace content {

#if BUILDFLAG(IS_ANDROID)
void ServiceWorkerHost::BindHidService(
    mojo::PendingReceiver<blink::mojom::HidService> receiver) {
  DCHECK_CURRENTLY_ON(BrowserThread::UI);
  version_->embedded_worker()->BindHidService(version_->key().origin(),
                                              std::move(receiver));
}
#endif

}
