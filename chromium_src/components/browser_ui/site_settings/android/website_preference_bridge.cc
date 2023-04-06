#include "components/browser_ui/site_settings/android/site_settings_jni_headers/WebsitePreferenceBridge_jni.h"
#define JNI_WebsitePreferenceBridge_GetPermissionSettingForOrigin JNI_WebsitePreferenceBridge_GetPermissionSettingForOrigin_Chromium
#include "src/components/browser_ui/site_settings/android/website_preference_bridge.cc"
#undef JNI_WebsitePreferenceBridge_GetPermissionSettingForOrigin


ContentSetting GetPermissionSettingForOrigin_Mises(
    JNIEnv* env,
    const JavaParamRef<jobject>& jbrowser_context_handle,
    ContentSettingsType content_type,
    jstring origin,
    jstring embedder) {
  GURL url(ConvertJavaStringToUTF8(env, origin));
  std::string embedder_str = ConvertJavaStringToUTF8(env, embedder);
  GURL embedder_url;
  // TODO(raymes): This check to see if '*' is the embedder is a hack that fixes
  // crbug.com/738377. In general querying the settings for patterns is broken
  // and needs to be fixed. See crbug.com/738757.
  if (embedder_str == "*")
    embedder_url = url;
  else
    embedder_url = GURL(embedder_str);

  // If `content_type` is not permission, then we can directly read its value
  // from `HostContentSettingsMap`.
  HostContentSettingsMap* host_content_settings_map =
      GetHostContentSettingsMap(jbrowser_context_handle);
  return host_content_settings_map->GetContentSetting(
      url, embedder_url, content_type);
}
static jint JNI_WebsitePreferenceBridge_GetPermissionSettingForOrigin(
    JNIEnv* env,
    const JavaParamRef<jobject>& jbrowser_context_handle,
    jint content_settings_type,
    const JavaParamRef<jstring>& origin,
    const JavaParamRef<jstring>& embedder) {
  ContentSettingsType type =
      static_cast<ContentSettingsType>(content_settings_type);
  if (permissions::PermissionUtil::IsPermission(type)) {
    return JNI_WebsitePreferenceBridge_GetPermissionSettingForOrigin_Chromium(env, jbrowser_context_handle, content_settings_type,
                                       origin, embedder);
  } else {
    return GetPermissionSettingForOrigin_Mises(env, jbrowser_context_handle, type,
                                       origin, embedder);
  }
}



static void JNI_WebsitePreferenceBridge_SetPopupSettingForOrigin(
    JNIEnv* env,
    const JavaParamRef<jobject>& jbrowser_context_handle,
    const JavaParamRef<jstring>& origin,
    jint value,
    jboolean is_incognito) {
	JNI_WebsitePreferenceBridge_SetPermissionSettingForOrigin(
      env,  jbrowser_context_handle, static_cast<int>(ContentSettingsType::POPUPS), origin, origin,
      static_cast<ContentSetting>(value));
}