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
    auto * vs = security_state::GetVisibleSecurityState(web_contents);
  }

  return JNI_SecurityStateModel_GetSecurityLevelForWebContents_Chromium(env, jweb_contents);

}
