#include "mises/browser/web3sites_safe/web3sites_safe_service.h"

#include "base/memory/singleton.h"
#include "base/time/default_clock.h"
#include "base/json/json_string_value_serializer.h"
#include "chrome/browser/profiles/profile.h"
#include "components/keyed_service/content/browser_context_dependency_manager.h"
#include "components/keyed_service/content/browser_context_keyed_service_factory.h"
#include "services/network/public/cpp/resource_request.h"
#include "content/public/browser/storage_partition.h"
#include "services/network/public/cpp/shared_url_loader_factory.h"
#include "services/network/public/cpp/simple_url_loader.h"
#include "services/network/public/mojom/url_response_head.mojom.h"
#include "chrome/browser/engagement/site_engagement_service_factory.h"

#include "components/site_engagement/content/site_engagement_score.h"
#include "components/site_engagement/content/site_engagement_service.h"


#include "net/traffic_annotation/network_traffic_annotation.h"
#include "net/http/http_status_code.h"

class Web3sitesSafeServiceFactory : public BrowserContextKeyedServiceFactory {
 public:
  static Web3sitesSafeService* GetForProfile(Profile* profile) {
    return static_cast<Web3sitesSafeService*>(
        GetInstance()->GetServiceForBrowserContext(profile,
                                                   /*create_service=*/true));
  }
  static Web3sitesSafeServiceFactory* GetInstance() {
    return base::Singleton<Web3sitesSafeServiceFactory>::get();
  }

  Web3sitesSafeServiceFactory(const Web3sitesSafeServiceFactory&) = delete;
  Web3sitesSafeServiceFactory& operator=(const Web3sitesSafeServiceFactory&) =
      delete;

 private:
  friend struct base::DefaultSingletonTraits<Web3sitesSafeServiceFactory>;

  // Web3sitesSafeServiceFactory();
  Web3sitesSafeServiceFactory()
      : BrowserContextKeyedServiceFactory(
            "Web3sitesSafeServiceFactory",
            BrowserContextDependencyManager::GetInstance()) {
    DependsOn(site_engagement::SiteEngagementServiceFactory::GetInstance());
  }

  ~Web3sitesSafeServiceFactory() override {}

  // BrowserContextKeyedServiceFactory:
  KeyedService* BuildServiceInstanceFor(
      content::BrowserContext* profile) const override {
    return new Web3sitesSafeService(static_cast<Profile*>(profile));
  }

 /*  content::BrowserContext* GetBrowserContextToUse(
      content::BrowserContext* context) const override {
    return chrome::GetBrowserContextOwnInstanceInIncognito(context);
  } */
};
namespace {
  int GetEditDistance(std::string str1, std::string str2) {
      int m=str1.size(),n=str2.size();
      std::vector<std::vector<int>> dp(2,std::vector<int>(n+1,0));
      for(int j=0;j<=n;j++) dp[0][j]=j;

      for(int i=1;i<=m;i++){
          dp[i%2][0]=i;
          for(int j=1;j<=n;j++){
              if(str1[i-1]==str2[j-1])
                  dp[i%2][j]=dp[(i-1)%2][j-1];
              else dp[i%2][j]=std::min({dp[(i-1)%2][j],dp[i%2][j-1],dp[(i-1)%2][j-1]})+1;
          }
      }
      return dp[m%2][n];
  }
   std::string GetLCS(std::string str1, std::string str2) {
        //dp[i][j]表示到str1第i个个到str2第j个为止的公共子串长度
        std::vector< std::vector<int> > dp(str1.size() + 1,  std::vector<int>(str2.size() + 1, 0));
        int max = 0;
        int pos = 0;
        for(int i = 1; i <= str1.size(); i++){
            for(int j = 1; j <= str2.size(); j++){
                //如果该两位相同
                if(str1[i - 1] == str2[j - 1]){
                    //则增加长度
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                }
                else{
                    //该位置为0
                    dp[i][j] = 0;
                }
                //更新最大长度
                if(dp[i][j] > max){
                    max = dp[i][j];
                    pos = i - 1;
                }
            }
        }
        return str1.substr(pos - max + 1, max);
    }
}
//Web3sitesSafeService
Web3sitesSafeService::Web3sitesSafeService(Profile* profile)
: profile_(profile),
is_fetch_web3sites_(false),
clock_(base::DefaultClock::GetInstance()),
 url_loader_factory_(profile_->GetDefaultStoragePartition()
                        ->GetURLLoaderFactoryForBrowserProcess())
    {
      /* auto url_loader = profile_->GetDefaultStoragePartition()
                        ->GetURLLoaderFactoryForBrowserProcess();
      url_loader_factory_ = std::move(url_loader); */
    }

