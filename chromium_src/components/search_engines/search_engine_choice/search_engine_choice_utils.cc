#include "src/components/search_engines/search_engine_choice/search_engine_choice_utils.cc"


#if BUILDFLAG(IS_ANDROID)
#include "components/search_engines/search_engine_choice/generated_marketing_snippets.cc"
namespace search_engines {

std::u16string GetMarketingSnippetString(
    const TemplateURLData& template_url_data) {
  int snippet_resource_id =
      GetMarketingSnippetResourceId(template_url_data.keyword());

  return snippet_resource_id == -1
             ? l10n_util::GetStringFUTF16(
                   IDS_SEARCH_ENGINE_FALLBACK_MARKETING_SNIPPET,
                   template_url_data.short_name())
             : l10n_util::GetStringUTF16(snippet_resource_id);
}
}

#endif