#include "mises/browser/mises_tab_helpers.h"


#include "base/command_line.h"
#include "base/feature_list.h"
#include "build/build_config.h"
#include "content/public/browser/browser_context.h"
#include "content/public/browser/web_contents.h"
#include "extensions/buildflags/buildflags.h"
#include "net/base/features.h"
#include "third_party/widevine/cdm/buildflags.h"
#include "mises/components/ipfs/buildflags/buildflags.h"
#include "mises/browser/brave_wallet/brave_wallet_tab_helper.h"
#include "mises/browser/ephemeral_storage/ephemeral_storage_tab_helper.h"

#include "third_party/widevine/cdm/buildflags.h"

#if BUILDFLAG(IS_ANDROID)
#include "mises/browser/android/preferences/background_video_playback_tab_helper.h"
#endif

#if BUILDFLAG(ENABLE_IPFS)
#include "mises/browser/ipfs/ipfs_service_factory.h"
#include "mises/browser/ipfs/ipfs_tab_helper.h"
#endif
#include "components/zoom/zoom_controller.h"

#if BUILDFLAG(ENABLE_WIDEVINE)
#include "mises/browser/mises_drm_tab_helper.h"
#endif


namespace mises {
  void AttachTabHelpers(content::WebContents* web_contents) {

  #if BUILDFLAG(IS_ANDROID)
    BackgroundVideoPlaybackTabHelper::CreateForWebContents(web_contents);
  #endif

  #if BUILDFLAG(ENABLE_IPFS)
    ipfs::IPFSTabHelper::MaybeCreateForWebContents(web_contents);
  #endif
  #if BUILDFLAG(IS_ANDROID)
    zoom::ZoomController::CreateForWebContents(web_contents);
  #endif

  #if BUILDFLAG(ENABLE_WIDEVINE)
    MisesDrmTabHelper::CreateForWebContents(web_contents);
  #endif

  if (base::FeatureList::IsEnabled(net::features::kMisesEphemeralStorage)) {
    ephemeral_storage::EphemeralStorageTabHelper::CreateForWebContents(
        web_contents);
  }

    brave_wallet::BraveWalletTabHelper::CreateForWebContents(web_contents);
  }
}