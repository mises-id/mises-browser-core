#include "mises/components/ipfs/buildflags/buildflags.h"
#if BUILDFLAG(ENABLE_IPFS)
#include "mises/components/ipfs/ipfs_constants.h"

#include "mises/browser/net/decentralized_dns_network_delegate_helper.h"
#endif
#include "components/security_state/content/android/jni_headers/SecurityStateModel_jni.h"

#define JNI_SecurityStateModel_GetSecurityLevelForWebContents \
    JNI_SecurityStateModel_GetSecurityLevelForWebContents_Chromium
#include "src/components/security_state/content/android/security_state_model_android.cc"
#undef JNI_SecurityStateModel_GetSecurityLevelForWebContents

jint JNI_SecurityStateModel_GetSecurityLevelForWebContents(
    JNIEnv* env,
    const base::android::JavaParamRef<jobject>& jweb_contents) {
  content::WebContents* web_contents =
      content::WebContents::FromJavaWebContents(jweb_contents);
  DCHECK(web_contents);
  if (web_contents) {
     const auto state = security_state::GetVisibleSecurityState(web_contents);
    if (state && decentralized_dns::ShouldHandleUrl(state->url)) {
      return security_state::NONE;
    }
  }
  return JNI_SecurityStateModel_GetSecurityLevelForWebContents_Chromium(env, jweb_contents);

}
