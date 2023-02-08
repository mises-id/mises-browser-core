// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

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
#include "services/network/public/cpp/url_loader_completion_status.h"
#include "services/network/public/mojom/url_loader.mojom.h"
#include "services/network/public/mojom/url_response_head.mojom.h"

#include "mises/components/ipfs/ipfs_constants.h"
#include "mises/components/ipfs/ipfs_utils.h"
#include "mises/browser/net/decentralized_dns_network_delegate_helper.h"

namespace ipfs {

namespace {

class PluginResponseWriter final {
 public:
  PluginResponseWriter(
      mojo::PendingRemote<network::mojom::URLLoaderClient> client, const GURL& url);
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
  void OnWrite(base::OnceClosure done_callback, MojoResult result);

  std::string body_;
  mojo::Remote<network::mojom::URLLoaderClient> client_;
  std::unique_ptr<mojo::DataPipeProducer> producer_;
};


// Generates a response ready to be used for creating the PDF loader. The
// returned value is a raw string in which the escape characters are not
// processed.
// Note: This function is security sensitive since it defines the boundary of
// HTML and the embedded PDF. Must limit information shared with the PDF plugin
// process through this response.
std::string GenerateResponse(const GURL& url) {

  static constexpr char kResponseTemplate[] = R"(<!DOCTYPE html>
<html>
<head>
<style>
.container {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.lds-ring {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-ring div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 64px;
  height: 64px;
  margin: 8px;
  border: 8px solid #fff;
  border-radius: 50%;
  animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: #999 transparent transparent transparent;
}
.lds-ring div:nth-child(1) {
  animation-delay: -0.45s;
}
.lds-ring div:nth-child(2) {
  animation-delay: -0.3s;
}
.lds-ring div:nth-child(3) {
  animation-delay: -0.15s;
}
@keyframes lds-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
<script>
fetch('$1')
    .then(function(response) {
        // When the page is loaded convert it to text
        return response.text()
    })
    .then(function(html) {
      document.open();
      document.write(html);
      document.close();
    })
    .catch(function(err) {  
        console.log('Failed to fetch page: ', err);  
    });
</script>
</head>
<body>
<div class="container">
 <div class="lds-ring"><div></div><div></div><div></div><div></div></div> 
 </div>
</body>
</html>
)";

  return base::ReplaceStringPlaceholders(
      kResponseTemplate,
      {url.spec()},
      /*offsets=*/nullptr);
}


PluginResponseWriter::PluginResponseWriter(
    mojo::PendingRemote<network::mojom::URLLoaderClient> client, const GURL& url)
    : body_(GenerateResponse(url)), client_(std::move(client)) {}

PluginResponseWriter::~PluginResponseWriter() = default;

void PluginResponseWriter::Start(base::OnceClosure done_callback) {
  auto response = network::mojom::URLResponseHead::New();
  response->headers =
      base::MakeRefCounted<net::HttpResponseHeaders>("HTTP/1.1 200 OK");
  response->mime_type = "text/html";

  mojo::ScopedDataPipeProducerHandle producer;
  mojo::ScopedDataPipeConsumerHandle consumer;
  if (mojo::CreateDataPipe(nullptr, producer, consumer) != MOJO_RESULT_OK) {
    client_->OnComplete(
        network::URLLoaderCompletionStatus(net::ERR_INSUFFICIENT_RESOURCES));
    std::move(done_callback).Run();
    return;
  }

  client_->OnReceiveResponse(std::move(response), std::move(consumer));

  producer_ = std::make_unique<mojo::DataPipeProducer>(std::move(producer));

  // Caller is required to keep `this` alive until `done_callback` is called, so
  // `base::Unretained(this)` should be safe.
  producer_->Write(
      std::make_unique<mojo::StringDataSource>(
          body_, mojo::StringDataSource::AsyncWritingMode::
                     STRING_STAYS_VALID_UNTIL_COMPLETION),
      base::BindOnce(&PluginResponseWriter::OnWrite, base::Unretained(this),
                     std::move(done_callback)));
}

void PluginResponseWriter::OnWrite(base::OnceClosure done_callback,
                                   MojoResult result) {
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

  std::move(done_callback).Run();
}


void FinishLoader(std::unique_ptr<PluginResponseWriter> /*response_writer*/) {
  // Implicitly deletes `PluginResponseWriter` after loading completes.
}

void CreateLoaderAndStart(
    const network::ResourceRequest& request,
    mojo::PendingReceiver<network::mojom::URLLoader> receiver,
    mojo::PendingRemote<network::mojom::URLLoaderClient> client) {
  auto response_writer =
      std::make_unique<PluginResponseWriter>(std::move(client), request.url);

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
  std::move(callback).Run(CreateRequestHandler(tentative_resource_request));
}

content::URLLoaderRequestInterceptor::RequestHandler
IPFSURLLoaderRequestInterceptor::CreateRequestHandler(
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

  return base::BindOnce(&CreateLoaderAndStart);
}

}  // namespace pdf
