#include "mises/components/ipfs/ipfs_url_loader_request_interceptor.h"

#include <memory>
#include <utility>

#include "base/bind.h"
#include "content/public/browser/url_loader_request_interceptor.h"
#include "content/public/browser/web_contents.h"
#include "mojo/public/cpp/bindings/pending_receiver.h"
#include "mojo/public/cpp/bindings/pending_remote.h"
#include "services/network/public/cpp/resource_request.h"
#include "services/network/public/mojom/fetch_api.mojom-shared.h"
#include "services/network/public/mojom/url_loader.mojom-forward.h"
#include "third_party/abseil-cpp/absl/types/optional.h"
#include "content/public/browser/browser_context.h"
#include "content/public/browser/storage_partition.h"
#include "services/network/public/cpp/simple_url_loader.h"
#include "services/network/public/cpp/wrapper_shared_url_loader_factory.h"
#include "url/gurl.h"

#include <memory>
#include <string>
#include <utility>

#include "base/bind.h"
#include "base/callback.h"
#include "base/check_op.h"
#include "base/memory/scoped_refptr.h"
#include "base/strings/string_number_conversions.h"
#include "base/strings/string_util.h"
#include "mojo/public/c/system/types.h"
#include "mojo/public/cpp/bindings/pending_remote.h"
#include "mojo/public/cpp/system/data_pipe.h"
#include "mojo/public/cpp/system/data_pipe_producer.h"
#include "mojo/public/cpp/system/string_data_source.h"
#include "net/base/net_errors.h"
#include "net/http/http_response_headers.h"
#include "net/http/http_util.h"
#include "net/url_request/redirect_info.h"
#include "net/url_request/redirect_util.h"
#include "services/network/public/cpp/url_loader_completion_status.h"
#include "services/network/public/mojom/url_loader.mojom.h"
#include "services/network/public/mojom/url_response_head.mojom.h"
#include "mojo/public/cpp/bindings/self_owned_receiver.h"


#include "mises/browser/net/mises_proxying_url_loader_factory.h"
#include "mises/browser/net/resource_context_data.h"
#include "mises/browser/net/url_context.h"
#include "mises/browser/net/mises_request_handler.h"
#include "mises/browser/net/decentralized_dns_network_delegate_helper.h"

#include "mises/browser/ipfs/content_browser_client_helper.h"
#include "mises/browser/ipfs/ipfs_service_factory.h"
#include "mises/browser/ipfs/ipfs_subframe_navigation_throttle.h"
#include "mises/components/ipfs/ipfs_navigation_throttle.h"
#include "mises/components/ipfs/ipfs_constants.h"
#include "mises/components/ipfs/ipfs_utils.h"

namespace ipfs {

namespace {

class PluginResponseWriter final {
 public:
  PluginResponseWriter(content::BrowserContext* browser_context,
      mojo::PendingRemote<network::mojom::URLLoaderClient> client, const network::ResourceRequest& request);
  PluginResponseWriter(const PluginResponseWriter&) = delete;
  PluginResponseWriter& operator=(const PluginResponseWriter&) = delete;
  ~PluginResponseWriter();

  // Starts sending the response, calling `done_callback` once the entire
  // response is sent to (but not necessarily received by) the
  // `URLLoaderClient`.
  //
  // Caller is responsible for keeping this response writer alive until
  // `done_callback` is called.
  void Start(base::OnceClosure done_callback);

