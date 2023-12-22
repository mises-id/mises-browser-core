/* Copyright (c) 2022 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

package org.chromium.chrome.browser;

import org.jni_zero.JNINamespace;
import org.jni_zero.NativeMethods;
import org.chromium.chrome.browser.flags.CachedFlag;
import org.chromium.chrome.browser.flags.ChromeFeatureList;

@JNINamespace("chrome::android")
public abstract class MisesFeatureUtil {

    public static void enableFeature(
            String featureName, boolean enabled, boolean fallbackToDefault) {
        MisesFeatureUtilJni.get().enableFeature(featureName, enabled, fallbackToDefault);
    }

    @NativeMethods
    interface Natives {
        void enableFeature(String featureName, boolean enabled, boolean fallbackToDefault);
    }
}
