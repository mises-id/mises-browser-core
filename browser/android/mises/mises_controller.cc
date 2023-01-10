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


} // namespace android
