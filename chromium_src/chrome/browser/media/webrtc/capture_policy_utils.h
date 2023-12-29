#ifndef MISES_BROWSER_MEDIA_WEBRTC_MEDIA_CAPTURE_POLICY_UTILS_H_
#define MISES_BROWSER_MEDIA_WEBRTC_MEDIA_CAPTURE_POLICY_UTILS_H_

#include "build/build_config.h"
#include <vector>

#include "chrome/browser/media/webrtc/desktop_media_list.h"


#if BUILDFLAG(IS_ANDROID)

#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (0)


#include "src/chrome/browser/media/webrtc/capture_policy_utils.h"
#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (1)

#else

#include "src/chrome/browser/media/webrtc/capture_policy_utils.h"


#endif


#endif  // CHROME_BROWSER_MEDIA_WEBRTC_MEDIA_STREAM_FOCUS_DELEGATE_H_
