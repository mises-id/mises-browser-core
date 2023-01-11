// Copyright 2016 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

#include "components/safe_browsing/android/safe_browsing_api_handler_bridge.h"

#include <memory>
#include <string>
#include <utility>

#include "base/android/jni_array.h"
#include "base/android/jni_string.h"
#include "base/bind.h"
#include "base/containers/contains.h"
#include "base/containers/flat_set.h"
#include "base/feature_list.h"
#include "base/metrics/histogram_macros.h"
#include "base/trace_event/trace_event.h"
#include "components/safe_browsing/android/jni_headers/SafeBrowsingApiBridge_jni.h"
#include "components/safe_browsing/android/safe_browsing_api_handler_util.h"
#include "components/safe_browsing/core/browser/db/v4_protocol_manager_util.h"
#include "components/safe_browsing/core/common/features.h"
#include "content/public/browser/browser_task_traits.h"
#include "chrome/browser/profiles/profile.h"
#include "content/public/browser/browser_context.h"
#include "content/public/browser/browser_thread.h"
#include "content/public/browser/storage_partition.h"
#include "services/network/public/cpp/resource_request.h"
#include "services/network/public/cpp/shared_url_loader_factory.h"
#include "services/network/public/cpp/simple_url_loader.h"
#include "services/network/public/mojom/url_response_head.mojom.h"
#include "net/traffic_annotation/network_traffic_annotation.h"
#include "base/json/json_string_value_serializer.h"
#include "net/http/http_status_code.h"
#include "chrome/browser/net/system_network_context_manager.h"

using base::android::AttachCurrentThread;
using base::android::ConvertJavaStringToUTF8;
using base::android::ConvertUTF8ToJavaString;
using base::android::JavaParamRef;
using base::android::ScopedJavaLocalRef;
using base::android::ToJavaIntArray;
using content::BrowserThread;
using content::BrowserContext;

