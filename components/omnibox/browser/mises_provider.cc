

#include "components/omnibox/browser/mises_provider.h"

#include <string>

#include "base/logging.h"
#include "base/strings/utf_string_conversions.h"
#include "base/trace_event/trace_event.h"
#include "chrome/browser/browser_process.h"
#include "components/omnibox/browser/autocomplete_input.h"
#include "components/omnibox/browser/autocomplete_match.h"
#include "components/omnibox/browser/autocomplete_match_classification.h"
#include "components/search_engines/template_url.h"
#include "components/search_engines/template_url_service.h"
#include "services/network/public/cpp/resource_request.h"
#include "services/network/public/cpp/shared_url_loader_factory.h"
#include "services/network/public/cpp/simple_url_loader.h"
#include "services/network/public/mojom/url_response_head.mojom.h"
#include "net/traffic_annotation/network_traffic_annotation.h"
#include "base/json/json_string_value_serializer.h"
#include "net/http/http_status_code.h"
#include "chrome/browser/net/system_network_context_manager.h"

namespace {

}  // namespace

MisesProvider::MisesProvider(AutocompleteProviderClient* client, AutocompleteProviderListener* listener)
        :BaseSearchProvider(AutocompleteProvider::TYPE_SEARCH,client),
          client_(client) {
             AddListener(listener);
            //scoped_refptr<network::SharedURLLoaderFactory> url_loader_factory = g_browser_process->system_network_context_manager()->GetSharedURLLoaderFactory();
            //url_loader_factory_ = std::move(url_loader_factory);
          }

MisesProvider::~MisesProvider() = default;

void MisesProvider::Start(const AutocompleteInput& input,
                                 bool minimal_changes) {
    autocomplete_input_ = &input;
    TRACE_EVENT0("omnibox", "MisesProvider::Start");
    LOG(INFO) << "Cg MisesProvider::Start input text=" << base::UTF16ToUTF8(input.text());
    matches_.clear();

  if (input.focus_type() != OmniboxFocusType::DEFAULT || input.text().empty())
    return;

  DoAutocomplete(input);
    autocomplete_input_ = nullptr;
}

void MisesProvider::Stop(bool clear_cached_results,
                                bool due_to_user_inactivity) {
   LOG(INFO) << "Cg MisesProvider::Stop";
  //AutocompleteProvider::Stop(clear_cached_results, due_to_user_inactivity);

}

