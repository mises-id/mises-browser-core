#ifndef MISES_BROWSER_MEDIA_WEBRTC_MEDIA_STREAM_FOCUS_DELEGATE_H_
#define MISES_BROWSER_MEDIA_WEBRTC_MEDIA_STREAM_FOCUS_DELEGATE_H_

#include "build/build_config.h"


#if BUILDFLAG(IS_ANDROID)

#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (0)


#include "src/chrome/browser/media/webrtc/media_stream_focus_delegate.h"
#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (1)

#else

#include "src/chrome/browser/media/webrtc/media_stream_focus_delegate.h"


#endif


#endif  // CHROME_BROWSER_MEDIA_WEBRTC_MEDIA_STREAM_FOCUS_DELEGATE_H_
