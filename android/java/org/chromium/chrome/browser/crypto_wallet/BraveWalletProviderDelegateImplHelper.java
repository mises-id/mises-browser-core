/* Copyright (c) 2022 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at https://mozilla.org/MPL/2.0/. */

package org.chromium.chrome.browser.crypto_wallet;
import android.app.Activity;

import org.chromium.base.Callback;
import org.chromium.base.Log;
import org.chromium.base.annotations.CalledByNative;
import org.chromium.base.annotations.JNINamespace;
import org.chromium.base.annotations.NativeMethods;
import org.chromium.content_public.browser.WebContents;
import org.chromium.mojo.bindings.Callbacks;
import org.chromium.chrome.browser.customtabs.CustomTabActivity;
import org.chromium.base.MisesSysUtils;
import org.chromium.base.ApplicationStatus;
import org.chromium.chrome.browser.tab.Tab;


@JNINamespace("brave_wallet")
public class BraveWalletProviderDelegateImplHelper {
    private static final String TAG = "BraveWalletProvider";

    @CalledByNative
    public static void showPanel(final String url) {
      if (MisesSysUtils.getActivityContext() == null) {
        return;
      }
      
      try {
          CustomTabActivity.showInfoPage(MisesSysUtils.getActivityContext(),url);
      } catch (Exception e) {
          Log.e(TAG, "showPanel " + e);
      }
    }

    @CalledByNative
    public static void closePanel() {
      if (MisesSysUtils.getActivityContext() == null) {
        return;
      }
      
      try {
        for (Activity activity : ApplicationStatus.getRunningActivities()) {
            if (!(activity instanceof CustomTabActivity)) continue;

            CustomTabActivity customTabActivity = (CustomTabActivity) activity;
            Tab tab = customTabActivity.getActivityTab();
            if (tab != null && tab.getUrl().getSpec().startsWith("chrome://wallet-panel")) {
                customTabActivity.finishAndRemoveTask();
            }

            
        }
      } catch (Exception e) {
          Log.e(TAG, "closePanel " + e);
      }
    }

    @CalledByNative
    public static void showWalletOnboarding() {
        // try {
        //     BraveActivity activity = BraveActivity.getBraveActivity();
        //     activity.showWalletOnboarding();
        // } catch (BraveActivity.BraveActivityNotFoundException e) {
        //     Log.e(TAG, "showWalletOnboarding " + e);
        // }

        
    }

    @CalledByNative
    public static void walletInteractionDetected(WebContents webContents) {
        // try {
        //     BraveActivity activity = BraveActivity.getBraveActivity();
        //     activity.walletInteractionDetected(webContents);
        // } catch (BraveActivity.BraveActivityNotFoundException e) {
        //     Log.e(TAG, "walletInteractionDetected " + e);
        // }
    }

    @CalledByNative
    public static boolean isWeb3NotificationAllowed() {
        return true;
    }

    @CalledByNative
    public static void ShowAccountCreation(String keyringId) {
        // try {
        //     BraveActivity activity = BraveActivity.getBraveActivity();
        //     activity.showAccountCreation(keyringId);
        // } catch (BraveActivity.BraveActivityNotFoundException e) {
        //     Log.e(TAG, "ShowAccountCreation " + e);
        // }
    }

    public static void IsSolanaConnected(
            WebContents webContents, String account, Callbacks.Callback1<Boolean> callback) {
        Callback<Boolean> callbackWrapper = result -> {
            callback.call(result);
        };
        BraveWalletProviderDelegateImplHelperJni.get().IsSolanaConnected(
                webContents, account, callbackWrapper);
    }

    @NativeMethods
    interface Natives {
        void IsSolanaConnected(WebContents webContents, String account, Callback<Boolean> callback);
    }
}
