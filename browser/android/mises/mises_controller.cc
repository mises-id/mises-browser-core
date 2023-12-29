#include "mises/browser/android/mises/mises_controller.h"
#include <jni.h>
#include "base/android/jni_android.h"
#include "base/android/jni_string.h"
#include "base/memory/singleton.h"
#include "base/json/json_string_value_serializer.h"
#include "mises/android/features/mises/jni_headers/MisesController_jni.h"
#if BUILDFLAG(IS_ANDROID)
#include "base/android/sys_utils.h"
#endif
namespace chrome {
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
  base::android::Java_MisesController_setMisesUserInfo(env, j_mises_json);
}

std::string MisesController::getMisesUserInfo() {
  JNIEnv* env = base::android::AttachCurrentThread();
  base::android::ScopedJavaLocalRef<jstring> j_mises_json = base::android::Java_MisesController_getMisesUserInfo(env);
  return base::android::ConvertJavaStringToUTF8(env, j_mises_json);
}

void MisesController::notifyPhishingDetected(const std::string& address, NotifyPhishingDetectedCallback callback) {
  JNIEnv* env = base::android::AttachCurrentThread();
  NotifyPhishingDetectedCallbackVector& callbacks = callback_map_[address];
  callbacks.push_back(std::move(callback));
  base::android::ScopedJavaLocalRef<jstring> j_address = base::android::ConvertUTF8ToJavaString(env, address);
  base::android::Java_MisesController_NotifyPhishingDetected(env, j_address);

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

void  MisesController::recordEvent(const std::string& json_string){
   LOG(INFO) << "MisesController::recordEvent record event params :" << json_string;
   //json_string to dict
   JSONStringValueDeserializer deserializer(json_string);
    std::string error_msg;
    std::unique_ptr<base::Value> json_value =
            deserializer.Deserialize(nullptr, &error_msg);
    if (json_value == nullptr) {
       LOG(WARNING) << "MisesController::recordEvent json_value is null.";
       return;
    }
    if (!json_value->is_dict()) {
      LOG(WARNING) << "MisesController::recordEvent params is not a JSON dictionary.";
      return;
    }
    //event_type
     const std::string* event_type = json_value->GetDict().FindString("event_type");
     if (event_type == nullptr || (*event_type).empty()){
       LOG(WARNING) << "MisesController::recordEvent event_type is null.";
       return;
     }
     //event_params
     auto* event_params = json_value->GetDict().FindDict("params");
     if (event_params == nullptr) {
      LOG(WARNING) << "MisesController::recordEvent event_params is null.";
       return;
     }
     const std::string* key1 = event_params->FindString("key1");
     const std::string* value1 = event_params->FindString("value1");
     if (key1 == nullptr || (*key1).empty() || value1 == nullptr || (*value1).empty()) {
       LOG(WARNING) << "MisesController::recordEvent key1 or empty is empty.";
       return;
     }
     /* const std::string* key2 = event_params->FindString("key2");
     const std::string* value2 = event_params->FindString("value2"); */
      LOG(INFO) << "MisesController::recordEvent event_type=" << *event_type
      << " key1=" << *key1 << " value1=" << *value1
      ;
    base::android::MisesSysUtils::LogEventFromJni(*event_type, *key1, *value1);
}





} // namespace android




}

namespace base {

namespace android {

  void JNI_MisesController_CallbackPhishingDetected(JNIEnv* env,
     const base::android::JavaParamRef<jstring>& address, jint action) {

    chrome::android::MisesController::GetInstance()->callbackPhishingDetected(
      ConvertJavaStringToUTF8(env, address), action);

}

}
}