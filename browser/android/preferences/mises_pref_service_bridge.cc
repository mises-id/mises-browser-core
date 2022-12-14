/* Copyright (c) 2019 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "mises/build/android/jni_headers/MisesPrefServiceBridge_jni.h"

#include "base/android/jni_string.h"
#include "mises/components/constants/pref_names.h"
#include "build/build_config.h"
#include "chrome/browser/browser_process.h"
#include "chrome/browser/content_settings/cookie_settings_factory.h"
#include "chrome/browser/content_settings/host_content_settings_map_factory.h"
#include "chrome/browser/profiles/profile.h"
#include "chrome/browser/profiles/profile_android.h"
#include "chrome/browser/profiles/profile_manager.h"
#include "chrome/common/pref_names.h"
#include "components/content_settings/core/browser/cookie_settings.h"
#include "components/content_settings/core/browser/host_content_settings_map.h"
#include "components/prefs/pref_service.h"
#include "third_party/blink/public/common/peerconnection/webrtc_ip_handling_policy.h"
#include "url/gurl.h"


using base::android::ConvertUTF8ToJavaString;
using base::android::JavaParamRef;
using base::android::ScopedJavaLocalRef;

namespace chrome {
namespace android {

void JNI_MisesPrefServiceBridge_SetIpfsGatewayEnabled(JNIEnv* env,
                                                      jboolean enabled) {
// #if BUILDFLAG(ENABLE_IPFS)
//   ipfs::IPFSResolveMethodTypes type =
//       enabled ? ipfs::IPFSResolveMethodTypes::IPFS_ASK
//               : ipfs::IPFSResolveMethodTypes::IPFS_DISABLED;
//   GetOriginalProfile()->GetPrefs()->SetInteger(kIPFSResolveMethod,
//                                                static_cast<int>(type));
// #endif
}


void JNI_MisesPrefServiceBridge_SetReferralAndroidFirstRunTimestamp(
    JNIEnv* env,
    jlong time) {
  // return g_browser_process->local_state()->SetTime(
  //     kReferralAndroidFirstRunTimestamp, base::Time::FromJavaTime(time));
}

void JNI_MisesPrefServiceBridge_SetReferralCheckedForPromoCodeFile(
    JNIEnv* env,
    jboolean value) {
  // return g_browser_process->local_state()->SetBoolean(
  //     kReferralCheckedForPromoCodeFile, value);
}

void JNI_MisesPrefServiceBridge_SetReferralInitialization(JNIEnv* env,
                                                          jboolean value) {
  // return g_browser_process->local_state()->SetBoolean(kReferralInitialization,
  //                                                     value);
}

void JNI_MisesPrefServiceBridge_SetReferralPromoCode(
    JNIEnv* env,
    const JavaParamRef<jstring>& promoCode) {
  // return g_browser_process->local_state()->SetString(
  //     kReferralPromoCode, ConvertJavaStringToUTF8(env, promoCode));
}

void JNI_MisesPrefServiceBridge_SetReferralDownloadId(
    JNIEnv* env,
    const JavaParamRef<jstring>& downloadId) {
  // return g_browser_process->local_state()->SetString(
  //     kReferralDownloadID, ConvertJavaStringToUTF8(env, downloadId));
}

void JNI_MisesPrefServiceBridge_SetUnstoppableDomainsResolveMethod(
    JNIEnv* env,
    jint method) {
  // g_browser_process->local_state()->SetInteger(
  //     decentralized_dns::kUnstoppableDomainsResolveMethod, method);
}

jint JNI_MisesPrefServiceBridge_GetUnstoppableDomainsResolveMethod(
    JNIEnv* env) {
  // return g_browser_process->local_state()->GetInteger(
  //     decentralized_dns::kUnstoppableDomainsResolveMethod);
  return 0;
}

void JNI_MisesPrefServiceBridge_SetENSResolveMethod(JNIEnv* env, jint method) {
  // g_browser_process->local_state()->SetInteger(
  //     decentralized_dns::kENSResolveMethod, method);
}

jint JNI_MisesPrefServiceBridge_GetENSResolveMethod(JNIEnv* env) {
  // return g_browser_process->local_state()->GetInteger(
  //     decentralized_dns::kENSResolveMethod);
  return 0;
}


}  // namespace android
}  // namespace chrome
