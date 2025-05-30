#ifndef MISES_BROWSER_UI_WEBUI_SEARCHBOX_REALBOX_HANDLER_H_
#define MISES_BROWSER_UI_WEBUI_SEARCHBOX_REALBOX_HANDLER_H_

#include "build/build_config.h"

#if BUILDFLAG(IS_ANDROID)

#include <atomic>
#include <memory>

#include "base/memory/weak_ptr.h"
#include "base/observer_list.h"
#include "base/observer_list_types.h"
#include "chrome/browser/ui/webui/searchbox/searchbox_handler.h"
#include "components/omnibox/browser/autocomplete_input.h"
#include "components/omnibox/browser/omnibox_popup_selection.h"
#include "components/url_formatter/spoof_checks/idna_metrics.h"
#include "mojo/public/cpp/bindings/pending_receiver.h"
#include "mojo/public/cpp/bindings/receiver.h"
#include "mojo/public/cpp/bindings/remote.h"
#include "ui/gfx/geometry/size.h"
#include "ui/webui/resources/cr_components/searchbox/searchbox.mojom.h"

class GURL;
class LensSearchboxClient;
class MetricsReporter;
class OmniboxController;
class OmniboxEditModel;
class Profile;

namespace content {
class WebContents;
}  // namespace content


class RealboxHandler : public SearchboxHandler {
 public:
  // Note: `omnibox_controller` may be null for the Realbox, in which case
  //  an internally owned controller is created and used.
  RealboxHandler(
      mojo::PendingReceiver<searchbox::mojom::PageHandler> pending_page_handler,
      Profile* profile,
      content::WebContents* web_contents,
      MetricsReporter* metrics_reporter,
      LensSearchboxClient* lens_searchbox_client,
      OmniboxController* omnibox_controller);

  RealboxHandler(const RealboxHandler&) = delete;
  RealboxHandler& operator=(const RealboxHandler&) = delete;

  ~RealboxHandler() override {}


  // searchbox::mojom::PageHandler:
  void SetPage(
      mojo::PendingRemote<searchbox::mojom::Page> pending_page) override {}
  void OnFocusChanged(bool focused) override {}
  void QueryAutocomplete(const std::u16string& input,
                         bool prevent_inline_autocomplete) override {}
  void StopAutocomplete(bool clear_result) override {}
  void OpenAutocompleteMatch(uint8_t line,
                             const GURL& url,
                             bool are_matches_showing,
                             uint8_t mouse_button,
                             bool alt_key,
                             bool ctrl_key,
                             bool meta_key,
                             bool shift_key) override {}
  void DeleteAutocompleteMatch(uint8_t line, const GURL& url) override {}
  void ToggleSuggestionGroupIdVisibility(int32_t suggestion_group_id) override {}
  void ExecuteAction(uint8_t line,
                     uint8_t action_index,
                     const GURL& url,
                     base::TimeTicks match_selection_timestamp,
                     uint8_t mouse_button,
                     bool alt_key,
                     bool ctrl_key,
                     bool meta_key,
                     bool shift_key) override {}
  void OnNavigationLikely(
      uint8_t line,
      const GURL& url,
      omnibox::mojom::NavigationPredictor navigation_predictor) override {}
  void PopupElementSizeChanged(const gfx::Size& size) override {}
  void OnThumbnailRemoved() override {}
};
#else

#include "src/chrome/browser/ui/webui/searchbox/realbox_handler.h"


#endif


#endif