void MisesProvider::DoAutocomplete(const AutocompleteInput &input) {
    LOG(INFO) << "Cg MisesProvider::DoAutocomplete -1";
    //const size_t kMaxMisesMatches = 3;
    std::string input_text = base::UTF16ToUTF8(input.text());
    //getMisesMatch
    net::NetworkTrafficAnnotationTag traffic_annotation =
            net::DefineNetworkTrafficAnnotation("mises_provider_url_loader", R"(
        semantics {
          sender: "Mises Provider"
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
    GURL misesApiUrl("https://api.test.mises.site/api/v1/website/search?keywords=" + input_text);
    auto resource_request = std::make_unique<network::ResourceRequest>();
    resource_request->url = misesApiUrl;
    resource_request->method = "GET";
    resource_request->credentials_mode = network::mojom::CredentialsMode::kOmit;
    LOG(INFO) << "Cg MisesProvider::DoAutocomplete -2";
    simple_url_loader_ = network::SimpleURLLoader::Create(std::move(resource_request),
                                                          traffic_annotation);
    LOG(INFO) << "Cg MisesProvider::DoAutocomplete -3";
    simple_url_loader_->DownloadToStringOfUnboundedSizeUntilCrashAndDie(
            //url_loader_factory_.get(),
            client()->GetURLLoaderFactory().get(),
            base::BindOnce(&MisesProvider::OnURLLoadComplete,
                           base::Unretained(this),simple_url_loader_.get()));
    LOG(INFO) << "Cg MisesProvider::DoAutocomplete -4";
     /*  AutocompleteMatch mises_match;
            mises_match.relevance = 8000;
            mises_match.destination_url = GURL("https://www.baiduc.om");          
            mises_match.type = AutocompleteMatchType::NAVSUGGEST;
            mises_match.description = u"mises";
            mises_match.contents = u"content";
            matches_.push_back(mises_match); */

}

void MisesProvider::OnURLLoadComplete(const network::SimpleURLLoader* source,
                                    std::unique_ptr<std::string> response_body){
    LOG(INFO) << "Cg MisesProvider::DoAutocomplete -4.5";
    int response_code = -1;
    if (source->ResponseInfo() &&
        source->ResponseInfo()->headers) {
        response_code =
                source->ResponseInfo()->headers->response_code();
    }
    LOG(INFO) << "Cg MisesProvider::DoAutocomplete code " << response_code;
    std::string json_string;
    if (response_body)
        json_string = std::move(*response_body);
    LOG(INFO) << "Cg MisesProvider API match string=" << json_string;
    LOG(INFO) << "Cg MisesProvider::DoAutocomplete -5";
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
        LOG(INFO) << "Cg MisesProvider::DoAutocomplete -6";
        base::Value* data_list = json_value->FindListKey("data");
        if (data_list == nullptr) {
            VLOG(1) << "No mises match found in the response.";
            return;
        }
        LOG(INFO) << "Cg MisesProvider::DoAutocomplete -7";
        int matchNum = 5;
         ACMatchClassifications styles;
         styles.push_back(ACMatchClassification(0, ACMatchClassification::URL));
        for (const auto& data : data_list->GetListDeprecated()) {
            const std::string* title = data.FindStringKey("title");
            const std::string* desc = data.FindStringKey("desc");
            const std::string* url = data.FindStringKey("url");
            const std::string* logo = data.FindStringKey("logo");
            LOG(INFO) << "Cg MisesProvider match title=" << *title << ",logo=" << *logo;
            if(matchNum == 0){
                break;
            }
            matchNum--;
             LOG(INFO) << "Cg MisesProvider::DoAutocomplete -8";
            AutocompleteMatch mises_match;
            client()->PrefetchImage(GURL(*logo));
            mises_match.relevance = 80000;
            mises_match.destination_url = GURL(*url);
            mises_match.image_url = GURL(*logo);
            mises_match.type = AutocompleteMatchType::NAVSUGGEST_PERSONALIZED;
            mises_match.description = base::UTF8ToUTF16(*title);
            mises_match.contents = base::UTF8ToUTF16(*desc);
            mises_match.contents_class = styles;
            mises_match.description_class = styles;
            LOG(INFO) << "Cg MisesProvider::DoAutocomplete -9";
            matches_.push_back(mises_match);
            NotifyListeners(true);
            LOG(INFO) << "Cg MisesProvider::DoAutocomplete -10";
        }
       // Sort and clip the resulting matches.
       /* size_t max_matches = 3;
       size_t num_matches = std::min(matches_.size(), max_matches);
       std::partial_sort(matches_.begin(), matches_.begin() + num_matches,
                          matches_.end(), AutocompleteMatch::MoreRelevant);
       matches_.resize(num_matches); */
       LOG(INFO) << "Cg MisesProvider::DoAutocomplete -100";
}

const TemplateURL* MisesProvider::GetTemplateURL(bool is_keyword) const {
  DCHECK(!is_keyword);
  return client()->GetTemplateURLService()->GetDefaultSearchProvider();
}

const AutocompleteInput MisesProvider::GetInput(bool is_keyword) const {
  DCHECK(!is_keyword);
  DCHECK(autocomplete_input_);
  return *autocomplete_input_;
}

bool MisesProvider::ShouldAppendExtraParams(
    const SearchSuggestionParser::SuggestResult& result) const {
  // We always use the default provider for search, so append the params.
  return true;
}

void MisesProvider::RecordDeletionResult(bool success) {}