namespace safe_browsing {

namespace {

void RunCallbackOnIOThread(
    std::unique_ptr<SafeBrowsingApiHandlerBridge::ResponseCallback> callback,
    SBThreatType threat_type,
    const ThreatMetadata& metadata) {
  content::GetIOThreadTaskRunner({})->PostTask(
      FROM_HERE, base::BindOnce(std::move(*callback), threat_type, metadata));
}

void ReportUmaResult(safe_browsing::UmaRemoteCallResult result) {
  UMA_HISTOGRAM_ENUMERATION("SB2.RemoteCall.Result", result,
                            safe_browsing::UMA_STATUS_MAX_VALUE);
}

// Convert a SBThreatType to a Java threat type.  We only support a few.
int SBThreatTypeToJavaThreatType(const SBThreatType& sb_threat_type) {
  switch (sb_threat_type) {
    case SB_THREAT_TYPE_BILLING:
      return safe_browsing::JAVA_THREAT_TYPE_BILLING;
    case SB_THREAT_TYPE_SUBRESOURCE_FILTER:
      return safe_browsing::JAVA_THREAT_TYPE_SUBRESOURCE_FILTER;
    case SB_THREAT_TYPE_URL_PHISHING:
      return safe_browsing::JAVA_THREAT_TYPE_SOCIAL_ENGINEERING;
    case SB_THREAT_TYPE_URL_MALWARE:
      return safe_browsing::JAVA_THREAT_TYPE_POTENTIALLY_HARMFUL_APPLICATION;
    case SB_THREAT_TYPE_URL_UNWANTED:
      return safe_browsing::JAVA_THREAT_TYPE_UNWANTED_SOFTWARE;
    case SB_THREAT_TYPE_CSD_ALLOWLIST:
      return safe_browsing::JAVA_THREAT_TYPE_CSD_ALLOWLIST;
    case SB_THREAT_TYPE_HIGH_CONFIDENCE_ALLOWLIST:
      return safe_browsing::JAVA_THREAT_TYPE_HIGH_CONFIDENCE_ALLOWLIST;
    default:
      NOTREACHED();
      return 0;
  }
}

// Convert a vector of SBThreatTypes to JavaIntArray of Java threat types.
ScopedJavaLocalRef<jintArray> SBThreatTypeSetToJavaArray(
    JNIEnv* env,
    const SBThreatTypeSet& threat_types) {
  DCHECK_LT(0u, threat_types.size());
  int int_threat_types[threat_types.size()];
  int* itr = &int_threat_types[0];
  for (auto threat_type : threat_types) {
    *itr++ = SBThreatTypeToJavaThreatType(threat_type);
  }
  return ToJavaIntArray(env, int_threat_types, threat_types.size());
}

// The map that holds the callback_id used to reference each pending request
// sent to Java, and the corresponding callback to call on receiving the
// response.
typedef std::unordered_map<
    jlong,
    std::unique_ptr<SafeBrowsingApiHandlerBridge::ResponseCallback>>
    PendingCallbacksMap;

static PendingCallbacksMap* GetPendingCallbacksMapOnIOThread() {
  DCHECK_CURRENTLY_ON(BrowserThread::IO);

  // Holds the list of callback objects that we are currently waiting to hear
  // the result of from GmsCore.
  // The key is a unique count-up integer.
  static PendingCallbacksMap pending_callbacks;
  return &pending_callbacks;
}

bool StartAllowlistCheck(const GURL& url, const SBThreatType& sb_threat_type) {
  DCHECK_CURRENTLY_ON(BrowserThread::IO);
  JNIEnv* env = AttachCurrentThread();
  if (!Java_SafeBrowsingApiBridge_ensureInitialized(env)) {
    return false;
  }

  ScopedJavaLocalRef<jstring> j_url = ConvertUTF8ToJavaString(env, url.spec());
  int j_threat_type = SBThreatTypeToJavaThreatType(sb_threat_type);
  return Java_SafeBrowsingApiBridge_startAllowlistLookup(env, j_url,
                                                         j_threat_type);
}

}  // namespace

// static
SafeBrowsingApiHandlerBridge& SafeBrowsingApiHandlerBridge::GetInstance() {
  static base::NoDestructor<SafeBrowsingApiHandlerBridge> instance;
  return *instance.get();
}

// Respond to the URL reputation request by looking up the callback information
// stored in |pending_callbacks|.
//   |callback_id| is an int form of pointer to a ::ResponseCallback
//                 that will be called and then deleted here.
//   |result_status| is one of those from SafeBrowsingApiHandlerBridge.java
//   |metadata| is a JSON string classifying the threat if there is one.
void OnUrlCheckDoneOnIOThread(jlong callback_id,
                              jint result_status,
                              const std::string metadata) {
  DCHECK_CURRENTLY_ON(BrowserThread::IO);

  PendingCallbacksMap* pending_callbacks = GetPendingCallbacksMapOnIOThread();
  bool found = base::Contains(*pending_callbacks, callback_id);
  DCHECK(found) << "Not found in pending_callbacks: " << callback_id;
  if (!found)
    return;

  std::unique_ptr<SafeBrowsingApiHandlerBridge::ResponseCallback> callback =
      std::move((*pending_callbacks)[callback_id]);
  pending_callbacks->erase(callback_id);

  if (result_status != RESULT_STATUS_SUCCESS) {
    if (result_status == RESULT_STATUS_TIMEOUT) {
      ReportUmaResult(UMA_STATUS_TIMEOUT);
    } else {
      DCHECK_EQ(result_status, RESULT_STATUS_INTERNAL_ERROR);
      ReportUmaResult(UMA_STATUS_INTERNAL_ERROR);
    }
    std::move(*callback).Run(SB_THREAT_TYPE_SAFE, ThreatMetadata());
    return;
  }

  // Shortcut for safe, so we don't have to parse JSON.
  if (metadata == "{}") {
    ReportUmaResult(UMA_STATUS_SAFE);
    std::move(*callback).Run(SB_THREAT_TYPE_SAFE, ThreatMetadata());
  } else {
    // Unsafe, assuming we can parse the JSON.
    SBThreatType worst_threat;
    ThreatMetadata threat_metadata;
    ReportUmaResult(
        ParseJsonFromGMSCore(metadata, &worst_threat, &threat_metadata));

    std::move(*callback).Run(worst_threat, threat_metadata);
  }
}


// Java->Native call, invoked when a check is done.
//   |callback_id| is a key into the |pending_callbacks_| map, whose value is a
//                 ::ResponseCallback that will be called and then deleted on
//                 the IO thread.
//   |result_status| is a @SafeBrowsingResult from SafeBrowsingApiHandler.java
//   |metadata| is a JSON string classifying the threat if there is one.
//   |check_delta| is the number of microseconds it took to look up the URL
//                 reputation from GmsCore.
//
//   Careful note: this can be called on multiple threads, so make sure there is
//   nothing thread unsafe happening here.
void JNI_SafeBrowsingApiBridge_OnUrlCheckDone(
    JNIEnv* env,
    jlong callback_id,
    jint result_status,
    const JavaParamRef<jstring>& metadata,
    jlong check_delta) {
  UMA_HISTOGRAM_COUNTS_10M("SB2.RemoteCall.CheckDelta", check_delta);

  const std::string metadata_str =
      (metadata ? ConvertJavaStringToUTF8(env, metadata) : "");

  TRACE_EVENT1("safe_browsing", "SafeBrowsingApiHandlerBridge::OnUrlCheckDone",
               "metadata", metadata_str);

  content::GetIOThreadTaskRunner({})->PostTask(
      FROM_HERE, base::BindOnce(&OnUrlCheckDoneOnIOThread, callback_id,
                                result_status, metadata_str));
}

//
// SafeBrowsingApiHandlerBridge
//
SafeBrowsingApiHandlerBridge::~SafeBrowsingApiHandlerBridge() {}

void SafeBrowsingApiHandlerBridge::StartURLCheck(
    std::unique_ptr<ResponseCallback> callback,
    const GURL& url,
    const SBThreatTypeSet& threat_types) {
  if (interceptor_for_testing_) {
    // For testing, only check the interceptor.
    interceptor_for_testing_->Check(std::move(callback), url);
    return;
  }
  LOG(INFO) << "Cg SafeBrowsingApiHandlerBridge::StartURLCheck(com_safe_android) url=" << url 
      << ",url_HostNoBrackets=" << url.HostNoBrackets()
      << ",url_ExtractFileName=" << url.ExtractFileName()
      << ",url_with_empty_path=" << url.GetWithEmptyPath()
      << ",url_without_filename" << url.GetWithoutFilename();

  DCHECK_CURRENTLY_ON(BrowserThread::IO);
    if (url.SchemeIsHTTPOrHTTPS()){
   /*  if (url == "https://admin.mises.site/"){
     RunCallbackOnIOThread(std::move(callback), SB_THREAT_TYPE_URL_CLIENT_SIDE_PHISHING,
                          ThreatMetadata());
     return;
  }
  if (url == "https://home.mises.site/"){
     RunCallbackOnIOThread(std::move(callback), SB_THREAT_TYPE_SUSPICIOUS_SITE,
                          ThreatMetadata());
     return;
  } */
     StartMisesCheck(std::move(callback),url);
    return;                    
  }
  JNIEnv* env = AttachCurrentThread();
  if (!Java_SafeBrowsingApiBridge_ensureInitialized(env)) {
    // Mark all requests as safe. Only users who have an old, broken GMSCore or
    // have sideloaded Chrome w/o PlayStore should land here.
    RunCallbackOnIOThread(std::move(callback), SB_THREAT_TYPE_SAFE,
                          ThreatMetadata());
    ReportUmaResult(UMA_STATUS_UNSUPPORTED);
    return;
  }

  jlong callback_id = next_callback_id_++;
  GetPendingCallbacksMapOnIOThread()->insert(
      {callback_id, std::move(callback)});

  DCHECK(!threat_types.empty());

  ScopedJavaLocalRef<jstring> j_url = ConvertUTF8ToJavaString(env, url.spec());
  ScopedJavaLocalRef<jintArray> j_threat_types =
      SBThreatTypeSetToJavaArray(env, threat_types);

  Java_SafeBrowsingApiBridge_startUriLookup(env, callback_id, j_url,
                                            j_threat_types);
}


void SafeBrowsingApiHandlerBridge::StartMisesCheck(std::unique_ptr<SafeBrowsingApiHandlerBridge::ResponseCallback> callback,const GURL& url){
   callback_ = std::move(callback);
   std::string domain_name = url.HostNoBrackets();
    LOG(INFO) << "Cg SafeBrowsingApiHandlerBridge::StartMisesCheck(com_safe_android) -1 domain_name=" << domain_name;
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
    LOG(INFO) << "Cg SafeBrowsingMises::StartMisesCheck(com_safe_android) -2";
    std::unique_ptr<network::SimpleURLLoader> simple_url_loader_ = network::SimpleURLLoader::Create(std::move(resource_request),
                                                          traffic_annotation);
    LOG(INFO) << "Cg SafeBrowsingMises::StartMisesCheck(com_safe_android) -3";
    scoped_refptr<network::SharedURLLoaderFactory> url_loader_factory = content::BrowserContext::GetDefaultStoragePartition()->GetURLLoaderFactoryForBrowserProcess();
   LOG(INFO) << "Cg SafeBrowsingMises::StartMisesCheck(com_safe_android) -4";
    //scoped_refptr<network::SharedURLLoaderFactory> url_loader_factory_ = std::move(url_loader_factory);
    simple_url_loader_->DownloadToStringOfUnboundedSizeUntilCrashAndDie(
            url_loader_factory.get(),
            base::BindOnce(&SafeBrowsingApiHandlerBridge::OnMisesURLLoadComplete,
                           base::Unretained(this),simple_url_loader_.get()));
    LOG(INFO) << "Cg SafeBrowsingMises::StartMisesURLCheck(com_safe_android) -4";
}

void SafeBrowsingApiHandlerBridge::OnMisesURLLoadComplete(const network::SimpleURLLoader* source,
                                                     std::unique_ptr<std::string> response_body ){
    LOG(INFO) << "Cg SafeBrowsingMises::OnMisesURLLoadComplete -1";
    int response_code = -1;
    if (source->ResponseInfo() &&
        source->ResponseInfo()->headers) {
        response_code =
                source->ResponseInfo()->headers->response_code();
    }
    LOG(INFO) << "Cg SafeBrowsingMises::OnMisesURLLoadComplete code=" << response_code;
    std::string json_string;
    if (response_body)
        json_string = std::move(*response_body);
    LOG(INFO) << "Cg SafeBrowsingMises::OnMisesURLLoadComplete API match string=" << json_string;
    
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
        const std::string white_type = "white";
        if (*type_string == white_type){
           RunCallbackOnIOThread(std::move(callback_), SB_THREAT_TYPE_SAFE,
                          ThreatMetadata());
          return;
        }else{
           RunCallbackOnIOThread(std::move(callback_), SB_THREAT_TYPE_BLOCKLISTED_RESOURCE,
                          ThreatMetadata());
          return;
        }
}


bool SafeBrowsingApiHandlerBridge::StartCSDAllowlistCheck(const GURL& url) {
  if (interceptor_for_testing_)
    return false;
  return StartAllowlistCheck(url, safe_browsing::SB_THREAT_TYPE_CSD_ALLOWLIST);
}

bool SafeBrowsingApiHandlerBridge::StartHighConfidenceAllowlistCheck(
    const GURL& url) {
  if (interceptor_for_testing_)
    return false;
  return StartAllowlistCheck(
      url, safe_browsing::SB_THREAT_TYPE_HIGH_CONFIDENCE_ALLOWLIST);
}

}  // namespace safe_browsing
