#include "src/content/browser/service_worker/embedded_worker_instance.cc"


#if BUILDFLAG(IS_ANDROID)
#include "content/browser/hid/hid_service.h"
#endif

namespace content {

#if BUILDFLAG(IS_ANDROID)
void EmbeddedWorkerInstance::BindHidService(
    const url::Origin& origin,
    mojo::PendingReceiver<blink::mojom::HidService> receiver) {
  DCHECK_CURRENTLY_ON(BrowserThread::UI);
  HidDelegate* hid_delegate = GetContentClient()->browser()->GetHidDelegate();
  if (!hid_delegate) {
    return;
  }
  if (hid_delegate->IsServiceWorkerAllowedForOrigin(origin)) {
    HidService::Create(owner_version_->GetWeakPtr(), origin,
                       std::move(receiver));
  }
}
#endif

}
