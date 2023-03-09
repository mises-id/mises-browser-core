#ifndef MISES_BROWSER_CHROME_CONTENT_BROWSER_CLIENT_H_
#define MISES_BROWSER_CHROME_CONTENT_BROWSER_CLIENT_H_
#include "build/build_config.h"

#include "content/public/browser/content_browser_client.h"

#if BUILDFLAG(IS_ANDROID)
#define RegisterAssociatedInterfaceBindersForRenderFrameHost\
    RegisterAssociatedInterfaceBindersForRenderFrameHost_Chromium(\
      content::RenderFrameHost& render_frame_host,\
      blink::AssociatedInterfaceRegistry& associated_registry);\
    virtual void RegisterAssociatedInterfaceBindersForRenderFrameHost
#endif
#include "src/chrome/browser/chrome_content_browser_client.h"
#if BUILDFLAG(IS_ANDROID)
#undef RegisterAssociatedInterfaceBindersForRenderFrameHost
#endif

#endif  // CHROME_BROWSER_CHROME_CONTENT_BROWSER_CLIENT_H_
