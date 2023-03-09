#ifndef MISES_CONTENT_PUBLIC_BROWSER_CONTENT_BROWSER_CLIENT_H_
#define MISES_CONTENT_PUBLIC_BROWSER_CONTENT_BROWSER_CLIENT_H_

#include "build/build_config.h"
#if BUILDFLAG(IS_ANDROID)
#define SupportsAvoidUnnecessaryBeforeUnloadCheckSync\
    SupportsAvoidUnnecessaryBeforeUnloadCheckSync_Unused();\
    virtual void RegisterAssociatedInterfaceBindersForRenderFrameHost_Chromium(\
      RenderFrameHost& render_frame_host,\
      blink::AssociatedInterfaceRegistry& associated_registry);\
    virtual SerialDelegate* GetSerialDelegate();\
    virtual std::unique_ptr<AuthenticatorRequestClientDelegate> GetWebAuthenticationRequestDelegate(RenderFrameHost* render_frame_host);\
    virtual bool SupportsAvoidUnnecessaryBeforeUnloadCheckSync
#endif
#include "src/content/public/browser/content_browser_client.h"
#if BUILDFLAG(IS_ANDROID)
#undef SupportsAvoidUnnecessaryBeforeUnloadCheckSync
#endif


#endif  // CONTENT_PUBLIC_BROWSER_CONTENT_BROWSER_CLIENT_H_
