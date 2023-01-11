

#include "mises/components/omnibox/browser/mises_provider.h"

#include <stddef.h>

#include <algorithm>
#include <string>

#include "base/strings/string_util.h"
#include "base/strings/utf_string_conversions.h"

#include "components/omnibox/browser/autocomplete_input.h"
#include "components/omnibox/browser/history_provider.h"
#include "components/omnibox/browser/autocomplete_result.h"
#include "components/prefs/pref_service.h"
#include "services/network/public/cpp/resource_request.h"
#include "services/network/public/cpp/shared_url_loader_factory.h"
#include "services/network/public/cpp/simple_url_loader.h"
#include "services/network/public/mojom/url_response_head.mojom.h"
#include "net/traffic_annotation/network_traffic_annotation.h"
#include "base/json/json_string_value_serializer.h"
#include "net/http/http_status_code.h"

// As from autocomplete_provider.h:
// Search Secondary Provider (suggestion)                              |  100++
const int MisesProvider::kRelevance = 10000;


MisesProvider::MisesProvider(AutocompleteProviderClient* client, AutocompleteProviderListener* listener)
         : AutocompleteProvider(AutocompleteProvider::TYPE_SEARCH), client_(client){
            AddListener(listener);
         }

MisesProvider::~MisesProvider() = default;

void MisesProvider::Start(const AutocompleteInput& input,
                            bool minimal_changes) {
  autocomplete_input_ = &input;
  matches_.clear();
  auto* prefs = client_->GetPrefs();
  if (!prefs) {
    return;
  }
    if (input.focus_type() != OmniboxFocusType::DEFAULT || input.text().empty())
      return;
    if ((input.type() == metrics::OmniboxInputType::EMPTY))
      return;
  DoAutocomplete(input);
  autocomplete_input_ = nullptr;
}


void MisesProvider::GetTopSiteData() {
    LOG(INFO) << "Cg MisesProvider::DoAutocomplete -1";
    //getMisesMatch
    net::NetworkTrafficAnnotationTag traffic_annotation =
            net::DefineNetworkTrafficAnnotation("mises_provider_data", R"(
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
    GURL misesApiUrl("https://web3.mises.site/website/top.json");
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
            client_->GetURLLoaderFactory().get(),
            base::BindOnce(&MisesProvider::OnURLLoadComplete,
                           base::Unretained(this),simple_url_loader_.get()));
    LOG(INFO) << "Cg MisesProvider::DoAutocomplete -4";

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
        base::Value* data_list = json_value->FindListKey("Dn");
        if (data_list == nullptr) {
            VLOG(1) << "No mises match found in the response.";
            return;
        }
        std::vector<std::string> new_top_sites;
        for (const auto& data : data_list->GetListDeprecated()) {
            new_top_sites.push_back(data.GetString());
             LOG(INFO) << "Cg MisesProvider::DoAutocomplete new_top_sites=" << data.GetString();
        }
        top_sites_ = new_top_sites;
}

