//
// Created by cg on 2023/1/3.
//

#ifndef MISES_COMPONENTS_SAFE_BROWSING_ANDROID_SAFE_BROWSING_MISES_H
#define MISES_COMPONENTS_SAFE_BROWSING_ANDROID_SAFE_BROWSING_MISES_H

#include <memory>
#include <string>
#include <vector>

#include "base/compiler_specific.h"
#include "base/memory/raw_ptr.h"
#include "base/memory/weak_ptr.h"
#include "services/network/public/cpp/shared_url_loader_factory.h"
#include "services/network/public/cpp/weak_wrapper_shared_url_loader_factory.h"
#include "services/network/test/test_url_loader_factory.h"
#include "chrome/browser/net/system_network_context_manager.h"
#include "components/safe_browsing/android/safe_browsing_api_handler_bridge.h"
#include "components/safe_browsing/core/browser/db/v4_protocol_manager_util.h"

class GURL;

namespace network {
class SharedURLLoaderFactory;
class SimpleURLLoader;
}

namespace safe_browsing {
struct ThreatMetadata;
// SafeBrowsing serving Mises.
class SafeBrowsingMises  {
 public:
  explicit SafeBrowsingMises(scoped_refptr<network::SharedURLLoaderFactory> url_loader_factory);
  using ResponseCallback =
      base::OnceCallback<void(int)>;
 void StartMisesURLCheck(std::unique_ptr<SafeBrowsingApiHandlerBridge::ResponseCallback> callback,const GURL& url);
  
  ~SafeBrowsingMises();

 private:

  void OnURLLoadComplete(const network::SimpleURLLoader* source,
                         std::unique_ptr<std::string> response_body);

  scoped_refptr<network::SharedURLLoaderFactory> url_loader_factory_;

  std::unique_ptr<network::SimpleURLLoader> simple_url_loader_;

  std::unique_ptr<SafeBrowsingApiHandlerBridge::ResponseCallback> callback_;

};

}  // namespace safe_browsing

#endif  // MISES_COMPONENTS_SAFE_BROWSING_ANDROID_SAFE_BROWSING_MISES_H
