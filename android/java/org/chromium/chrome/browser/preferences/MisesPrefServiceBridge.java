/* Copyright (c) 2019 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

package org.chromium.chrome.browser.preferences;

import androidx.annotation.NonNull;

import org.chromium.base.Log;
import org.chromium.base.ThreadUtils;
import org.jni_zero.JNINamespace;
import org.jni_zero.NativeMethods;
import org.chromium.chrome.browser.profiles.Profile;

@JNINamespace("chrome::android")
public class MisesPrefServiceBridge {
    private MisesPrefServiceBridge() {
    }

    private static MisesPrefServiceBridge sInstance;

    public static MisesPrefServiceBridge getInstance() {
        ThreadUtils.assertOnUiThread();
        if (sInstance == null) {
            sInstance = new MisesPrefServiceBridge();
        }
        return sInstance;
    }


    public void setBackgroundVideoPlaybackEnabled(boolean enabled) {
        MisesPrefServiceBridgeJni.get().setBackgroundVideoPlaybackEnabled(enabled);
    }

    public boolean getBackgroundVideoPlaybackEnabled() {
        return MisesPrefServiceBridgeJni.get().getBackgroundVideoPlaybackEnabled();
    }

    /**
     * @param whether the IPFS gateway should be enabled.
     */
    public void setIpfsGatewayEnabled(boolean enabled) {
        MisesPrefServiceBridgeJni.get().setIpfsGatewayEnabled(enabled);
    }

    public void setIpfsGateway(String gatewayUrl) {
        MisesPrefServiceBridgeJni.get().setIpfsGateway(gatewayUrl);
    }


    public void setReferralAndroidFirstRunTimestamp(long time) {
        MisesPrefServiceBridgeJni.get().setReferralAndroidFirstRunTimestamp(time);
    }

    public void setReferralCheckedForPromoCodeFile(boolean value) {
        MisesPrefServiceBridgeJni.get().setReferralCheckedForPromoCodeFile(value);
    }

    public void setReferralInitialization(boolean value) {
        MisesPrefServiceBridgeJni.get().setReferralInitialization(value);
    }

    public void setReferralPromoCode(String promoCode) {
        MisesPrefServiceBridgeJni.get().setReferralPromoCode(promoCode);
    }

    public void setReferralDownloadId(String downloadId) {
        MisesPrefServiceBridgeJni.get().setReferralDownloadId(downloadId);
    }


    public void setUnstoppableDomainsResolveMethod(int method) {
        MisesPrefServiceBridgeJni.get().setUnstoppableDomainsResolveMethod(method);
    }

    public int getUnstoppableDomainsResolveMethod() {
        return MisesPrefServiceBridgeJni.get().getUnstoppableDomainsResolveMethod();
    }

    public void setENSResolveMethod(int method) {
        MisesPrefServiceBridgeJni.get().setENSResolveMethod(method);
    }

    public int getENSResolveMethod() {
        return MisesPrefServiceBridgeJni.get().getENSResolveMethod();
    }

    public void setDarkModeEnabled(boolean enabled) {
        MisesPrefServiceBridgeJni.get().setDarkModeEnabled(enabled);
    }


    @NativeMethods
    interface Natives {
        void setBackgroundVideoPlaybackEnabled(boolean enabled);
        boolean getBackgroundVideoPlaybackEnabled();

        void setIpfsGatewayEnabled(boolean enabled);
        void setIpfsGateway(String gatewayUrl);

        void setReferralAndroidFirstRunTimestamp(long time);
        void setReferralCheckedForPromoCodeFile(boolean value);
        void setReferralInitialization(boolean value);
        void setReferralPromoCode(String promoCode);
        void setReferralDownloadId(String downloadId);

        void setUnstoppableDomainsResolveMethod(int method);
        void setENSResolveMethod(int method);
        int getUnstoppableDomainsResolveMethod();
        int getENSResolveMethod();

        void setDarkModeEnabled(boolean enabled);

    }
}
