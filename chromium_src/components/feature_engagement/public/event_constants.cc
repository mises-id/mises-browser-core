#include "src/components/feature_engagement/public/event_constants.cc"


namespace feature_engagement {

namespace events {

#if BUILDFLAG(IS_ANDROID)
const char kNewTabOpened[] = "new_tab_opened";
const char kSixthTabOpened[] = "sixth_tab_opened";
const char kTabGroupCreated[] = "tab_group_created";
const char kClosedTabWithEightOrMore[] = "closed_tab_with_eight_or_more";
const char kReadingListItemAdded[] = "reading_list_item_added";
const char kReadingListMenuOpened[] = "reading_list_menu_opened";
const char kBookmarkStarMenuOpened[] = "bookmark_star_menu_opened";
const char kCustomizeChromeOpened[] = "customize_chrome_opened";

const char kMediaBackgrounded[] = "media_backgrounded";
const char kGlobalMediaControlsOpened[] = "global_media_controls_opened";

const char kFocusModeOpened[] = "focus_mode_opened";
const char kFocusModeConditionsMet[] = "focus_mode_conditions_met";

const char kSideSearchAutoTriggered[] = "side_search_auto_triggered";
const char kSideSearchOpened[] = "side_search_opened";
const char kSideSearchPageActionLabelShown[] =
    "side_search_page_action_label_shown";

const char kTabSearchOpened[] = "tab_search_opened";

const char kWebUITabStripClosed[] = "webui_tab_strip_closed";
const char kWebUITabStripOpened[] = "webui_tab_strip_opened";

const char kDesktopNTPModuleUsed[] = "desktop_new_tab_page_modules_used";

const char kDesktopPwaInstalled[] = "desktop_pwa_installed";

const char kFocusHelpBubbleAcceleratorPressed[] =
    "focus_help_bubble_accelerator_pressed";

const char kFocusHelpBubbleAcceleratorPromoRead[] =
    "focus_help_bubble_accelerator_promo_read";

const char kBatterySaverDialogShown[] = "battery_saver_info_shown";

const char kHighEfficiencyDialogShown[] = "high_efficiency_info_shown";

const char kExtensionsMenuOpenedWhileExtensionHasAccess[] =
    "extensions_menu_opened_while_extension_has_access";

const char kExtensionsRequestAccessButtonClicked[] =
    "extensions_request_access_button_clicked";

const char kCookieControlsBubbleShown[] = "cookie_controls_bubble_shown";

#endif 

}  // namespace events

}  // namespace feature_engagement
