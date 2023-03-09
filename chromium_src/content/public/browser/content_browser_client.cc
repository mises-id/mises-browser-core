#include "src/content/public/browser/content_browser_client.cc"

namespace content {

#if BUILDFLAG(IS_ANDROID)

bool ContentBrowserClient::SupportsAvoidUnnecessaryBeforeUnloadCheckSync_Unused() {
  return false;
}
SerialDelegate* ContentBrowserClient::GetSerialDelegate() {
  return nullptr;
}
std::unique_ptr<AuthenticatorRequestClientDelegate>
ContentBrowserClient::GetWebAuthenticationRequestDelegate(
    RenderFrameHost* render_frame_host) {
  return std::make_unique<AuthenticatorRequestClientDelegate>();
}
#endif


}  // namespace content
