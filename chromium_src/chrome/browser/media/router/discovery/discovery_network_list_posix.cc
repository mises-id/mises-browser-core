

#include "build/build_config.h"
#if !BUILDFLAG(IS_ANDROID)
#include "src/chrome/browser/media/router/discovery/discovery_network_list_posix.cc"

#else

#include "chrome/browser/media/router/discovery/discovery_network_list.h"
namespace media_router {
  std::vector<DiscoveryNetworkInfo> GetDiscoveryNetworkInfoList() {
    std::vector<DiscoveryNetworkInfo> network_ids;
    return network_ids;
  }
}
#endif

