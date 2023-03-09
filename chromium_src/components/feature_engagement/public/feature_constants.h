#ifndef MISES_COMPONENTS_FEATURE_ENGAGEMENT_PUBLIC_FEATURE_CONSTANTS_H_
#define MISES_COMPONENTS_FEATURE_ENGAGEMENT_PUBLIC_FEATURE_CONSTANTS_H_

#include "base/feature_list.h"
#include "build/build_config.h"

#include "src/components/feature_engagement/public/feature_constants.h"
namespace feature_engagement {

#if BUILDFLAG(IS_ANDROID) 
extern const base::Feature kIPHDesktopSharedHighlightingFeature;
extern const base::Feature kIPHDesktopTabGroupsNewGroupFeature;
extern const base::Feature kIPHFocusHelpBubbleScreenReaderPromoFeature;
extern const base::Feature kIPHGMCCastStartStopFeature;
extern const base::Feature kIPHLiveCaptionFeature;
extern const base::Feature kIPHTabAudioMutingFeature;
extern const base::Feature kIPHPasswordsAccountStorageFeature;
extern const base::Feature kIPHReadingListDiscoveryFeature;
extern const base::Feature kIPHReadingListEntryPointFeature;
extern const base::Feature kIPHIntentChipFeature;
extern const base::Feature kIPHReadingListInSidePanelFeature;
extern const base::Feature kIPHReopenTabFeature;
extern const base::Feature kIPHSideSearchFeature;
extern const base::Feature kIPHTabSearchFeature;
extern const base::Feature kIPHWebUITabStripFeature;
extern const base::Feature kIPHDesktopSnoozeFeature;
extern const base::Feature kIPHDesktopPwaInstallFeature;
extern const base::Feature kIPHProfileSwitchFeature;
#endif  // BUILDFLAG(IS_WIN) || BUILDFLAG(IS_APPLE) || BUILDFLAG(IS_LINUX) ||
        // BUILDFLAG(IS_CHROMEOS) || BUILDFLAG(IS_FUCHSIA)


}  // namespace feature_engagement

#endif  // COMPONENTS_FEATURE_ENGAGEMENT_PUBLIC_FEATURE_CONSTANTS_H_
