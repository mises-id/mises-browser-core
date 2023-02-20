#include "mises/browser/android/mises/mises_controller.h"
#include <jni.h>
#include "base/android/jni_android.h"
#include "base/android/jni_string.h"
#include "base/memory/singleton.h"
#include "mises/android/features/mises/jni_headers/MisesController_jni.h"

namespace android {

// static
MisesController* MisesController::GetInstance() {
  return base::Singleton<MisesController>::get();
}

MisesController::MisesController() {}

MisesController::~MisesController() {}

void MisesController::setMisesUserInfo(const std::string& info) {
  JNIEnv* env = base::android::AttachCurrentThread();
  base::android::ScopedJavaLocalRef<jstring> j_mises_json = base::android::ConvertUTF8ToJavaString(env, info);
  Java_MisesController_setMisesUserInfo(env, j_mises_json);
}

std::string MisesController::getMisesUserInfo() {
  JNIEnv* env = base::android::AttachCurrentThread();
  base::android::ScopedJavaLocalRef<jstring> j_mises_json = Java_MisesController_getMisesUserInfo(env); 
  return base::android::ConvertJavaStringToUTF8(env, j_mises_json);
}

void MisesController::notifyPhishingDetected(const std::string& address, NotifyPhishingDetectedCallback callback) {
  JNIEnv* env = base::android::AttachCurrentThread();
  NotifyPhishingDetectedCallbackVector& callbacks = callback_map_[address];
  callbacks.push_back(std::move(callback));
  base::android::ScopedJavaLocalRef<jstring> j_address = base::android::ConvertUTF8ToJavaString(env, address);
  Java_MisesController_NotifyPhishingDetected(env, j_address);

}

void MisesController::callbackPhishingDetected(
    const std::string& address, int action) {
  NotifyPhishingDetectedCallbackVector callbacks;
  auto iter = callback_map_.find(address);
  if (iter != callback_map_.end()) {
    callbacks = std::move(iter->second);
    callback_map_.erase(iter);
  }
  for (auto& callback : callbacks) {
    std::move(callback).Run(action);
  }
}




} // namespace android



void JNI_MisesController_CallbackPhishingDetected(JNIEnv* env,
     const base::android::JavaParamRef<jstring>& address, jint action) {

  ::android::MisesController::GetInstance()->callbackPhishingDetected(
      ConvertJavaStringToUTF8(env, address), action);

}
