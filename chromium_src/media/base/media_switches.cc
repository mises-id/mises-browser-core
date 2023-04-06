#include "src/media/base/media_switches.cc"



namespace media {

#if BUILDFLAG(IS_ANDROID)
// If enabled, users can request Media Remoting without fullscreen-in-tab.
BASE_FEATURE(kMediaRemotingWithoutFullscreen,
             "MediaRemotingWithoutFullscreen",
             base::FEATURE_DISABLED_BY_DEFAULT);
#endif

}  // namespace media

