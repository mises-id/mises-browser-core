#ifndef MISES_CONTENT_PUBLIC_BROWSER_CONTENT_BROWSER_CLIENT_H_
#define MISES_CONTENT_PUBLIC_BROWSER_CONTENT_BROWSER_CLIENT_H_

#include "build/build_config.h"
#if BUILDFLAG(IS_ANDROID)
#include "third_party/blink/public/mojom/installedapp/related_application.mojom-forward.h"
#define ShouldEnforceNewCanCommitUrlChecks\
    ShouldEnforceNewCanCommitUrlChecks_Unused();\
    virtual SerialDelegate* GetSerialDelegate();\
    virtual DirectSocketsDelegate* GetDirectSocketsDelegate();\
    virtual WebAuthenticationDelegate* GetWebAuthenticationDelegate();\
    virtual std::unique_ptr<AuthenticatorRequestClientDelegate> GetWebAuthenticationRequestDelegate(RenderFrameHost* render_frame_host);\
    virtual void QueryInstalledWebAppsByManifestId(\
      const GURL& frame_url,\
      const GURL& manifest_id,\
      content::BrowserContext* browser_context,\
      base::OnceCallback<void(std::optional<blink::mojom::RelatedApplication>)>\
          callback);\
    virtual bool ShouldEnforceNewCanCommitUrlChecks
#endif
#include "src/content/public/browser/content_browser_client.h"
#if BUILDFLAG(IS_ANDROID)
#undef ShouldEnforceNewCanCommitUrlChecks
#endif


#endif  // CONTENT_PUBLIC_BROWSER_CONTENT_BROWSER_CLIENT_H_