void MisesProvider::DoAutocomplete(const AutocompleteInput &input){
  const std::string input_text = base::ToLowerASCII(base::UTF16ToUTF8(input.text()));
  ACMatches mises_matches;
   static const std::u16string kScheme(u"https://");
   int fix_orderid = top_sites_.size();
  for (std::vector<std::string>::const_iterator i = top_sites_.begin();
       (i != top_sites_.end());
       ++i) {
    const std::string &current_site = *i;
    size_t foundPos = current_site.find(input_text);
    if (std::string::npos != foundPos) {
      ACMatchClassifications styles =
          StylesForSingleMatch(input_text, current_site, foundPos);
      int relevance = GetRelevance(input_text, current_site, foundPos);
      LOG(INFO) << "Cg MisesProvider::Start find input_text="
      << input_text
      << ",current_site=" << current_site
      << ",relevance=" << relevance;
     // AddMatch(base::ASCIIToUTF16(current_site), styles,foundPos,kRelevance + relevance);
     const std::u16string& match_string = base::ASCIIToUTF16(current_site);
     
      AutocompleteMatch match(this, kRelevance, false,
                              AutocompleteMatchType::NAVSUGGEST);
      match.fill_into_edit = match_string;
      //relevance
      match.relevance = kRelevance + relevance + fix_orderid;
      match.destination_url = GURL(kScheme + match_string);
      match.contents = match_string;
      match.contents_class = styles;
      match.allowed_to_be_default_match = true;
      mises_matches.push_back(match);
      fix_orderid--;
    }
  }
  CompareWithDemoteByType<AutocompleteMatch> comparing_object(
      input.current_page_classification());
      std::sort(mises_matches.begin(), mises_matches.end(), comparing_object);
   for (size_t i = 0; (i < mises_matches.size() && matches_.size() < provider_max_matches()); ++i) {
       matches_.push_back(mises_matches[i]);
    //matches_[i].relevance += matches_.size() - (i + 1);
  }
  mises_matches.clear();
  if ((matches_.size() > 0) && !matches_[0].inline_autocompletion.empty()) {
    // If there's only one possible completion of the user's input and
    // allowing completions truns out to be okay, give the match a high enough
    // score to allow it to beat url-what-you-typed and be inlined.
    matches_[0].SetAllowedToBeDefault(input);
    if (matches_[0].allowed_to_be_default_match) {
      matches_[0].relevance = 15000;
    }
  }
  NotifyListeners(true); 
}
// static
ACMatchClassifications MisesProvider::StylesForSingleMatch(
    const std::string &input_text,
    const std::string &site,
    const size_t &foundPos) {
  ACMatchClassifications styles;
  if (foundPos == 0) {
    styles.push_back(ACMatchClassification(
        0, ACMatchClassification::URL | ACMatchClassification::MATCH));
    if (site.length() > input_text.length()) {
      styles.push_back(ACMatchClassification(input_text.length(),
                                             ACMatchClassification::URL));
    }
  } else {
    styles.push_back(ACMatchClassification(0, ACMatchClassification::URL));
    styles.push_back(ACMatchClassification(
        foundPos, ACMatchClassification::URL | ACMatchClassification::MATCH));
    if (site.length() > foundPos + input_text.length()) {
      styles.push_back(
          ACMatchClassification(foundPos + input_text.length(), 0));
    }
  }
  return styles;
}

int MisesProvider::GetRelevance(
    const std::string &input_text,
    const std::string &site,
    const size_t &foundPos) {
  //find top domain_name
  //www.base.com
  int first_word_relevance = 1000;
  int core_word_relevance = 3000;

  std::size_t last1_found_pos = site.find_last_of(".");
  // not found .
  if (std::string::npos == last1_found_pos) {
    return 0;
  }
  //
  std::string last1_str = site.substr(0,last1_found_pos);
  std::size_t last2_found_pos = last1_str.find_last_of(".");
  if (std::string::npos != last2_found_pos && last2_found_pos + 1 == foundPos) {
    return core_word_relevance;
  }
  if (foundPos == 0) {
    if (std::string::npos == last2_found_pos) {
    return core_word_relevance;
  }
    return first_word_relevance;
  }
  return 0;
}

void MisesProvider::AddMatch(const std::u16string& match_string,
                             const ACMatchClassifications& styles,
                             const size_t &foundPos,
                             const int relevance
                             ) {
  static const std::u16string kScheme(u"https://");
  AutocompleteMatch match(this, kRelevance, false,
                          AutocompleteMatchType::NAVSUGGEST);
  match.fill_into_edit = match_string;
  //relevance
  match.relevance = relevance;
  match.destination_url = GURL(kScheme + match_string);
  match.contents = match_string;
  match.contents_class = styles;
  match.allowed_to_be_default_match = true;
  matches_.push_back(match);
}

void MisesProvider::SortByMises(
    const AutocompleteResult& result) {
      LOG(INFO) << "Cg MisesProvider::SortByMises";
  if (result.empty())
    return;
}
