/* Copyright (c) 2021 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "base/android/callback_android.h"
#include "base/android/jni_android.h"
#include "base/android/jni_string.h"
#include "base/notreached.h"
#include "mises/browser/brave_wallet/brave_wallet_provider_delegate_impl_helper.h"
#include "mises/browser/brave_wallet/brave_wallet_tab_helper.h"
#include "mises/build/android/jni_headers/BraveWalletProviderDelegateImplHelper_jni.h"
#include "content/public/browser/render_frame_host.h"
#include "content/public/browser/web_contents.h"
#include "mises/components/constants/webui_url_constants.h"
#include "mises/browser/brave_wallet/tx_service_factory.h"
#include "mises/browser/brave_wallet/json_rpc_service_factory.h"
#include "mises/components/brave_wallet/browser/tx_service.h"
#include "mises/components/brave_wallet/browser/json_rpc_service.h"

using base::android::JavaParamRef;

namespace brave_wallet {

void ShowPanel(content::WebContents* web_contents) {
  LOG(INFO) << "ShowPanel";
  if (!web_contents)
    return;

  auto* tab_helper =
      brave_wallet::BraveWalletTabHelper::FromWebContents(web_contents);
  if (tab_helper) {
    GURL url  = tab_helper->GetBubbleURL();
    LOG(INFO) << "ShowPanel show " << url.spec();
    JNIEnv* env = base::android::AttachCurrentThread();
    Java_BraveWalletProviderDelegateImplHelper_showPanel(env, 
      base::android::ConvertUTF8ToJavaString(env, url.spec()));
  }

}

void ShowApprovePanel(content::WebContents* web_contents) {
  LOG(INFO) << "ShowApprovePanel";
  if (!web_contents)
    return;

  auto* tab_helper =
      brave_wallet::BraveWalletTabHelper::FromWebContents(web_contents);
  if (tab_helper) {
    GURL url  = tab_helper->GetApproveBubbleURL();
    LOG(INFO) << "ShowApprovePanel show " << url.spec();
    JNIEnv* env = base::android::AttachCurrentThread();
    Java_BraveWalletProviderDelegateImplHelper_showPanel(env, 
      base::android::ConvertUTF8ToJavaString(env, url.spec()));
  }
}


void ClosePanel(content::WebContents* web_contents) {
  JNIEnv* env = base::android::AttachCurrentThread();
  Java_BraveWalletProviderDelegateImplHelper_closePanel(env);
}
bool IsPanelShowing(content::WebContents* web_contents) {
  JNIEnv* env = base::android::AttachCurrentThread();
  return Java_BraveWalletProviderDelegateImplHelper_isPanelShowing(env);
}

void ShowWalletOnboarding(content::WebContents* web_contents) {
  if (!web_contents)
    return;

  auto* tab_helper =
      brave_wallet::BraveWalletTabHelper::FromWebContents(web_contents);
  if (tab_helper) {
    JNIEnv* env = base::android::AttachCurrentThread();
    Java_BraveWalletProviderDelegateImplHelper_showWalletOnboarding(env);
    Java_BraveWalletProviderDelegateImplHelper_showPanel(env, 
      base::android::ConvertUTF8ToJavaString(env, kBraveUIWalletOnboardingURL));
  }
}

void ShowAccountCreation(content::WebContents*, const std::string& keyring_id) {
  JNIEnv* env = base::android::AttachCurrentThread();
  Java_BraveWalletProviderDelegateImplHelper_ShowAccountCreation(
      env, base::android::ConvertUTF8ToJavaString(env, keyring_id));
}

void WalletInteractionDetected(content::WebContents* web_contents) {
  if (!web_contents)
    return;
  Java_BraveWalletProviderDelegateImplHelper_walletInteractionDetected(
      base::android::AttachCurrentThread(), web_contents->GetJavaWebContents());
}

bool IsWeb3NotificationAllowed() {
  JNIEnv* env = base::android::AttachCurrentThread();

  return Java_BraveWalletProviderDelegateImplHelper_isWeb3NotificationAllowed(
      env);
}

static void JNI_BraveWalletProviderDelegateImplHelper_IsSolanaConnected(
    JNIEnv* env,
    const JavaParamRef<jobject>& jweb_contents,
    const base::android::JavaParamRef<jstring>& jaccount,
    const JavaParamRef<jobject>& jcallback) {
  content::RenderFrameHost* rfh = nullptr;
  content::WebContents* web_contents =
      content::WebContents::FromJavaWebContents(jweb_contents);
  base::android::ScopedJavaGlobalRef callback =
      base::android::ScopedJavaGlobalRef<jobject>(jcallback);
  const std::string account = base::android::ConvertJavaStringToUTF8(env, jaccount);
  if (!(rfh = web_contents->GetPrimaryMainFrame())) {
    base::android::RunBooleanCallbackAndroid(callback, false);
    return;
  }

  auto* tab_helper =
      brave_wallet::BraveWalletTabHelper::FromWebContents(web_contents);
  if (!tab_helper) {
    base::android::RunBooleanCallbackAndroid(callback, false);
    return;
  }

  base::android::RunBooleanCallbackAndroid(
      callback,
      tab_helper->IsSolanaAccountConnected(rfh->GetGlobalId(), account));
}


static void JNI_BraveWalletProviderDelegateImplHelper_OnWalletPanelClosed(
    JNIEnv* env,
    const JavaParamRef<jobject>& jweb_contents) {
  content::RenderFrameHost* rfh = nullptr;
  content::WebContents* web_contents =
      content::WebContents::FromJavaWebContents(jweb_contents);
  if (!(rfh = web_contents->GetPrimaryMainFrame())) {
    return;
  }
  auto* tx_service = brave_wallet::TxServiceFactory::GetServiceForContext(
      rfh->GetBrowserContext());
  if (tx_service) {
    tx_service->RejectAllTransactions(mojom::CoinType::ETH);
  }
  auto* json_rpc_service =
      brave_wallet::JsonRpcServiceFactory::GetServiceForContext(
          rfh->GetBrowserContext());
  if (json_rpc_service) {
    json_rpc_service->ResetPendingRequests();
  }

  
}
}  // namespace brave_wallet
