#include "chrome/browser/chrome_browser_interface_binders.h"

#include "build/build_config.h"
#if BUILDFLAG(IS_ANDROID)
#include "chrome/browser/badging/badge_manager.h"
#include "chrome/browser/cart/chrome_cart.mojom.h"
#include "chrome/browser/new_tab_page/modules/drive/drive.mojom.h"
#include "chrome/browser/new_tab_page/modules/feed/feed.mojom.h"
#include "chrome/browser/new_tab_page/modules/photos/photos.mojom.h"
#include "chrome/browser/new_tab_page/modules/task_module/task_module.mojom.h"
#include "chrome/browser/new_tab_page/new_tab_page_util.h"
#include "chrome/browser/payments/payment_request_factory.h"
#include "chrome/browser/ui/webui/access_code_cast/access_code_cast.mojom.h"
#include "chrome/browser/ui/webui/access_code_cast/access_code_cast_ui.h"
#include "chrome/browser/ui/webui/app_service_internals/app_service_internals.mojom.h"
#include "chrome/browser/ui/webui/app_service_internals/app_service_internals_ui.h"
#include "chrome/browser/ui/webui/downloads/downloads.mojom.h"
#include "chrome/browser/ui/webui/downloads/downloads_ui.h"
#include "chrome/browser/ui/webui/feed/feed.mojom.h"
#include "chrome/browser/ui/webui/feed/feed_ui.h"
#include "chrome/browser/ui/webui/image_editor/image_editor.mojom.h"
#include "chrome/browser/ui/webui/image_editor/image_editor_untrusted_ui.h"
#include "chrome/browser/ui/webui/realbox/realbox.mojom.h"
#if !defined(OFFICIAL_BUILD)
#include "chrome/browser/ui/webui/new_tab_page/foo/foo.mojom.h"  // nogncheck crbug.com/1125897
#endif
#include "chrome/browser/ui/webui/history/history_ui.h"
#include "chrome/browser/ui/webui/internals/user_education/user_education_internals.mojom.h"
#include "chrome/browser/ui/webui/new_tab_page/new_tab_page.mojom.h"
#include "chrome/browser/ui/webui/new_tab_page/new_tab_page_ui.h"
#include "chrome/browser/ui/webui/new_tab_page_third_party/new_tab_page_third_party_ui.h"
#include "chrome/browser/ui/webui/settings/settings_ui.h"
#include "chrome/browser/ui/webui/side_panel/bookmarks/bookmarks_side_panel_ui.h"
#include "chrome/browser/ui/webui/side_panel/history_clusters/history_clusters_side_panel_ui.h"
#include "chrome/browser/ui/webui/side_panel/read_anything/read_anything_ui.h"
#include "chrome/browser/ui/webui/side_panel/reading_list/reading_list.mojom.h"
#include "chrome/browser/ui/webui/side_panel/reading_list/reading_list_ui.h"
#include "chrome/browser/ui/webui/tab_search/tab_search.mojom.h"
#include "chrome/browser/ui/webui/tab_search/tab_search_ui.h"
#include "chrome/browser/ui/webui/whats_new/whats_new_ui.h"
#include "chrome/common/webui_url_constants.h"
#include "components/search/ntp_features.h"
#include "mojo/public/cpp/bindings/self_owned_receiver.h"
#include "ui/webui/resources/cr_components/color_change_listener/color_change_listener.mojom.h"
#include "ui/webui/resources/cr_components/customize_themes/customize_themes.mojom.h"
#include "ui/webui/resources/cr_components/history_clusters/history_clusters.mojom.h"
#include "ui/webui/resources/cr_components/most_visited/most_visited.mojom.h"
#include "ui/webui/resources/js/browser_command/browser_command.mojom.h"
#include "ui/webui/resources/js/metrics_reporter/metrics_reporter.mojom.h"
#endif  // BUILDFLAG(IS_ANDROID)


#if BUILDFLAG(IS_ANDROID) 
#include "chrome/browser/ui/webui/signin/profile_customization_ui.h"
#include "chrome/browser/ui/webui/signin/profile_picker_ui.h"
#include "ui/webui/resources/cr_components/customize_themes/customize_themes.mojom.h"
#endif  // !BUILDFLAG(IS_ANDROID) && !BUILDFLAG(IS_CHROMEOS_ASH)


#define PopulateChromeFrameBinders PopulateChromeFrameBinders_Chromium
#include "src/chrome/browser/chrome_browser_interface_binders.cc"
#undef PopulateChromeFrameBinders

namespace chrome {
namespace internal {


void PopulateChromeFrameBinders(
    mojo::BinderMapWithContext<content::RenderFrameHost*>* map,
    content::RenderFrameHost* render_frame_host) {

    PopulateChromeFrameBinders_Chromium(map, render_frame_host);
#if BUILDFLAG(IS_ANDROID)

    RegisterWebUIControllerInterfaceBinder<
      new_tab_page_third_party::mojom::PageHandlerFactory,
      NewTabPageThirdPartyUI>(map);

  RegisterWebUIControllerInterfaceBinder<
      new_tab_page::mojom::PageHandlerFactory, NewTabPageUI>(map);

  RegisterWebUIControllerInterfaceBinder<
      most_visited::mojom::MostVisitedPageHandlerFactory, NewTabPageUI,
      NewTabPageThirdPartyUI>(map);
#endif
    }

}  // namespace internal
}  // namespace chrome
