/* Copyright (c) 2019 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "mises/build/android/jni_headers/MisesPrefServiceBridge_jni.h"

#include "base/android/jni_string.h"
#include "mises/components/constants/pref_names.h"
#include "mises/components/decentralized_dns/core/pref_names.h"
#include "mises/components/ipfs/buildflags/buildflags.h"

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

#if BUILDFLAG(ENABLE_IPFS)
#include "mises/components/ipfs/ipfs_constants.h"
#include "mises/components/ipfs/pref_names.h"
#endif


using base::android::ConvertUTF8ToJavaString;
using base::android::JavaParamRef;
using base::android::ScopedJavaLocalRef;


namespace {

Profile* GetOriginalProfile() {
  return ProfileManager::GetActiveUserProfile()->GetOriginalProfile();
}
}

namespace chrome {
namespace android {

void JNI_MisesPrefServiceBridge_SetIpfsGatewayEnabled(JNIEnv* env,
                                                      jboolean enabled) {
#if BUILDFLAG(ENABLE_IPFS)
  ipfs::IPFSResolveMethodTypes type =
      enabled ? ipfs::IPFSResolveMethodTypes::IPFS_GATEWAY
              : ipfs::IPFSResolveMethodTypes::IPFS_DISABLED;
  GetOriginalProfile()->GetPrefs()->SetInteger(kIPFSResolveMethod,
                                               static_cast<int>(type));
#endif
}

void JNI_MisesPrefServiceBridge_SetIpfsGateway(JNIEnv* env,
     const JavaParamRef<jstring>& gatewayUrl) {
#if BUILDFLAG(ENABLE_IPFS)
  GetOriginalProfile()->GetPrefs()->SetString(kIPFSPublicGatewayAddress,
                                              ConvertJavaStringToUTF8(env, gatewayUrl));
#endif
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
  g_browser_process->local_state()->SetInteger(
      decentralized_dns::kUnstoppableDomainsResolveMethod, method);
}

jint JNI_MisesPrefServiceBridge_GetUnstoppableDomainsResolveMethod(
    JNIEnv* env) {
  return g_browser_process->local_state()->GetInteger(
      decentralized_dns::kUnstoppableDomainsResolveMethod);
}

void JNI_MisesPrefServiceBridge_SetENSResolveMethod(JNIEnv* env, jint method) {
  g_browser_process->local_state()->SetInteger(
      decentralized_dns::kENSResolveMethod, method);
}

jint JNI_MisesPrefServiceBridge_GetENSResolveMethod(JNIEnv* env) {
  return g_browser_process->local_state()->GetInteger(
      decentralized_dns::kENSResolveMethod);
}


void JNI_MisesPrefServiceBridge_SetDarkModeEnabled(JNIEnv* env,
                                                      jboolean enabled) {

  GetOriginalProfile()->GetPrefs()->SetBoolean(prefs::kWebKitForceDarkModeEnabled,
                                               static_cast<bool>(enabled));

}


}  // namespace android
}  // namespace chrome