//~Web3sitesSafeService
Web3sitesSafeService::~Web3sitesSafeService() = default;

// static
Web3sitesSafeService* Web3sitesSafeService::Get(Profile* profile) {
  return Web3sitesSafeServiceFactory::GetForProfile(profile);
}

//CheckWeb3sitesURL
void Web3sitesSafeService::CheckWeb3sitesURL(std::unique_ptr<MisesURLCheckCallback> callback,const GURL& url){
    LOG(INFO) << "Cg Web3sitesSafeService::CheckWeb3sitesURL url=" << url;
    callback_ = std::move(callback);
    check_url_ = url;

    //white list
    if(IsWeb3sitesWhiteList()){
      LOG(INFO) << "Cg Web3sitesSafeService::CheckWeb3sitesURL white list";
      GURL& safe_url = check_url_;
      MisesURLCheckResult check_result(url,Web3sitesResultType::kWhite,safe_url);
      return OnCheckResponse(check_result);
    }

    //black list

    //is needed check
    if (!IsWeb3sitesNeedCheck()){
      LOG(INFO) << "Cg Web3sitesSafeService::CheckWeb3sitesURL not needed checking";
      GURL& safe_url = check_url_;
      MisesURLCheckResult check_result(url,Web3sitesResultType::kWhite,safe_url);
      return OnCheckResponse(check_result);
    }
    StartURLCheck();
}

//IsWeb3sitesWhiteList
bool Web3sitesSafeService::IsWeb3sitesWhiteList() const{
  MisesDomainInfo checkURL = GetMisesDomainInfo(check_url_);
  for(auto web3site : web3sites_origin_){
      if (checkURL.domain_and_registry == web3site.domain_and_registry){
        return true;
      }
  }
  return false;
}

//IsWeb3sitesNeedCheck
bool Web3sitesSafeService::IsWeb3sitesNeedCheck() const{
  LOG(INFO) << "Cg Web3sitesSafeService::IsWeb3sitesNeedCheck";
  MisesDomainInfo checkURL = GetMisesDomainInfo(check_url_);
  //lookalike

  for(auto web3site : web3sites_origin_){
    if (web3site.hostname.empty() || web3site.domain_without_registry.empty()){continue;}
    int edit_distance = GetEditDistance(checkURL.domain_without_registry,web3site.domain_without_registry);
    const std::string lcs_string = GetLCS(checkURL.hostname,web3site.domain_without_registry);
    int check_url_len = web3site.domain_without_registry.size();
    int lcs_len = lcs_string.size();
    float lcs_rate = float(lcs_len) / float(check_url_len);
    if (edit_distance <= 5 || lcs_rate >= 0.6){
      LOG(INFO) << "Cg Web3sitesSafeService::IsWeb3sitesNeedCheck lookalike"
      << ",check_url=" << checkURL.hostname
      << ",web3site=" << web3site.domain_without_registry
      << ",edit_distance=" << edit_distance
      << ",lcs_string=" << lcs_string
      << ",lcs_rate=" << lcs_rate
      ;
      return true;
    }
  }
  return false;
}

