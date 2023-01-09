//
// Created by cg on 2023/1/3.
//

#include "components/safe_browsing/android/safe_browsing_mises.h"


#include <string>

#include "base/logging.h"
#include "base/strings/utf_string_conversions.h"
#include "base/trace_event/trace_event.h"
#include "chrome/browser/browser_process.h"
#include "services/network/public/cpp/resource_request.h"
#include "services/network/public/cpp/shared_url_loader_factory.h"
#include "services/network/public/cpp/simple_url_loader.h"
#include "services/network/public/mojom/url_response_head.mojom.h"
#include "net/traffic_annotation/network_traffic_annotation.h"
#include "components/safe_browsing/android/safe_browsing_api_handler_util.h"
#include "base/json/json_string_value_serializer.h"
#include "net/http/http_status_code.h"
#include "chrome/browser/net/system_network_context_manager.h"
#include "components/safe_browsing/android/safe_browsing_api_handler_bridge.h"
#include "content/public/browser/browser_task_traits.h"
#include "content/public/browser/browser_thread.h"

using content::BrowserThread;

namespace safe_browsing {
namespace {

}  // namespace

SafeBrowsingMises::SafeBrowsingMises(scoped_refptr<network::SharedURLLoaderFactory> url_loader_factory):url_loader_factory_(url_loader_factory)
{
   LOG(INFO) << "Cg SafeBrowsingMises::SafeBrowsingMises(com_safe_android) -1";
  //scoped_refptr<network::SharedURLLoaderFactory> url_loader_factory = g_browser_process->shared_url_loader_factory();
   //LOG(INFO) << "Cg SafeBrowsingMises::SafeBrowsingMises(com_safe_android) -2";
   //url_loader_factory_ = std::move(url_loader_factory);
} 

SafeBrowsingMises::~SafeBrowsingMises() = default;

void SafeBrowsingMises::StartMisesURLCheck(std::unique_ptr<SafeBrowsingApiHandlerBridge::ResponseCallback> callback,const GURL& url){
  callback_ = std::move(callback);
   std::string domain_name = url.HostNoBrackets();
    LOG(INFO) << "Cg SafeBrowsingMises::StartMisesURLCheck(com_safe_android) -1 domain_name=" << domain_name;
    net::NetworkTrafficAnnotationTag traffic_annotation =
            net::DefineNetworkTrafficAnnotation("mises_url_check", R"(
        semantics {
          sender: "Mises URL Check"
          description:
            "When verifying certificates, the browser may need to fetch "
            "Verifying a certificate (likely in response to navigating to an "
            "'https://' website)."
          data:
            "In the case of OCSP this may divulge the website being viewed. No "
            "user data in other cases."
          destination: OTHER
          destination_other:
            "The URL specified in the mises provider."
        }
        policy {
          cookies_allowed: NO
          setting: "This feature cannot be disabled by settings."
          policy_exception_justification: "Not implemented."
        })");
    GURL misesApiUrl("https://api.test.mises.site/api/v1/phishing_site/check?domain_name=" + domain_name);
    auto resource_request = std::make_unique<network::ResourceRequest>();
    resource_request->url = misesApiUrl;
    resource_request->method = "GET";
    resource_request->credentials_mode = network::mojom::CredentialsMode::kOmit;
    LOG(INFO) << "Cg SafeBrowsingMises::StartMisesURLCheck(com_safe_android) -2";
    simple_url_loader_ = network::SimpleURLLoader::Create(std::move(resource_request),
                                                          traffic_annotation);
    LOG(INFO) << "Cg SafeBrowsingMises::StartMisesURLCheck(com_safe_android) -3";
   
    simple_url_loader_->DownloadToStringOfUnboundedSizeUntilCrashAndDie(
            url_loader_factory_.get(),
            base::BindOnce(&SafeBrowsingMises::OnURLLoadComplete,
                           base::Unretained(this),simple_url_loader_.get()));
    LOG(INFO) << "Cg SafeBrowsingMises::StartMisesURLCheck(com_safe_android) -4";
}

void RunCallbackOnIOThread(
    std::unique_ptr<SafeBrowsingApiHandlerBridge::ResponseCallback> callback,
    SBThreatType threat_type,
    const ThreatMetadata& metadata) {
  content::GetIOThreadTaskRunner({})->PostTask(
      FROM_HERE, base::BindOnce(std::move(*callback), threat_type, metadata));
}

void SafeBrowsingMises::OnURLLoadComplete(const network::SimpleURLLoader* source,
                                                     std::unique_ptr<std::string> response_body ){
    LOG(INFO) << "Cg SafeBrowsingMises::OnURLLoadComplete -1";
    int response_code = -1;
    if (source->ResponseInfo() &&
        source->ResponseInfo()->headers) {
        response_code =
                source->ResponseInfo()->headers->response_code();
    }
    LOG(INFO) << "Cg SafeBrowsingMises::OnURLLoadComplete code=" << response_code;
    std::string json_string;
    if (response_body)
        json_string = std::move(*response_body);
    LOG(INFO) << "Cg SafeBrowsingMises::OnURLLoadComplete API match string=" << json_string;
    
    JSONStringValueDeserializer deserializer(json_string);
    std::string error_msg;
    std::unique_ptr<base::Value> json_value =
            deserializer.Deserialize(nullptr, &error_msg);

    if (!response_body || (response_code != net::HTTP_OK)) {
        const auto* error_value =
                json_value && json_value->is_dict()
                ? json_value->FindKeyOfType("message",
                                            base::Value::Type::STRING)
                : nullptr;

        LOG(WARNING) << "Server returned wrong response code: " << response_code
                     << ": " << (error_value ? error_value->GetString() : "Unknown")
                     << ".";

    }
        if (!json_value) {
            LOG(WARNING) << "Unable to deserialize auth code json data: " << error_msg
                         << ".";
            return;
        }

        if (!json_value->is_dict()) {
            LOG(WARNING) << "Response is not a JSON dictionary.";
            return;
        }
        auto code = json_value->FindIntKey("code");
        if(!code.has_value() || code.value() != 0){
          RunCallbackOnIOThread(std::move(callback_), SB_THREAT_TYPE_SAFE,
                          ThreatMetadata());
          return;
        }
        base::Value* data = json_value->FindDictKey("data");
        const std::string* type_string = data->FindStringKey("type_string");
        const std::string white_type = "black";
        if (*type_string == white_type){
           RunCallbackOnIOThread(std::move(callback_),SB_THREAT_TYPE_URL_PHISHING ,
                          ThreatMetadata());
          return;
        }else{
           RunCallbackOnIOThread(std::move(callback_),SB_THREAT_TYPE_SAFE ,
                          ThreatMetadata());
          return;
        }
}
}  // namespace safe_browsing