 private:
  void OnWrite( MojoResult result);
  void OnURLLoaderComplete(std::unique_ptr<std::string> response_body);
  void OnURLRedirect( const GURL& new_url);
  void LoaderCallback(
    const network::ResourceRequest& resource_request,
    mojo::PendingReceiver<network::mojom::URLLoader> pending_receiver,
    mojo::PendingRemote<network::mojom::URLLoaderClient> pending_client);
  void ContinueToBeforeSendHeaders(int error_code);
  std::string body_;
  GURL redirect_url_;
  mojo::Remote<network::mojom::URLLoaderClient> client_;
  std::unique_ptr<mojo::DataPipeProducer> producer_;
  std::unique_ptr<network::SimpleURLLoader> simple_loader_;
  scoped_refptr<network::SharedURLLoaderFactory> url_loader_factory_;
  std::unique_ptr<MisesRequestHandler> request_handler_;
  std::shared_ptr<mises::MisesRequestInfo> ctx_;
  base::OnceClosure done_callback_;
  base::WeakPtrFactory<PluginResponseWriter> weak_factory_{this};
};


net::NetworkTrafficAnnotationTag trafficAnnotation() {

 net::NetworkTrafficAnnotationTag traffic_annotation =
      net::DefineNetworkTrafficAnnotation("ipfs load", R"(
        semantics {
          sender: "ipfs loader"
          description:
            "Google Chrome may display a list of regionally-popular web sites "
            "on the New Tab Page. This service fetches the list of these sites."
          trigger:
            "Once per day, unless no popular web sites are required because "
            "the New Tab Page is filled with suggestions based on the user's "
            "browsing history."
          data: "A two letter country code based on the user's location."
          destination: GOOGLE_OWNED_SERVICE
        }
        policy {
          cookies_allowed: NO
          setting: "This feature cannot be disabled in settings."
          policy_exception_justification:
            "Not implemented, considered not useful."
        })");
  return traffic_annotation;
}


PluginResponseWriter::PluginResponseWriter(
    content::BrowserContext* browser_context,
    mojo::PendingRemote<network::mojom::URLLoaderClient> client, const network::ResourceRequest&  request)
    : client_(std::move(client)) {


  auto resource_request = std::make_unique<network::ResourceRequest>();
  resource_request->url = request.url;
  //resource_request->credentials_mode = network::mojom::CredentialsMode::kOmit;
  url_loader_factory_ = browser_context->GetDefaultStoragePartition()
                          ->GetURLLoaderFactoryForBrowserProcess();

  request_handler_ = std::make_unique<MisesRequestHandler>();    
  redirect_url_ = GURL();
  ctx_ = mises::MisesRequestInfo::MakeCTX(request, 0,
                                          0, 0,
                                          browser_context,  nullptr);                                             

}
void PluginResponseWriter::LoaderCallback(
    const network::ResourceRequest& resource_request,
    mojo::PendingReceiver<network::mojom::URLLoader> pending_receiver,
    mojo::PendingRemote<network::mojom::URLLoaderClient> pending_client) {

}

PluginResponseWriter::~PluginResponseWriter() {
    
    
};

void PluginResponseWriter::OnURLRedirect( const GURL& new_url) {
  //LOG(INFO) << "PluginResponseWriter::OnURLRedirect " << new_url.spec();
  auto response = network::mojom::URLResponseHead::New();
  constexpr int kInternalRedirectStatusCode = 307;
  std::string headers = base::StringPrintf(
    "HTTP/1.1 %i Internal Redirect\n"
    "Location: %s\n"
    "Non-Authoritative-Reason: WebRequest API\n\n",
    kInternalRedirectStatusCode, new_url.spec().c_str());
  response->headers = base::MakeRefCounted<net::HttpResponseHeaders>(
      net::HttpUtil::AssembleRawHeaders(headers));
  response->encoded_data_length = 0;

  net::RedirectInfo redirect_info = net::RedirectInfo::ComputeRedirectInfo(
      net::HttpRequestHeaders::kGetMethod, ctx_->request_url,
      net::SiteForCookies::FromUrl(ctx_->request_url),
      net::RedirectInfo::FirstPartyURLPolicy::UPDATE_URL_ON_REDIRECT,
      ctx_->referrer_policy, ctx_->referrer.spec(),
      kInternalRedirectStatusCode, new_url, absl::nullopt,
      false /* insecure_scheme_was_upgraded */, false /* copy_fragment */,
      false /* is_signed_exchange_fallback_redirect */);
  client_->OnReceiveRedirect(redirect_info, std::move(response));
  network::URLLoaderCompletionStatus status(net::OK);
  client_->OnComplete(status);
  std::move(done_callback_).Run();
  return;
}

void PluginResponseWriter::OnURLLoaderComplete( std::unique_ptr<std::string> response_body) {
  int response_code = -1;
  if (simple_loader_->ResponseInfo() && simple_loader_->ResponseInfo()->headers) {
    response_code = simple_loader_->ResponseInfo()->headers->response_code();
  }
    
  simple_loader_.reset();
  auto response = network::mojom::URLResponseHead::New();
  response->headers =
      base::MakeRefCounted<net::HttpResponseHeaders>("HTTP/1.1 200 OK");
  response->mime_type = "text/html";

  mojo::ScopedDataPipeProducerHandle producer;
  mojo::ScopedDataPipeConsumerHandle consumer;
  if (response_code == -1 || !response_body || mojo::CreateDataPipe(nullptr, producer, consumer) != MOJO_RESULT_OK) {
    client_->OnComplete(
        network::URLLoaderCompletionStatus(net::ERR_FAILED));
    std::move(done_callback_).Run();
    return;
  }

  client_->OnReceiveResponse(std::move(response), std::move(consumer));

  producer_ = std::make_unique<mojo::DataPipeProducer>(std::move(producer));

  // Caller is required to keep `this` alive until `done_callback` is called, so
  // `base::Unretained(this)` should be safe.
  body_ = *response_body;
  producer_->Write(
      std::make_unique<mojo::StringDataSource>(
          body_, mojo::StringDataSource::AsyncWritingMode::
                     STRING_STAYS_VALID_UNTIL_COMPLETION),
      base::BindOnce(&PluginResponseWriter::OnWrite, base::Unretained(this)));
}

void PluginResponseWriter::
    ContinueToBeforeSendHeaders(int error_code) {
  //LOG(INFO) << "PluginResponseWriter::ContinueToBeforeSendHeaders " << error_code << ", "  << ctx_->provider_error << ", " << ctx_->request_identifier << ", " << ctx_->new_url_spec;
  if (error_code != net::OK) {
    client_->OnComplete(network::URLLoaderCompletionStatus(net::ERR_FAILED));
    std::move(done_callback_).Run();
    return;
  }
    
    GURL new_url = GURL(ctx_->new_url_spec);
    if (!new_url.is_valid()) {
      GURL failover_url = GURL(ctx_->failover_url_spec);
      if (failover_url.is_valid()) {
        OnURLRedirect(failover_url);
      } else {
        client_->OnComplete(network::URLLoaderCompletionStatus(net::ERR_FAILED));
        std::move(done_callback_).Run();
      }
      return;
    }
    if (new_url.SchemeIsHTTPOrHTTPS()) {

      auto resource_request = std::make_unique<network::ResourceRequest>();
      resource_request->url = new_url;
  
      simple_loader_ = network::SimpleURLLoader::Create(std::move(resource_request),
                                                     trafficAnnotation());
      simple_loader_->DownloadToStringOfUnboundedSizeUntilCrashAndDie(
          url_loader_factory_.get(), base::BindOnce(&PluginResponseWriter::OnURLLoaderComplete, base::Unretained(this)));
    } else if ( ctx_->request_identifier == 0) {
        base::RepeatingCallback<void(int)> continuation =
            base::BindRepeating(&PluginResponseWriter::ContinueToBeforeSendHeaders,
            weak_factory_.GetWeakPtr());
        network::ResourceRequest request;
        request.url = new_url;
        std::shared_ptr<mises::MisesRequestInfo> ctx = mises::MisesRequestInfo::MakeCTX(request, 0,
                                        0, 1,
                                        ctx_->browser_context,  nullptr); 
        ctx_ = ctx;
        request_handler_->OnBeforeURLRequest(ctx_, continuation, &redirect_url_);
        
    }
}
void  PluginResponseWriter::Start(base::OnceClosure done_callback){

   base::RepeatingCallback<void(int)> continuation =
       base::BindRepeating(&PluginResponseWriter::ContinueToBeforeSendHeaders,
       weak_factory_.GetWeakPtr());
  done_callback_ = std::move(done_callback);
   request_handler_->OnBeforeURLRequest(ctx_, continuation, &redirect_url_);
   

}
void PluginResponseWriter::OnWrite(MojoResult result) {
  producer_.reset();

  if (result == MOJO_RESULT_OK) {
    network::URLLoaderCompletionStatus status(net::OK);
    status.encoded_data_length = body_.size();
    status.encoded_body_length = body_.size();
    status.decoded_body_length = body_.size();
    client_->OnComplete(status);
  } else {
    client_->OnComplete(network::URLLoaderCompletionStatus(net::ERR_FAILED));
  }

  std::move(done_callback_).Run();
}


void FinishLoader(std::unique_ptr<PluginResponseWriter> /*response_writer*/) {
  // Implicitly deletes `PluginResponseWriter` after loading completes.
}

void CreateLoaderAndStart(
    content::BrowserContext* browser_context,
    const network::ResourceRequest& request,
    mojo::PendingReceiver<network::mojom::URLLoader> receiver,
    mojo::PendingRemote<network::mojom::URLLoaderClient> client) {

    
  auto response_writer =
      std::make_unique<PluginResponseWriter>(browser_context, std::move(client), request);

  auto* unowned_response_writer = response_writer.get();
  unowned_response_writer->Start(
      base::BindOnce(FinishLoader, std::move(response_writer)));
}

}  // namespace

// static
std::unique_ptr<content::URLLoaderRequestInterceptor>
IPFSURLLoaderRequestInterceptor::MaybeCreateInterceptor(
    int frame_tree_node_id) {
  return std::make_unique<IPFSURLLoaderRequestInterceptor>(
      frame_tree_node_id);
}

IPFSURLLoaderRequestInterceptor::IPFSURLLoaderRequestInterceptor(
    int frame_tree_node_id)
    : frame_tree_node_id_(frame_tree_node_id) {}

IPFSURLLoaderRequestInterceptor::~IPFSURLLoaderRequestInterceptor() = default;

void IPFSURLLoaderRequestInterceptor::MaybeCreateLoader(
    const network::ResourceRequest& tentative_resource_request,
    content::BrowserContext* browser_context,
    content::URLLoaderRequestInterceptor::LoaderCallback callback) {
  std::move(callback).Run(CreateRequestHandler(browser_context, tentative_resource_request));
}

content::URLLoaderRequestInterceptor::RequestHandler
IPFSURLLoaderRequestInterceptor::CreateRequestHandler(
    content::BrowserContext* browser_context,
    const network::ResourceRequest& tentative_resource_request) {
  // Only intercept navigation requests.
  if (tentative_resource_request.mode != network::mojom::RequestMode::kNavigate)
    return {};

  // Only intercept requests within a `MimeHandlerViewGuest` containing the PDF
  // viewer extension.
  content::WebContents* contents =
      content::WebContents::FromFrameTreeNodeId(frame_tree_node_id_);
  if (!contents)
    return {};

  if (!tentative_resource_request.is_outermost_main_frame) {
    return {};
  }
  if (!ipfs::IsIPFSScheme(tentative_resource_request.url) && !decentralized_dns::ShouldHandleUrl(tentative_resource_request.url)) {
    return {};
  }

  return base::BindOnce(&CreateLoaderAndStart, browser_context);
}

}  // namespace pdf
