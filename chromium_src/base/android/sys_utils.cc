#include "base/android/sys_utils.h"

#include "base/android/jni_android.h"
#include "base/android/jni_string.h"

#include "base/no_destructor.h"

#include "mises/build/android/jni_headers/MisesSysUtils_jni.h"

namespace base {

namespace android {

namespace {
MisesSysUtils::ShowRewardAdCallback& GetPendingShowAdsCallback() {
  static base::NoDestructor<MisesSysUtils::ShowRewardAdCallback> pending_show_ads_callback_;
  return *pending_show_ads_callback_;
}
  
}

long MisesSysUtils::FirstInstallDateFromJni() {
  JNIEnv* env = AttachCurrentThread();
  return (long)Java_MisesSysUtils_firstInstallDate(env);
}

std::string MisesSysUtils::ReferrerStringFromJni() {
  JNIEnv* env = AttachCurrentThread();
  return ConvertJavaStringToUTF8(env, Java_MisesSysUtils_referrerString(env));
}

std::string MisesSysUtils::NightModeSettingsFromJni() {
  JNIEnv* env = AttachCurrentThread();
  return ConvertJavaStringToUTF8(env, Java_MisesSysUtils_nightModeSettings(env));
}

void MisesSysUtils::ShowRewardAdFromJni(ShowRewardAdCallback callback) {
  JNIEnv* env = AttachCurrentThread();
  if (GetPendingShowAdsCallback()) {
    std::move(callback).Run(100, "pending ads request");
    return;
  }
  GetPendingShowAdsCallback() = std::move(callback);
  Java_MisesSysUtils_showRewardAd(env);
}

void MisesSysUtils::CancelRewardAdFromJni() {
  JNIEnv* env = AttachCurrentThread();
  if (!GetPendingShowAdsCallback()) {
    return;
  }
  Java_MisesSysUtils_cancelRewardAd(env);
}

void MisesSysUtils::LogEventFromJni(const std::string& name, const std::string& key, const std::string& value) {
  JNIEnv* env = AttachCurrentThread();
  base::android::ScopedJavaLocalRef<jstring> j_name = base::android::ConvertUTF8ToJavaString(env, name);
  base::android::ScopedJavaLocalRef<jstring> j_key = base::android::ConvertUTF8ToJavaString(env, key);
  base::android::ScopedJavaLocalRef<jstring> j_value = base::android::ConvertUTF8ToJavaString(env, value);
  Java_MisesSysUtils_logEvent(env, j_name, j_key, j_value);
}

void MisesSysUtils::LogEventFromJni(const std::string& name, const std::string& key, const std::string& value, const std::string& key1, const std::string& value1) {
  JNIEnv* env = AttachCurrentThread();
  base::android::ScopedJavaLocalRef<jstring> j_name = base::android::ConvertUTF8ToJavaString(env, name);
  base::android::ScopedJavaLocalRef<jstring> j_key = base::android::ConvertUTF8ToJavaString(env, key);
  base::android::ScopedJavaLocalRef<jstring> j_value = base::android::ConvertUTF8ToJavaString(env, value);
  base::android::ScopedJavaLocalRef<jstring> j_key1 = base::android::ConvertUTF8ToJavaString(env, key1);
  base::android::ScopedJavaLocalRef<jstring> j_value1 = base::android::ConvertUTF8ToJavaString(env, value1);
  Java_MisesSysUtils_logEvent(env, j_name, j_key, j_value, j_key1, j_value1);
}



// static
void JNI_MisesSysUtils_OnRewardAdsResult(
    JNIEnv* env,
    jint j_code,
    const base::android::JavaParamRef<jstring>& j_message) {
  
  if (GetPendingShowAdsCallback()) {
      const std::string message =
      base::android::ConvertJavaStringToUTF8(env, j_message);
    std::move(GetPendingShowAdsCallback()).Run(j_code, message);
    GetPendingShowAdsCallback().Reset();
  }
}

}  // namespace android

}  // namespace base


#include "src/base/android/sys_utils.cc"

