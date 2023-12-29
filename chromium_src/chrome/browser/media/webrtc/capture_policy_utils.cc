#include "src/chrome/browser/media/webrtc/capture_policy_utils.cc"


#if BUILDFLAG(IS_ANDROID)

namespace capture_policy {

bool IsTransientActivationRequiredForGetDisplayMedia(
    content::WebContents* contents) {
  if (!base::FeatureList::IsEnabled(
          blink::features::kGetDisplayMediaRequiresUserActivation)) {
    return false;
  }

  if (!contents) {
    return true;
  }

  Profile* profile = Profile::FromBrowserContext(contents->GetBrowserContext());
  if (!profile) {
    return true;
  }

  PrefService* prefs = profile->GetPrefs();
  if (!prefs) {
    return true;
  }

  return !policy::IsOriginInAllowlist(
      contents->GetURL(), prefs,
      prefs::kScreenCaptureWithoutGestureAllowedForOrigins);
}

}


#endif

