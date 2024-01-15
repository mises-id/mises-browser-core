#include "build/build_config.h"
#if BUILDFLAG(IS_ANDROID)
#include "content/browser/hid/hid_service.h"
#endif

#include "src/content/browser/renderer_host/render_frame_host_impl.cc"

#if BUILDFLAG(IS_ANDROID)

namespace content {
    
    void RenderFrameHostImpl::GetHidService(
        mojo::PendingReceiver<blink::mojom::HidService> receiver) {
    HidService::Create(this, std::move(receiver));
    }
}

class MisesAllowInjectingJavascript {
public:
    MisesAllowInjectingJavascript() {
        content::RenderFrameHost::AllowInjectingJavaScript();
    }
};
static MisesAllowInjectingJavascript  s_misse_allow_injecting_javascript;
#endif
