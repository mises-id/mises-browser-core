#include "src/content/public/browser/content_browser_client.cc"
#include "third_party/blink/public/mojom/installedapp/related_application.mojom.h"
namespace content {

#if BUILDFLAG(IS_ANDROID)


bool ContentBrowserClient::ShouldEnforceNewCanCommitUrlChecks_Unused() {
  return false;
}
SerialDelegate* ContentBrowserClient::GetSerialDelegate() {
  return nullptr;
}
DirectSocketsDelegate* ContentBrowserClient::GetDirectSocketsDelegate() {
  return nullptr;
}

WebAuthenticationDelegate*
ContentBrowserClient::GetWebAuthenticationDelegate() {
  static base::NoDestructor<WebAuthenticationDelegate> delegate;
  return delegate.get();
}

std::unique_ptr<AuthenticatorRequestClientDelegate>
ContentBrowserClient::GetWebAuthenticationRequestDelegate(
    RenderFrameHost* render_frame_host) {
  return std::make_unique<AuthenticatorRequestClientDelegate>();
}
void ContentBrowserClient::QueryInstalledWebAppsByManifestId(
    const GURL& frame_url,
    const GURL& manifest_id,
    content::BrowserContext* browser_context,
    base::OnceCallback<void(std::optional<blink::mojom::RelatedApplication>)>
        callback) {
  std::move(callback).Run(std::nullopt);
}
#endif


}  // namespace content
