#include "src/media/base/media_switches.cc"

#if BUILDFLAG(IS_ANDROID)

namespace media {


// If enabled, users can request Media Remoting without fullscreen-in-tab.
BASE_FEATURE(kMediaRemotingWithoutFullscreen,
             "MediaRemotingWithoutFullscreen",
             base::FEATURE_DISABLED_BY_DEFAULT);


}  // namespace media

namespace switches {

const char kCastMirroringTargetPlayoutDelay[] =
    "cast-mirroring-target-playout-delay";

}



#endif

