/* Copyright (c) 2022 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at https://mozilla.org/MPL/2.0/. */

#include "mises/build/android/jni_headers/MisesLocalState_jni.h"
#include "chrome/browser/browser_process.h"
#include "components/prefs/pref_service.h"

namespace chrome {
namespace android {

static base::android::ScopedJavaLocalRef<jobject>
JNI_MisesLocalState_GetPrefService(JNIEnv* env) {
  return g_browser_process->local_state()->GetJavaObject();
}

static void JNI_MisesLocalState_CommitPendingWrite(JNIEnv* env) {
  g_browser_process->local_state()->CommitPendingWrite();
}

}  // namespace android
}  // namespace chrome
