#ifndef MISES_MEDIA_BASE_MEDIA_SWITCHES_H_
#define MISES_MEDIA_BASE_MEDIA_SWITCHES_H_

#include "src/media/base/media_switches.h"

#if BUILDFLAG(IS_ANDROID)

namespace media {

MEDIA_EXPORT BASE_DECLARE_FEATURE(kMediaRemotingWithoutFullscreen);

}  // namespace media

namespace switches {
  MEDIA_EXPORT extern const char kCastMirroringTargetPlayoutDelay[];
}

#endif
#endif  // MEDIA_BASE_MEDIA_SWITCHES_H_
