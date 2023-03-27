#include "src/services/device/device_service.cc"

namespace device {

#if BUILDFLAG(IS_ANDROID)
void DeviceService::BindHidManager(
    mojo::PendingReceiver<mojom::HidManager> receiver) {
}
#endif

}  // namespace device
