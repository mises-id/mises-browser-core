#include "src/chrome/browser/ui/webui/new_tab_page/new_tab_page_ui.cc"

#if BUILDFLAG(IS_ANDROID)
#include "components/omnibox/browser/omnibox_controller.h"

RealboxHandler::RealboxHandler(
    mojo::PendingReceiver<searchbox::mojom::PageHandler> pending_page_handler,
    Profile* profile,
    content::WebContents* web_contents,
    MetricsReporter* metrics_reporter,
    LensSearchboxClient* lens_searchbox_client,
    OmniboxController* omnibox_controller)
    : SearchboxHandler(std::move(pending_page_handler),
                       profile,
                       web_contents,
                       metrics_reporter){
}

SearchboxHandler::SearchboxHandler(
    mojo::PendingReceiver<searchbox::mojom::PageHandler> pending_page_handler,
    Profile* profile,
    content::WebContents* web_contents,
    MetricsReporter* metrics_reporter)
    : profile_(profile),
      web_contents_(web_contents),
      metrics_reporter_(metrics_reporter),
      page_set_(false),
      page_handler_(this, std::move(pending_page_handler)) {}

SearchboxHandler::~SearchboxHandler() {
  // Avoids dangling pointer warning when `controller_` is not owned.
  controller_ = nullptr;
}

void SearchboxHandler::OnResultChanged(AutocompleteController* controller,
                                       bool default_match_changed) {
                                       }
// static
void SearchboxHandler::SetupWebUIDataSource(content::WebUIDataSource* source,
                                            Profile* profile,
                                            bool enable_voice_search,
                                            bool enable_lens_search) {
                                            }
                                        
#endif