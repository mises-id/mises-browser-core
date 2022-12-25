// Copyright 2013 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

#include "base/android/sys_utils.cc"

#include "base/android/jni_android.h"
#include "base/android/jni_string.h"

#include "mises/build/android/jni_headers/MisesSysUtils_jni.h"

namespace base {
namespace android {

long SysUtils::FirstInstallDateFromJni() {
  JNIEnv* env = AttachCurrentThread();
  return (long)Java_MisesSysUtils_firstInstallDate(env);
}

std::string SysUtils::ReferrerStringFromJni() {
  JNIEnv* env = AttachCurrentThread();
  return ConvertJavaStringToUTF8(env, Java_MisesSysUtils_referrerString(env));
}

std::string SysUtils::NightModeSettingsFromJni() {
  JNIEnv* env = AttachCurrentThread();
  return ConvertJavaStringToUTF8(env, Java_MisesSysUtils_nightModeSettings(env));
}

void SysUtils::LogEventFromJni(const std::string& name, const std::string& key, const std::string& value) {
  JNIEnv* env = AttachCurrentThread();
  base::android::ScopedJavaLocalRef<jstring> j_name = base::android::ConvertUTF8ToJavaString(env, name);
  base::android::ScopedJavaLocalRef<jstring> j_key = base::android::ConvertUTF8ToJavaString(env, key);
  base::android::ScopedJavaLocalRef<jstring> j_value = base::android::ConvertUTF8ToJavaString(env, value);
  Java_MisesSysUtils_logEvent(evn, j_name, j_key, j_value)
}

}  // namespace android

}  // namespace base
