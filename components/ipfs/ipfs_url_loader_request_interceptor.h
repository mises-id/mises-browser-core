#ifndef MISES_COMPONENTS_IPFS_IPFS_URL_LOADER_REQUEST_INTERCEPTOR_H_
#define MISES_COMPONENTS_IPFS_IPFS_URL_LOADER_REQUEST_INTERCEPTOR_H_

#include <memory>

#include "content/public/browser/url_loader_request_interceptor.h"

namespace ipfs {


class IPFSURLLoaderRequestInterceptor final
    : public content::URLLoaderRequestInterceptor {
 public:
  static std::unique_ptr<content::URLLoaderRequestInterceptor>
  MaybeCreateInterceptor(int frame_tree_node_id);

  IPFSURLLoaderRequestInterceptor(
      int frame_tree_node_id);
  IPFSURLLoaderRequestInterceptor(const IPFSURLLoaderRequestInterceptor&) =
      delete;
  IPFSURLLoaderRequestInterceptor& operator=(
      const IPFSURLLoaderRequestInterceptor&) = delete;
  ~IPFSURLLoaderRequestInterceptor() override;

  // `content::URLLoaderRequestInterceptor`:
  void MaybeCreateLoader(
      const network::ResourceRequest& tentative_resource_request,
      content::BrowserContext* browser_context,
      content::URLLoaderRequestInterceptor::LoaderCallback callback) override;

 private:
  RequestHandler CreateRequestHandler(
      content::BrowserContext* browser_context,
      const network::ResourceRequest& tentative_resource_request);

  int frame_tree_node_id_;
};

}  // namespace pdf

#endif  // COMPONENTS_IPFS_IPFS_URL_LOADER_REQUEST_INTERCEPTOR_H_
