

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
#include "components/omnibox/browser/autocomplete_match_classification.h"

#include "net/traffic_annotation/network_traffic_annotation.h"
#include "base/json/json_string_value_serializer.h"
#include "net/http/http_status_code.h"

// As from autocomplete_provider.h:
// Search Secondary Provider (suggestion)                              |  100++
const int MisesProvider::kRelevance = 10000;
const int MisesProvider::kBaseRelevance = 1299;
#define kScheme  u"https://"

MisesProvider::MisesProvider(AutocompleteProviderClient* client, AutocompleteProviderListener* listener)
         : AutocompleteProvider(AutocompleteProvider::TYPE_SEARCH), client_(client){
            AddListener(listener);
            mises_matches_.clear();
            GetTopSiteData();
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
    if (input.focus_type() != metrics::OmniboxFocusType::INTERACTION_DEFAULT || input.text().empty())
      return;
    if ((input.type() == metrics::OmniboxInputType::EMPTY))
      return;
  DoAutocomplete(input);
  autocomplete_input_ = nullptr;
}

void MisesProvider::DoAutocomplete(const AutocompleteInput &input){
  const std::string input_text = base::ToLowerASCII(base::UTF16ToUTF8(input.text()));
  // LOG(INFO) << "Cg MisesProvider::Start find input_text="
  //     << input_text;
  ACMatches mises_matches;
  for (auto& mises_match : mises_matches_ ) {
    std::u16string domain_name = mises_match.fill_into_edit;
    const std::string domain_name_text = base::UTF16ToUTF8(domain_name);
    const std::string contents_text = base::UTF16ToUTF8(mises_match.contents);
    size_t foundPos = domain_name_text.find(input_text);

    std::string match_text = domain_name_text;
    if (std::string::npos != foundPos) {
      int relevance = GetRelevance(input_text, match_text, foundPos);
     //desc
     const std::u16string& match_string = base::ASCIIToUTF16(match_text);
     std::u16string description_ = match_string;
     TermMatches term_matches = FindTermMatches(base::ASCIIToUTF16(input_text), description_);
     ACMatchClassifications description_class_ = ClassifyTermMatches(term_matches, description_.size(),
                                           ACMatchClassification::MATCH | ACMatchClassification::URL,
                                           ACMatchClassification::URL);

     //content
     std::u16string contents_ = mises_match.contents;
     if (contents_.empty()){
      contents_ = description_;
     }
     TermMatches term_matches_contents = FindTermMatches(base::ASCIIToUTF16(input_text), contents_);
     ACMatchClassifications contents_class_ = ClassifyTermMatches(
                                           term_matches_contents, contents_.size(),
                                           ACMatchClassification::MATCH | ACMatchClassification::URL,
                                           ACMatchClassification::URL);

      AutocompleteMatch match(this, kRelevance, false,
                              AutocompleteMatchType::SEARCH_SUGGEST_ENTITY);
      match.fill_into_edit = kScheme + domain_name;
      //relevance
      match.relevance = kRelevance + relevance + mises_match.relevance;
      match.destination_url = mises_match.destination_url;
      match.contents = contents_;
      match.contents_class = contents_class_;
      match.description = description_;
      match.description_class = description_class_;
      match.allowed_to_be_default_match = false;
      match.image_url = mises_match.image_url;
      mises_matches.push_back(match);
    }
    }
  CompareWithDemoteByType<AutocompleteMatch> comparing_object(
      input.current_page_classification());
      std::sort(mises_matches.begin(), mises_matches.end(), comparing_object);
  for (size_t i = 0; (i < mises_matches.size() && matches_.size() < 1); ++i) {
      if(!mises_matches[i].image_url.is_empty()){
        client_->PrefetchImage(mises_matches[i].image_url);
    }
    mises_matches[i].relevance = CalculateRelevanceForWeb3sites();
    matches_.push_back(mises_matches[i]);
  }
  mises_matches.clear();
  NotifyListeners(true);
}

// static
ACMatchClassifications MisesProvider::StylesForSingleMatch(
    const std::string &input_text,
    const std::string &match_text) {
  ACMatchClassifications styles;
   size_t foundPos = match_text.find(input_text);
  if (foundPos == 0) {
    styles.push_back(ACMatchClassification(
        0, ACMatchClassification::URL | ACMatchClassification::MATCH));
    if (match_text.length() > input_text.length()) {
      styles.push_back(ACMatchClassification(input_text.length(),
                                             ACMatchClassification::URL));
    }
  } else {
    styles.push_back(ACMatchClassification(0, ACMatchClassification::URL));
    styles.push_back(ACMatchClassification(
        foundPos, ACMatchClassification::URL | ACMatchClassification::MATCH));
    if (match_text.length() > foundPos + input_text.length()) {
      styles.push_back(
          ACMatchClassification(foundPos + input_text.length(), 0));
    }
  }
  return styles;
}

void MisesProvider::GetTopSiteData() {
    LOG(INFO) << "Cg MisesProvider::GetTopSiteData";
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
    simple_url_loader_ = network::SimpleURLLoader::Create(std::move(resource_request),
                                                          traffic_annotation);
    simple_url_loader_->DownloadToStringOfUnboundedSizeUntilCrashAndDie(
            //url_loader_factory_.get(),
            client_->GetURLLoaderFactory().get(),
            base::BindOnce(&MisesProvider::OnURLLoadComplete,
                           base::Unretained(this),simple_url_loader_.get()));

}

void MisesProvider::OnURLLoadComplete(const network::SimpleURLLoader* source,
                                    std::unique_ptr<std::string> response_body){
    LOG(INFO) << "Cg MisesProvider::OnURLLoadComplete";
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
    LOG(INFO) << "Cg MisesProvider::DoAutocomplete set_new_top_sites";

    for (const auto& data : json_value->GetList()) {
        //const std::string* title = data.FindString("title");
        if (!data.is_dict()) {
          continue;
        }
        const auto& dict = data.GetDict();
        const std::string* url = dict.FindString("url");
        const std::string* logo = dict.FindString("logo");
        const std::string* content = dict.FindString("title");
        const std::string* domain_name = dict.FindString("domain_name");
        absl::optional<int> search_score = dict.FindInt("search_score").value_or(0);
        AutocompleteMatch match;
        match.type = AutocompleteMatchType::SEARCH_SUGGEST_ENTITY;
        match.relevance = *search_score;
        match.destination_url = GURL(*url);
        match.contents = base::ASCIIToUTF16(*content);
        match.fill_into_edit = base::ASCIIToUTF16(*domain_name);
        //match.description = base::ASCIIToUTF16(*desc);
        match.image_url = GURL(*logo);
        match.allowed_to_be_default_match = true;
        mises_matches_.push_back(match);
    }
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
    return core_word_relevance;
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

int MisesProvider::CalculateRelevanceForWeb3sites() const {
  switch (autocomplete_input_->type()) {
    case metrics::OmniboxInputType::UNKNOWN:
    case metrics::OmniboxInputType::QUERY:
      return 1299;

    case metrics::OmniboxInputType::URL:
      return 849;

    default:
      NOTREACHED();
      return 0;
  }
}
