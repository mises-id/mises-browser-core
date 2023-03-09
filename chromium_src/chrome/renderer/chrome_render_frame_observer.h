#ifndef MISES_RENDERER_CHROME_RENDER_FRAME_OBSERVER_H_
#define MISES_RENDERER_CHROME_RENDER_FRAME_OBSERVER_H_


#include "build/build_config.h"
#if BUILDFLAG(IS_ANDROID)

#define web_cache_impl_\
  web_cache_impl_Unused;\
  std::vector<std::u16string> webui_javascript_;\
  web_cache::WebCacheImpl* web_cache_impl_

#endif

#include "src/chrome/renderer/chrome_render_frame_observer.h"
#if BUILDFLAG(IS_ANDROID)

#undef web_cache_impl_

#endif

#endif  // CHROME_RENDERER_CHROME_RENDER_FRAME_OBSERVER_H_