//StartURLCheck
void Web3sitesSafeService::StartURLCheck() {
   LOG(INFO) << "Cg Web3sitesSafeService::StartURLCheck";
    net::NetworkTrafficAnnotationTag traffic_annotation =
            net::DefineNetworkTrafficAnnotation("mises_web3sites_phishing_check", R"(
        semantics {
          sender: "Mises Web3sites Phishing Check",
          description:
            "When verifying certificates, the browser may need to fetch "
            "additional URLs that are encoded in the server-provided "
            "certificate chain. This may be part of revocation checking ("
            "Online Certificate Status Protocol, Certificate Revocation List), "
            "or path building (Authority Information Access fetches). Please "
            "refer to the following for more on above protocols: "
            "https://tools.ietf.org/html/rfc6960, "
            "https://tools.ietf.org/html/rfc5280#section-4.2.1.13, and"
            "https://tools.ietf.org/html/rfc5280#section-5.2.7."
          trigger:
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
    GURL phishingCheckApi("https://api.test.mises.site/api/v1/phishing_site/check?domain_name=" + check_url_.spec());
    auto resource_request = std::make_unique<network::ResourceRequest>();
    resource_request->url = phishingCheckApi;
    resource_request->method = "GET";
    resource_request->credentials_mode = network::mojom::CredentialsMode::kOmit;
    simple_url_loader_ = network::SimpleURLLoader::Create(std::move(resource_request),
                                                          traffic_annotation);
    simple_url_loader_->DownloadToStringOfUnboundedSizeUntilCrashAndDie(
            url_loader_factory_.get(),
            base::BindOnce(&Web3sitesSafeService::OnURLCheckCompleted,
                           base::Unretained(this),simple_url_loader_.get()));
}


//OnURLCheckCompleted
void Web3sitesSafeService::OnURLCheckCompleted(const network::SimpleURLLoader* source,
                                    std::unique_ptr<std::string> response_body){
    LOG(INFO) << "Cg Web3sitesSafeService::OnURLCheckCompleted";
    const GURL& url = check_url_;
    GURL& safe_url = check_url_;
    MisesURLCheckResult check_result(url,Web3sitesResultType::kWhite,safe_url);
    int response_code = -1;
    if (source->ResponseInfo() &&
        source->ResponseInfo()->headers) {
        response_code =
                source->ResponseInfo()->headers->response_code();
    }
    std::string json_string;
    if (response_body)
        json_string = std::move(*response_body);
    JSONStringValueDeserializer deserializer(json_string);
    std::string error_msg;
    std::unique_ptr<base::Value> json_value =
            deserializer.Deserialize(nullptr, &error_msg);

    if (!response_body || (response_code != net::HTTP_OK) || !json_value) {
      return OnCheckResponse(check_result);
    }
    if (json_value == nullptr) {
        VLOG(1) << "No mises match found in the response.";
       return OnCheckResponse(check_result);
    }
    LOG(INFO) << "Cg Web3sitesSafeService::OnMisesURLCheckCompleted json_string=" << json_string;
    if (!json_value->is_dict()) {
      return OnCheckResponse(check_result);
    }
    auto result_code = json_value->FindIntKey("code");
    LOG(INFO) << "Cg Web3sitesSafeService::OnURLCheckCompleted"
    << ",result_code=" << *result_code;
    if(*result_code != 0) {
      return OnCheckResponse(check_result);
    }
    auto* result_data = json_value->FindDictKey("data");
    const std::string* origin = result_data->FindStringKey("origin");
    absl::optional<int> type = result_data->FindIntKey("type").value_or(1);
    auto result_type = *type;
    switch(result_type) {
      case 2:
        check_result.result_type = Web3sitesResultType::kFuzzy;
        break;
      case 3:
        check_result.result_type = Web3sitesResultType::kBlack;
        break;
    }
    const std::string origin_string = *origin;
    GURL origin_url = GURL();
    if (!origin_string.empty()){
      origin_url = GURL("https://" + origin_string);
    }
    check_result.safe_url = origin_url;
    LOG(INFO) << "Cg Web3sitesSafeService::OnURLCheckCompleted"
    << ",result_type=" << check_result.result_type
    << ",origin=" << origin_string
    << ",safe_url=" << check_result.safe_url
    ;
    return OnCheckResponse(check_result);
}
//RunCheckCallback
void Web3sitesSafeService::OnCheckResponse(MisesURLCheckResult& check_result){
  std::move(*callback_).Run(check_result);
}
//Web3sitesNeedUpdating
bool Web3sitesSafeService::Web3sitesNeedUpdating() const {
  if (!is_fetch_web3sites_)
    return true;
 return false;
}

//UpdateWeb3sites
void Web3sitesSafeService::UpdateWeb3sites() {
    LOG(INFO) << "Cg Web3sitesSafeService::UpdateWeb3sites";
    //getMisesMatch
    net::NetworkTrafficAnnotationTag traffic_annotation =
            net::DefineNetworkTrafficAnnotation("web3sites_origin", R"(
        semantics {
          sender: "Web3sites Origin",
          description:
            "When verifying certificates, the browser may need to fetch "
            "additional URLs that are encoded in the server-provided "
            "certificate chain. This may be part of revocation checking ("
            "Online Certificate Status Protocol, Certificate Revocation List), "
            "or path building (Authority Information Access fetches). Please "
            "refer to the following for more on above protocols: "
            "https://tools.ietf.org/html/rfc6960, "
            "https://tools.ietf.org/html/rfc5280#section-4.2.1.13, and"
            "https://tools.ietf.org/html/rfc5280#section-5.2.7."
          trigger:
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
    GURL getWeb3sitesOriginApi("https://web3.mises.site/website/top.json");
    auto resource_request = std::make_unique<network::ResourceRequest>();
    resource_request->url = getWeb3sitesOriginApi;
    resource_request->method = "GET";
    resource_request->credentials_mode = network::mojom::CredentialsMode::kOmit;
    simple_url_loader_ = network::SimpleURLLoader::Create(std::move(resource_request),
                                                          traffic_annotation);
    simple_url_loader_->DownloadToStringOfUnboundedSizeUntilCrashAndDie(
            url_loader_factory_.get(),
            base::BindOnce(&Web3sitesSafeService::OnUpdateWeb3sitesCompleted,
                           base::Unretained(this),simple_url_loader_.get()));

}

//OnUpdateWeb3sitesCompleted
void Web3sitesSafeService::OnUpdateWeb3sitesCompleted(const network::SimpleURLLoader* source,
                                    std::unique_ptr<std::string> response_body){
    LOG(INFO) << "Cg Web3sitesSafeService::OnUpdateWeb3sitesCompleted";
    int response_code = -1;
    if (source->ResponseInfo() &&
        source->ResponseInfo()->headers) {
        response_code =
                source->ResponseInfo()->headers->response_code();
    }
    std::string json_string;
    if (response_body)
        json_string = std::move(*response_body);
    JSONStringValueDeserializer deserializer(json_string);
    std::string error_msg;
    std::unique_ptr<base::Value> json_value =
            deserializer.Deserialize(nullptr, &error_msg);

    if (!response_body || (response_code != net::HTTP_OK) || !json_value) {
      return;
    }
    if (json_value == nullptr) {
        VLOG(1) << "No mises match found in the response.";
        return;
    }
    if (!json_value->is_list()) {
        LOG(WARNING) << "Response is not a JSON dictionary.";
        return;
    }
    web3sites_origin_.clear();
    auto data_list = json_value->GetListDeprecated();

    for (const auto& data : data_list) {
        const std::string* domain_name = data.FindStringKey("domain_name");
        if ((*domain_name).empty()) {continue;}
        MisesDomainInfo domain_info = GetMisesDomainInfo(*domain_name);
        web3sites_origin_.push_back(domain_info);
    }
    last_web3sites_fetch_time_ = clock_->Now();
    is_fetch_web3sites_ = true;
}
