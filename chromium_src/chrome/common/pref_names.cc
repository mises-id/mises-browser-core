#include "src/chrome/common/pref_names.cc"


namespace prefs {
#if BUILDFLAG(IS_ANDROID)
const char kPinnedTabs[] = "pinned_tabs";
#endif  // !BUILDFLAG(IS_ANDROID)


#if BUILDFLAG(IS_ANDROID)
// A pref that sets the default destination in Print Preview to always be the
// OS default printer instead of the most recently used destination.
const char kPrintPreviewUseSystemDefaultPrinter[] =
    "printing.use_system_default_printer";

// A prefs that limits how many snapshots of the user's data directory there can
// be on the disk at any time. Following each major version update, Chrome will
// create a snapshot of certain portions of the user's browsing data for use in
// case of a later emergency version rollback.
const char kUserDataSnapshotRetentionLimit[] =
    "downgrade.snapshot_retention_limit";
#endif  // !BUILDFLAG(IS_CHROMEOS) && !BUILDFLAG(IS_ANDROID)


#if BUILDFLAG(IS_ANDROID)
// Whether or not this profile has been shown the Welcome page.
const char kHasSeenWelcomePage[] = "browser.has_seen_welcome_page";

// The restriction imposed on managed accounts.
const char kManagedAccountsSigninRestriction[] =
    "profile.managed_accounts.restriction.value";

// Whether or not the restriction is applied on all managed accounts of the
// machine. If this is set to True, the restriction set in
// `profile.managed_accounts.restriction.value` will be applied on all managed
// accounts on the machine, otherwhise only the account where the policy is set
// will have the restriction applied.
const char kManagedAccountsSigninRestrictionScopeMachine[] =
    "profile.managed_accounts.restriction.all_managed_accounts";
#endif

#if BUILDFLAG(IS_ANDROID)
// Boolean determining the side the side panel will be appear on (left / right).
// True when the side panel is aligned to the right.
const char kSidePanelHorizontalAlignment[] = "side_panel.is_right_aligned";
#endif

#if BUILDFLAG(IS_ANDROID)
// Used to store the value of the SerialAllowAllPortsForUrls policy.
const char kManagedSerialAllowAllPortsForUrls[] =
    "managed.serial_allow_all_ports_for_urls";

// Used to store the value of the SerialAllowUsbDevicesForUrls policy.
const char kManagedSerialAllowUsbDevicesForUrls[] =
    "managed.serial_allow_usb_devices_for_urls";

// Used to store the value of the WebHidAllowAllDevicesForUrls policy.
const char kManagedWebHidAllowAllDevicesForUrls[] =
    "managed.web_hid_allow_all_devices_for_urls";

// Used to store the value of the WebHidAllowDevicesForUrls policy.
const char kManagedWebHidAllowDevicesForUrls[] =
    "managed.web_hid_allow_devices_for_urls";

// Used to store the value of the WebHidAllowAllDevicesWithHidUsagesForUrls
// policy.
const char kManagedWebHidAllowDevicesWithHidUsagesForUrls[] =
    "managed.web_hid_allow_devices_with_hid_usages_for_urls";
#endif  // !BUILDFLAG(IS_ANDROID)

#if BUILDFLAG(IS_ANDROID)
// Boolean indicating whether the user has given consent to use Autofill
// Assistant. Prefs are not synced across devices or platforms and pref
// keys differ.
const char kAutofillAssistantOnDesktopEnabled[] = "autofill_assistant.enabled";
#endif  // !BUILDFLAG(IS_ANDROID)

#if BUILDFLAG(IS_ANDROID)
#if !BUILDFLAG(IS_CHROMEOS_ASH)
// Boolean that specifies whether or not to show security warnings for some
// potentially bad command-line flags. True by default. Controlled by the
// CommandLineFlagSecurityWarningsEnabled policy setting.
const char kCommandLineFlagSecurityWarningsEnabled[] =
    "browser.command_line_flag_security_warnings_enabled";
#endif  // !BUILDFLAG(IS_CHROMEOS_ASH)

// Pref name for the policy controlling presentation of full-tab promotional
// and/or educational content.
const char kPromotionalTabsEnabled[] = "browser.promotional_tabs_enabled";

// Boolean that specifies whether or not showing the unsupported OS warning is
// suppressed. False by default. Controlled by the SuppressUnsupportedOSWarning
// policy setting.
const char kSuppressUnsupportedOSWarning[] =
    "browser.suppress_unsupported_os_warning";

// Set before autorestarting Chrome, cleared on clean exit.
const char kWasRestarted[] = "was.restarted";
#endif  // !BUILDFLAG(IS_ANDROID)

#if BUILDFLAG(IS_ANDROID)

// Holds info for New Tab Page custom background
const char kNtpCustomBackgroundDict[] = "ntp.custom_background_dict";
const char kNtpCustomBackgroundLocalToDevice[] =
    "ntp.custom_background_local_to_device";
// List keeping track of disabled NTP modules.
const char kNtpDisabledModules[] = "NewTabPage.DisabledModules";
// List keeping track of NTP modules order.
const char kNtpModulesOrder[] = "NewTabPage.ModulesOrder";
// Whether NTP modules are visible.
const char kNtpModulesVisible[] = "NewTabPage.ModulesVisible";
// Number of times user has seen an NTP module.
const char kNtpModulesShownCount[] = "NewTabPage.ModulesShownCount";
// Time modules were first shown to user.
const char kNtpModulesFirstShownTime[] = "NewTabPage.ModulesFirstShownTime";
// Whether Modular NTP Desktop v1 First Run Experience is visible.
const char kNtpModulesFreVisible[] = "NewTabPage.ModulesFreVisible";
// List of promos that the user has dismissed while on the NTP.
const char kNtpPromoBlocklist[] = "ntp.promo_blocklist";
// Whether the promo is visible.
const char kNtpPromoVisible[] = "ntp.promo_visible";
#endif  // BUILDFLAG(IS_ANDROID)

#if BUILDFLAG(IS_ANDROID)
// Tracks the number of times the dice signin promo has been shown in the user
// menu.
const char kDiceSigninUserMenuPromoCount[] = "sync_promo.user_menu_show_count";
#endif
#if BUILDFLAG(IS_ANDROID)
// Pref name for the policy controlling whether to force the Cast icon to be
// shown in the toolbar/overflow menu.
const char kShowCastIconInToolbar[] = "media_router.show_cast_icon_in_toolbar";
#endif  // !BUILDFLAG(IS_ANDROID)

#if BUILDFLAG(IS_ANDROID)
// Pref name for the policy controlling the way in which users are notified of
// the need to relaunch the browser for a pending update.
const char kRelaunchNotification[] = "browser.relaunch_notification";
// Pref name for the policy controlling the time period over which users are
// notified of the need to relaunch the browser for a pending update. Values
// are in milliseconds.
const char kRelaunchNotificationPeriod[] =
    "browser.relaunch_notification_period";
// Pref name for the policy controlling the time interval within which the
// relaunch should take place.
const char kRelaunchWindow[] = "browser.relaunch_window";
#endif  // !BUILDFLAG(IS_ANDROID)

#if BUILDFLAG(IS_ANDROID)
// A boolean where true means that the browser has previously attempted to
// enable autoupdate and failed, so the next out-of-date browser start should
// not prompt the user to enable autoupdate, it should offer to reinstall Chrome
// instead.
const char kAttemptedToEnableAutoupdate[] =
    "browser.attempted_to_enable_autoupdate";

// The next media gallery ID to assign.
const char kMediaGalleriesUniqueId[] = "media_galleries.gallery_id";

// A list of dictionaries, where each dictionary represents a known media
// gallery.
const char kMediaGalleriesRememberedGalleries[] =
    "media_galleries.remembered_galleries";
#endif  // !BUILDFLAG(IS_ANDROID)

#if BUILDFLAG(IS_ANDROID)
// Boolean that indicates whether Chrome enterprise extension request is enabled
// or not.
const char kCloudExtensionRequestEnabled[] =
    "enterprise_reporting.extension_request.enabled";

// A list of extension ids represents pending extension request. The ids are
// stored once user sent the request until the request is canceled, approved or
// denied.
const char kCloudExtensionRequestIds[] =
    "enterprise_reporting.extension_request.ids";
#endif


#if BUILDFLAG(IS_ANDROID)
// Boolean to allow SharedArrayBuffer in non-crossOriginIsolated contexts.
// TODO(crbug.com/1144104) Remove when migration to COOP+COEP is complete.
const char kSharedArrayBufferUnrestrictedAccessAllowed[] =
    "profile.shared_array_buffer_unrestricted_access_allowed";

// Boolean that specifies whether media (audio/video) autoplay is allowed.
const char kAutoplayAllowed[] = "media.autoplay_allowed";

// Holds URL patterns that specify URLs that will be allowed to autoplay.
const char kAutoplayAllowlist[] = "media.autoplay_whitelist";

// Boolean that specifies whether autoplay blocking is enabled.
const char kBlockAutoplayEnabled[] = "media.block_autoplay";
#endif  // !BUILDFLAG(IS_ANDROID)

#if BUILDFLAG(IS_ANDROID)
// Dictionary that contains all of the Hats Survey Metadata.
const char kHatsSurveyMetadata[] = "hats.survey_metadata";
#endif  // !BUILDFLAG(IS_ANDROID)


#if BUILDFLAG(IS_ANDROID)
// Boolean pref that indicates whether caret browsing is currently enabled.
const char kCaretBrowsingEnabled[] = "settings.a11y.caretbrowsing.enabled";

// Boolean pref for whether the user is shown a dialog to confirm that caret
// browsing should be enabled/disabled when the keyboard shortcut is pressed.
// If set to false, no intervening dialog is displayed and caret browsing mode
// is toggled silently by the keyboard shortcut.
const char kShowCaretBrowsingDialog[] =
    "settings.a11y.caretbrowsing.show_dialog";
#endif


#if BUILDFLAG(IS_ANDROID)
// Boolean pref indicating whether user has hidden the cart module on NTP.
const char kCartModuleHidden[] = "cart_module_hidden";
// An integer that keeps track of how many times welcome surface has shown in
// cart module.
const char kCartModuleWelcomeSurfaceShownTimes[] =
    "cart_module_welcome_surface_shown_times";
// Boolean pref indicating whether user has reacted to the consent for
// rule-based discount in cart module.
const char kCartDiscountAcknowledged[] = "cart_discount_acknowledged";
// Boolean pref indicating whether user has enabled rule-based discount in cart
// module.
const char kCartDiscountEnabled[] = "cart_discount_enabled";
// Map pref recording the discounts used by users.
const char kCartUsedDiscounts[] = "cart_used_discounts";
// A time pref indicating the timestamp of when last cart discount fetch
// happened.
const char kCartDiscountLastFetchedTime[] = "cart_discount_last_fetched_time";
// Boolean pref indicating whether the consent for discount has ever shown or
// not.
const char kCartDiscountConsentShown[] = "cart_discount_consent_shown";
// Integer pref indicating in which variation the user has made their decision,
// accept or reject the consent.
const char kDiscountConsentDecisionMadeIn[] =
    "discount_consent_decision_made_in";
// Integer pref indicating in which variation the user has dismissed the
// consent. Only the Inline and Dialog variation applies.
const char kDiscountConsentDismissedIn[] = "discount_consent_dismissed_in";
// A time pref indicating the timestamp of when user last explicitly dismissed
// the discount consent.
const char kDiscountConsentLastDimissedTime[] =
    "discount_consent_last_dimissed_time";
// Integer pref indicating the last consent was shown in which variation.
const char kDiscountConsentLastShownInVariation[] =
    "discount_consent_last_shown_in";
// An integer pref that keeps track of how many times user has explicitly
// dismissed the disount consent.
const char kDiscountConsentPastDismissedCount[] =
    "discount_consent_dismissed_count";
// Boolean pref indicating whether the user has shown interest in the consent,
// e.g. if the use has clicked the 'continue' button.
const char kDiscountConsentShowInterest[] = "discount_consent_show_interest";
// Integer pref indicating in which variation the user has shown interest to the
// consent, they has clicked the 'continue' button.
const char kDiscountConsentShowInterestIn[] =
    "discount_consent_show_interest_in";
#endif


#if BUILDFLAG(IS_ANDROID)
// The duration for keepalive requests on browser shutdown.
const char kFetchKeepaliveDurationOnShutdown[] =
    "fetch_keepalive_duration_on_shutdown";
#endif


#if BUILDFLAG(IS_ANDROID)
// Pref name for whether force-installed web apps (origins) are able to query
// device attributes.
const char kDeviceAttributesAllowedForOrigins[] =
    "policy.device_attributes_allowed_for_origins";
#endif


#if BUILDFLAG(IS_ANDROID)
// Pref name for the last major version where the What's New page was
// successfully shown.
const char kLastWhatsNewVersion[] = "browser.last_whats_new_version";
// A boolean indicating whether the Lens Region search feature should be enabled
// if supported.
const char kLensRegionSearchEnabled[] = "policy.lens_region_search_enabled";
#endif


}  // namespace prefs
