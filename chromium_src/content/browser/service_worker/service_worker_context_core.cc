#include "src/content/browser/service_worker/service_worker_context_core.cc"

namespace content {
#if BUILDFLAG(IS_ANDROID)
ServiceWorkerHidDelegateObserver*
ServiceWorkerContextCore::hid_delegate_observer() {
  if (!hid_delegate_observer_) {
    hid_delegate_observer_ =
        std::make_unique<ServiceWorkerHidDelegateObserver>(this);
  }
  return hid_delegate_observer_.get();
}
#endif

}
