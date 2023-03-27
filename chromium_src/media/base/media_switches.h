#ifndef MISES_MEDIA_BASE_MEDIA_SWITCHES_H_
#define MISES_MEDIA_BASE_MEDIA_SWITCHES_H_

#include "src/media/base/media_switches.h"

namespace media {

#if BUILDFLAG(IS_ANDROID)
MEDIA_EXPORT BASE_DECLARE_FEATURE(kMediaRemotingWithoutFullscreen);
#endif

}  // namespace media

#endif  // MEDIA_BASE_MEDIA_SWITCHES_H_
