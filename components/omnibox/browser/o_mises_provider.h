

#ifndef MISES_COMPONENTS_OMNIBOX_BROWSER_MISES_PROVIDER_H_
#define MISES_COMPONENTS_OMNIBOX_BROWSER_MISES_PROVIDER_H_

#include <memory>
#include <string>
#include <vector>

#include "base/compiler_specific.h"
#include "base/memory/raw_ptr.h"
#include "base/memory/weak_ptr.h"
#include "components/omnibox/browser/autocomplete_input.h"
#include "components/omnibox/browser/autocomplete_provider_client.h"
#include "components/omnibox/browser/base_search_provider.h"
#include "third_party/metrics_proto/omnibox_event.pb.h"
#include "services/network/public/cpp/shared_url_loader_factory.h"
#include "chrome/browser/net/system_network_context_manager.h"
#include "components/omnibox/browser/autocomplete_match.h"
#include "components/omnibox/browser/autocomplete_provider.h"

class AutocompleteProviderListener;
namespace network {
class SharedURLLoaderFactory;
class SimpleURLLoader;
} 
// Autocomplete provider serving Mises.
class MisesProvider : public AutocompleteProvider {
 public:
  explicit MisesProvider(AutocompleteProviderClient* client, AutocompleteProviderListener* listener);
  void Start(const AutocompleteInput& input, bool minimal_changes) override;
  void Stop(bool clear_cached_results, bool due_to_user_inactivity) override;

 private:
  // BaseSearchProvider:
  ~MisesProvider() override;
  void AddMatch(const std::u16string& match_string,
                const ACMatchClassifications& styles);

  static ACMatchClassifications StylesForSingleMatch(
      const std::string &input_text,
      const std::string &site,
      const size_t &foundPos);
  void OnURLLoadComplete(const network::SimpleURLLoader* source,
                         std::unique_ptr<std::string> response_body);
  void DoAutocomplete(const AutocompleteInput& input);
  static const int kRelevance;
  static std::vector<std::string> web_sites_;
  // BaseSearchProvider:
  /* const TemplateURL* GetTemplateURL(bool is_keyword) const override;
  const AutocompleteInput GetInput(bool is_keyword) const override;
  bool ShouldAppendExtraParams(
  const SearchSuggestionParser::SuggestResult& result) const override;
  void RecordDeletionResult(bool success) override; */
    raw_ptr<AutocompleteProviderClient> client_;
    GURL request_url_;
    //network::TestURLLoaderFactory test_url_loader_factory_;
    scoped_refptr<network::SharedURLLoaderFactory> url_loader_factory_;
    std::unique_ptr<network::SimpleURLLoader> simple_url_loader_;
    raw_ptr<const AutocompleteInput> autocomplete_input_{};
};

#endif  // MISES_COMPONENTS_OMNIBOX_BROWSER_MISES_PROVIDER_H_
