#include "src/components/feature_engagement/public/feature_constants.cc"


namespace feature_engagement {

#if BUILDFLAG(IS_ANDROID)
const base::Feature kIPHDesktopSharedHighlightingFeature{
    "IPH_DesktopSharedHighlighting", base::FEATURE_DISABLED_BY_DEFAULT};
const base::Feature kIPHDesktopTabGroupsNewGroupFeature{
    "IPH_DesktopTabGroupsNewGroup", base::FEATURE_DISABLED_BY_DEFAULT};
const base::Feature kIPHFocusHelpBubbleScreenReaderPromoFeature{
    "IPH_FocusHelpBubbleScreenReaderPromo", base::FEATURE_ENABLED_BY_DEFAULT};
const base::Feature kIPHGMCCastStartStopFeature{
    "IPH_GMCCastStartStop", base::FEATURE_ENABLED_BY_DEFAULT};
const base::Feature kIPHLiveCaptionFeature{"IPH_LiveCaption",
                                           base::FEATURE_ENABLED_BY_DEFAULT};
const base::Feature kIPHTabAudioMutingFeature{"IPH_TabAudioMuting",
                                              base::FEATURE_DISABLED_BY_DEFAULT};
const base::Feature kIPHPasswordsAccountStorageFeature{
    "IPH_PasswordsAccountStorage", base::FEATURE_ENABLED_BY_DEFAULT};
const base::Feature kIPHReadingListDiscoveryFeature{
    "IPH_ReadingListDiscovery", base::FEATURE_DISABLED_BY_DEFAULT};
const base::Feature kIPHReadingListEntryPointFeature{
    "IPH_ReadingListEntryPoint", base::FEATURE_DISABLED_BY_DEFAULT};
const base::Feature kIPHReadingListInSidePanelFeature{
    "IPH_ReadingListInSidePanel", base::FEATURE_DISABLED_BY_DEFAULT};
const base::Feature kIPHReopenTabFeature{"IPH_ReopenTab",
                                         base::FEATURE_DISABLED_BY_DEFAULT};
const base::Feature kIPHSideSearchFeature{"IPH_SideSearch",
                                          base::FEATURE_DISABLED_BY_DEFAULT};
const base::Feature kIPHTabSearchFeature{"IPH_TabSearch",
                                         base::FEATURE_DISABLED_BY_DEFAULT};
const base::Feature kIPHWebUITabStripFeature{"IPH_WebUITabStrip",
                                             base::FEATURE_DISABLED_BY_DEFAULT};
const base::Feature kIPHDesktopSnoozeFeature{"IPH_DesktopSnoozeFeature",
                                             base::FEATURE_DISABLED_BY_DEFAULT};
const base::Feature kIPHDesktopPwaInstallFeature{
    "IPH_DesktopPwaInstall", base::FEATURE_ENABLED_BY_DEFAULT};
const base::Feature kIPHProfileSwitchFeature{"IPH_ProfileSwitch",
                                             base::FEATURE_ENABLED_BY_DEFAULT};
const base::Feature kIPHIntentChipFeature{"IPH_IntentChip",
                                          base::FEATURE_DISABLED_BY_DEFAULT};
#endif  


}  // namespace feature_engagement
