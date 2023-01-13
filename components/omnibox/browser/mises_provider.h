

#ifndef MISES_COMPONENTS_OMNIBOX_BROWSER_TOPSITES_PROVIDER_H_
#define MISES_COMPONENTS_OMNIBOX_BROWSER_TOPSITES_PROVIDER_H_

#include <string>
#include <vector>

#include "base/compiler_specific.h"
#include "base/memory/raw_ptr.h"
#include "components/omnibox/browser/autocomplete_match.h"
#include "components/omnibox/browser/autocomplete_provider.h"

class AutocompleteProviderClient;
class AutocompleteProviderListener;
class AutocompleteResult;


namespace network {
class SharedURLLoaderFactory;
class SimpleURLLoader;
} 

// This is the provider for top Alexa 500 sites URLs
class MisesProvider : public AutocompleteProvider
{
public:
    explicit MisesProvider(AutocompleteProviderClient *client,AutocompleteProviderListener* listener);
    MisesProvider(const MisesProvider &) = delete;
    MisesProvider &operator=(const MisesProvider &) = delete;
    
    // AutocompleteProvider:
    void Start(const AutocompleteInput &input, bool minimal_changes) override;
    void SortByMises(const AutocompleteResult& result);
    void GetTopSiteData();
    void OnURLLoadComplete(const network::SimpleURLLoader* source,
                         std::unique_ptr<std::string> response_body);

    void DoAutocomplete(const AutocompleteInput& input);

    

private:
    ~MisesProvider() override;

    static const int kRelevance;

    static std::vector<std::string> top_sites_;

    static std::string websites_string_;

    void AddMatch(const std::u16string &match_string,
                  const ACMatchClassifications &styles,
                  const size_t &foundPos,
                  const int relevance
                  );

    static ACMatchClassifications StylesForSingleMatch(
        const std::string &input_text,
        const std::string &match_text);
    
    int GetRelevance(
    const std::string &input_text,
    const std::string &site,
    const size_t &foundPos);
    raw_ptr<AutocompleteProviderClient> client_ = nullptr;
    raw_ptr<const AutocompleteInput> autocomplete_input_{};
    scoped_refptr<network::SharedURLLoaderFactory> url_loader_factory_;
    std::unique_ptr<network::SimpleURLLoader> simple_url_loader_;

    ACMatches mises_matches_;
};

#endif // MISES_COMPONENTS_OMNIBOX_BROWSER_TOPSITES_PROVIDER_H_