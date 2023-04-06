#include "content/public/browser/content_browser_client.h"
#include "chrome/browser/chrome_content_browser_client.h"
#include "chrome/browser/ui/search/search_tab_helper.h"
#define RegisterAssociatedInterfaceBindersForRenderFrameHost RegisterAssociatedInterfaceBindersForRenderFrameHost_Chromium
#include "src/chrome/browser/chrome_content_browser_client_receiver_bindings.cc"
#undef RegisterAssociatedInterfaceBindersForRenderFrameHost


void ChromeContentBrowserClient::
    RegisterAssociatedInterfaceBindersForRenderFrameHost(
        content::RenderFrameHost& render_frame_host,
        blink::AssociatedInterfaceRegistry& associated_registry) {
  RegisterAssociatedInterfaceBindersForRenderFrameHost_Chromium(render_frame_host, associated_registry);
#if BUILDFLAG(IS_ANDROID) 
    associated_registry.AddInterface<
      search::mojom::EmbeddedSearchConnector>(base::BindRepeating(
        [](content::RenderFrameHost* render_frame_host,
           mojo::PendingAssociatedReceiver<
               search::mojom::EmbeddedSearchConnector> receiver) {
          SearchTabHelper::BindEmbeddedSearchConnecter(std::move(receiver),
                                                       render_frame_host);
        },
        &render_frame_host));
#endif  //  !BUILDFLAG(IS_ANDROID)

}