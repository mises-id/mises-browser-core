#ifndef MISES_COMMON_PREF_NAMES_H_
#define MISES_COMMON_PREF_NAMES_H_

#include "src/chrome/common/pref_names.h"

namespace prefs {

#if BUILDFLAG(IS_ANDROID)
// Boolean that indicates whether Chrome enterprise extension request is enabled
// or not.
inline constexpr char kCloudExtensionRequestEnabled[] =
    "enterprise_reporting.extension_request.enabled";

// A list of extension ids represents pending extension request. The ids are
// stored once user sent the request until the request is canceled, approved or
// denied.
inline constexpr char kCloudExtensionRequestIds[] =
    "enterprise_reporting.extension_request.ids";
#endif

#if BUILDFLAG(IS_ANDROID)
inline constexpr char kPinnedTabs[] = "pinned_tabs";
#endif  // !BUILDFLAG(IS_ANDROID)
#if BUILDFLAG(IS_ANDROID)
// A pref that sets the default destination in Print Preview to always be the
// OS default printer instead of the most recently used destination.
inline constexpr char kPrintPreviewUseSystemDefaultPrinter[] =
    "printing.use_system_default_printer";

// A prefs that limits how many snapshots of the user's data directory there can
// be on the disk at any time. Following each major version update, Chrome will
// create a snapshot of certain portions of the user's browsing data for use in
// case of a later emergency version rollback.
inline constexpr char kUserDataSnapshotRetentionLimit[] =
    "downgrade.snapshot_retention_limit";
#endif
#if BUILDFLAG(IS_ANDROID)
// Whether or not this profile has been shown the Welcome page.
inline constexpr char kHasSeenWelcomePage[] = "browser.has_seen_welcome_page";

// The restriction imposed on managed accounts.
inline constexpr char kManagedAccountsSigninRestriction[] =
    "profile.managed_accounts.restriction.value";

// Whether or not the restriction is applied on all managed accounts of the
// machine. If this is set to True, the restriction set in
// `profile.managed_accounts.restriction.value` will be applied on all managed
// accounts on the machine, otherwhise only the account where the policy is set
// will have the restriction applied.
inline constexpr char kManagedAccountsSigninRestrictionScopeMachine[] =
    "profile.managed_accounts.restriction.all_managed_accounts";
#endif
#if BUILDFLAG(IS_ANDROID)
// Used to store the value of the SerialAllowAllPortsForUrls policy.
inline constexpr char kManagedSerialAllowAllPortsForUrls[] =
    "managed.serial_allow_all_ports_for_urls";

// Used to store the value of the SerialAllowUsbDevicesForUrls policy.
inline constexpr char kManagedSerialAllowUsbDevicesForUrls[] =
    "managed.serial_allow_usb_devices_for_urls";

// Used to store the value of the WebHidAllowAllDevicesForUrls policy.
inline constexpr char kManagedWebHidAllowAllDevicesForUrls[] =
    "managed.web_hid_allow_all_devices_for_urls";

// Used to store the value of the WebHidAllowDevicesForUrls policy.
inline constexpr char kManagedWebHidAllowDevicesForUrls[] =
    "managed.web_hid_allow_devices_for_urls";

// Used to store the value of the DeviceLoginScreenWebHidAllowDevicesForUrls
// policy.
inline constexpr char kManagedWebHidAllowDevicesForUrlsOnLoginScreen[] =
    "managed.web_hid_allow_devices_for_urls_on_login_screen";

// Used to store the value of the WebHidAllowAllDevicesWithHidUsagesForUrls
// policy.
inline constexpr char kManagedWebHidAllowDevicesWithHidUsagesForUrls[] =
    "managed.web_hid_allow_devices_with_hid_usages_for_urls";
#endif  // !BUILDFLAG(IS_ANDROID)

#if BUILDFLAG(IS_ANDROID)
extern const char kAutofillAssistantOnDesktopEnabled[];
#endif  // !BUILDFLAG(IS_ANDROID)

#if BUILDFLAG(IS_ANDROID)
#if !BUILDFLAG(IS_CHROMEOS_ASH)
// Boolean that specifies whether or not to show security warnings for some
// potentially bad command-line flags. True by default. Controlled by the
// CommandLineFlagSecurityWarningsEnabled policy setting.
inline constexpr char kCommandLineFlagSecurityWarningsEnabled[] =
    "browser.command_line_flag_security_warnings_enabled";
#endif
// Pref name for the policy controlling presentation of full-tab promotional
// and/or educational content.
inline constexpr char kPromotionalTabsEnabled[] =
    "browser.promotional_tabs_enabled";

// Boolean that specifies whether or not showing the unsupported OS warning is
// suppressed. False by default. Controlled by the SuppressUnsupportedOSWarning
// policy setting.
inline constexpr char kSuppressUnsupportedOSWarning[] =
    "browser.suppress_unsupported_os_warning";

// Set before autorestarting Chrome, cleared on clean exit.
inline constexpr char kWasRestarted[] = "was.restarted";
#endif  // !BUILDFLAG(IS_ANDROID)


#if BUILDFLAG(IS_ANDROID)
// Holds info for New Tab Page custom background
inline constexpr char kNtpCustomBackgroundDict[] = "ntp.custom_background_dict";
inline constexpr char kNtpCustomBackgroundLocalToDevice[] =
    "ntp.custom_background_local_to_device";
inline constexpr char kNtpCustomBackgroundLocalToDeviceId[] =
    "ntp.custom_background_local_to_device_id";
// Number of times the user has opened the side panel with the customize chrome
// button.
inline constexpr char kNtpCustomizeChromeButtonOpenCount[] =
    "NewTabPage.CustomizeChromeButtonOpenCount";
// List keeping track of disabled NTP modules.
inline constexpr char kNtpDisabledModules[] = "NewTabPage.DisabledModules";
// List keeping track of NTP modules order.
inline constexpr char kNtpModulesOrder[] = "NewTabPage.ModulesOrder";
// Whether NTP modules are visible.
inline constexpr char kNtpModulesVisible[] = "NewTabPage.ModulesVisible";
// Number of times user has seen an NTP module.
inline constexpr char kNtpModulesShownCount[] = "NewTabPage.ModulesShownCount";
// Dictionary of number of times a module has loaded.
inline constexpr char kNtpModulesLoadedCountDict[] =
    "NewTabPage.ModulesLoadedCountDict";
// Dictionary of number of times the user has interacted with a module.
inline constexpr char kNtpModulesInteractedCountDict[] =
    "NewTabPage.ModulesInteractedCountDict";
// Time modules were first shown to user.
inline constexpr char kNtpModulesFirstShownTime[] =
    "NewTabPage.ModulesFirstShownTime";
// Whether Modular NTP Desktop v1 First Run Experience is visible.
inline constexpr char kNtpModulesFreVisible[] = "NewTabPage.ModulesFreVisible";
// List of promos that the user has dismissed while on the NTP.
inline constexpr char kNtpPromoBlocklist[] = "ntp.promo_blocklist";
// Whether the promo is visible.
inline constexpr char kNtpPromoVisible[] = "ntp.promo_visible";
// List of ids for past wallpaper search themes.
inline constexpr char kNtpWallpaperSearchHistory[] =
    "ntp.wallpaper_search_history";
// Number of times the seed color has been changed via the Customize Chrome
// panel across NTP tabs. Incremented at most once per NTP tab.
inline constexpr char kSeedColorChangeCount[] =
    "colorpicker.SeedColorChangeCount";
#endif 

#if BUILDFLAG(IS_ANDROID)
// Tracks the number of times the dice signin promo has been shown in the user
// menu.
inline constexpr char kDiceSigninUserMenuPromoCount[] =
    "sync_promo.user_menu_show_count";
#endif

#if BUILDFLAG(IS_ANDROID)
// Pref name for the policy controlling whether to force the Cast icon to be
// shown in the toolbar/overflow menu.
inline constexpr char kShowCastIconInToolbar[] =
    "media_router.show_cast_icon_in_toolbar";
#endif  // !BUILDFLAG(IS_ANDROID)

#if BUILDFLAG(IS_ANDROID)
// Pref name for the policy controlling the way in which users are notified of
// the need to relaunch the browser for a pending update.
inline constexpr char kRelaunchNotification[] = "browser.relaunch_notification";
// Pref name for the policy controlling the time period over which users are
// notified of the need to relaunch the browser for a pending update. Values
// are in milliseconds.
inline constexpr char kRelaunchNotificationPeriod[] =
    "browser.relaunch_notification_period";
// Pref name for the policy controlling the time interval within which the
// relaunch should take place.
inline constexpr char kRelaunchWindow[] = "browser.relaunch_window";
#endif  // !BUILDFLAG(IS_ANDROID)

#if BUILDFLAG(IS_ANDROID)
// A boolean where true means that the browser has previously attempted to
// enable autoupdate and failed, so the next out-of-date browser start should
// not prompt the user to enable autoupdate, it should offer to reinstall Chrome
// instead.
inline constexpr char kAttemptedToEnableAutoupdate[] =
    "browser.attempted_to_enable_autoupdate";

// The next media gallery ID to assign.
inline constexpr char kMediaGalleriesUniqueId[] = "media_galleries.gallery_id";

// A list of dictionaries, where each dictionary represents a known media
// gallery.
inline constexpr char kMediaGalleriesRememberedGalleries[] =
    "media_galleries.remembered_galleries";
#endif  // !BUILDFLAG(IS_ANDROID)


#if BUILDFLAG(IS_ANDROID)
// Boolean to allow SharedArrayBuffer in non-crossOriginIsolated contexts.
// TODO(crbug.com/1144104) Remove when migration to COOP+COEP is complete.
inline constexpr char kSharedArrayBufferUnrestrictedAccessAllowed[] =
    "profile.shared_array_buffer_unrestricted_access_allowed";

// Boolean that specifies whether media (audio/video) autoplay is allowed.
inline constexpr char kAutoplayAllowed[] = "media.autoplay_allowed";

// Holds URL patterns that specify URLs that will be allowed to autoplay.
inline constexpr char kAutoplayAllowlist[] = "media.autoplay_whitelist";

// Boolean that specifies whether autoplay blocking is enabled.
inline constexpr char kBlockAutoplayEnabled[] = "media.block_autoplay";

// Holds URL patterns that specify origins that will be allowed to call
// `getDisplayMedia()` without prior user gesture.
inline constexpr char kScreenCaptureWithoutGestureAllowedForOrigins[] =
    "media.screen_capture_without_gesture_allowed_for_origins";

// Holds URL patterns that specify origins that will be allowed to call
// `show{OpenFile|SaveFile|Directory}Picker()` without prior user gesture.
inline constexpr char kFileOrDirectoryPickerWithoutGestureAllowedForOrigins[] =
    "file_system.file_or_directory_picker_without_allowed_for_origins";
#endif



#if BUILDFLAG(IS_ANDROID)
// Boolean pref that indicates whether caret browsing is currently enabled.
inline constexpr char kCaretBrowsingEnabled[] =
    "settings.a11y.caretbrowsing.enabled";

// Boolean pref for whether the user is shown a dialog to confirm that caret
// browsing should be enabled/disabled when the keyboard shortcut is pressed.
// If set to false, no intervening dialog is displayed and caret browsing mode
// is toggled silently by the keyboard shortcut.
inline constexpr char kShowCaretBrowsingDialog[] =
    "settings.a11y.caretbrowsing.show_dialog";
#endif


#if BUILDFLAG(IS_ANDROID)
// Boolean pref indicating whether user has hidden the cart module on NTP.
inline constexpr char kCartModuleHidden[] = "cart_module_hidden";
// An integer that keeps track of how many times welcome surface has shown in
// cart module.
inline constexpr char kCartModuleWelcomeSurfaceShownTimes[] =
    "cart_module_welcome_surface_shown_times";
// Boolean pref indicating whether user has reacted to the consent for
// rule-based discount in cart module.
inline constexpr char kCartDiscountAcknowledged[] =
    "cart_discount_acknowledged";
// Boolean pref indicating whether user has enabled rule-based discount in cart
// module.
inline constexpr char kCartDiscountEnabled[] = "cart_discount_enabled";
// Map pref recording the discounts used by users.
inline constexpr char kCartUsedDiscounts[] = "cart_used_discounts";
// A time pref indicating the timestamp of when last cart discount fetch
// happened.
inline constexpr char kCartDiscountLastFetchedTime[] =
    "cart_discount_last_fetched_time";
// Boolean pref indicating whether the consent for discount has ever shown or
// not.
inline constexpr char kCartDiscountConsentShown[] =
    "cart_discount_consent_shown";
// Integer pref indicating in which variation the user has made their decision,
// accept or reject the consent.
inline constexpr char kDiscountConsentDecisionMadeIn[] =
    "discount_consent_decision_made_in";
// Integer pref indicating in which variation the user has dismissed the
// consent. Only the Inline and Dialog variation applies.
inline constexpr char kDiscountConsentDismissedIn[] =
    "discount_consent_dismissed_in";
// A time pref indicating the timestamp of when user last explicitly dismissed
// the discount consent.
inline constexpr char kDiscountConsentLastDimissedTime[] =
    "discount_consent_last_dimissed_time";
// Integer pref indicating the last consent was shown in which variation.
inline constexpr char kDiscountConsentLastShownInVariation[] =
    "discount_consent_last_shown_in";
// An integer pref that keeps track of how many times user has explicitly
// dismissed the disount consent.
inline constexpr char kDiscountConsentPastDismissedCount[] =
    "discount_consent_dismissed_count";
// Boolean pref indicating whether the user has shown interest in the consent,
// e.g. if the use has clicked the 'continue' button.
inline constexpr char kDiscountConsentShowInterest[] =
    "discount_consent_show_interest";
// Integer pref indicating in which variation the user has shown interest to the
// consent, they has clicked the 'continue' button.
inline constexpr char kDiscountConsentShowInterestIn[] =
    "discount_consent_show_interest_in";
#endif


#if BUILDFLAG(IS_ANDROID)
// The duration for keepalive requests on browser shutdown.
inline constexpr char kFetchKeepaliveDurationOnShutdown[] =
    "fetch_keepalive_duration_on_shutdown";
#endif

#if BUILDFLAG(IS_ANDROID)
// Pref name for whether force-installed web apps (origins) are able to query
// device attributes.
inline constexpr char kDeviceAttributesAllowedForOrigins[] =
    "policy.device_attributes_allowed_for_origins";
#endif


#if BUILDFLAG(IS_ANDROID)
// Pref name for the last major version where the What's New page was
// successfully shown.
inline constexpr char kLastWhatsNewVersion[] = "browser.last_whats_new_version";
// Pref name for the whether whats new refresh page has been shown
// successfully.
inline constexpr char kHasShownRefreshWhatsNew[] =
    "browser.has_shown_refresh_2023_whats_new";
// A boolean indicating whether the Lens Region search feature should be enabled
// if supported.
inline constexpr char kLensRegionSearchEnabled[] =
    "policy.lens_region_search_enabled";
// A boolean indicating whether the Lens NTP searchbox feature should be enabled
// if supported.
inline constexpr char kLensDesktopNTPSearchEnabled[] =
    "policy.lens_desktop_ntp_search_enabled";
#endif

#if BUILDFLAG(IS_ANDROID)
// An integer count of how many times the user has seen the high efficiency mode
// page action chip in the expanded size.
inline constexpr char kHighEfficiencyChipExpandedCount[] =
    "high_efficiency.chip_expanded_count";

// Stores the timestamp of the last time the high efficiency chip was shown
// expanded to highlight memory savings.
inline constexpr char kLastHighEfficiencyChipExpandedTimestamp[] =
    "high_efficiency.last_chip_expanded_timestamp";

// A boolean indicating whether the price track first user experience bubble
// should show. This is set to false if the user has clicked the "Price track"
// button in the FUE bubble once.
inline constexpr char kShouldShowPriceTrackFUEBubble[] =
    "should_show_price_track_fue_bubble_fue";
#endif


#if (BUILDFLAG(IS_ANDROID))
// Boolean determining the side the side panel will be appear on (left / right).
// True when the side panel is aligned to the right.
inline constexpr char kSidePanelHorizontalAlignment[] =
    "side_panel.is_right_aligned";
// Boolean determining whether the companion side panel should be pinned to have
// a button in the toolbar.
inline constexpr char kSidePanelCompanionEntryPinnedToToolbar[] =
    "side_panel.companion_pinned_to_toolbar";
// Corresponds to the enterprise policy.
inline constexpr char kGoogleSearchSidePanelEnabled[] =
    "side_panel.google_search_side_panel_enabled";
#endif

#if BUILDFLAG(IS_ANDROID)
// Dictionary that contains all of the Hats Survey Metadata.
inline constexpr char kHatsSurveyMetadata[] = "hats.survey_metadata";
#endif  // !BUILDFLAG(IS_ANDROID)


inline constexpr char kExtensionsUIDefaultEVMWalletID[] = "extensions.ui.default_evm_wallet_id";
inline constexpr char kExtensionsUIDefaultEVMWalletKeyProperty[] = "extensions.ui.default_evm_wallet_key_property";


}  // namespace prefs

#endif  // CHROME_COMMON_PREF_NAMES_H_
