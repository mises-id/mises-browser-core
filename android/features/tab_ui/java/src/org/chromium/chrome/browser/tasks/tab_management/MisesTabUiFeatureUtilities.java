/* Copyright (c) 2021 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

package org.chromium.chrome.browser.tasks.tab_management;

import android.annotation.SuppressLint;
import android.content.Context;

import org.chromium.chrome.browser.flags.CachedFeatureFlags;
import org.chromium.base.shared_preferences.SharedPreferencesManager;
import org.chromium.chrome.browser.preferences.ChromeSharedPreferences;

public class MisesTabUiFeatureUtilities {
    private static final String TAB_GROUP_AUTO_CREATION_PREFERENCE =
            "Chrome.Flags.FieldTrialParamCached.TabGridLayoutAndroid:enable_tab_group_auto_creation";

    @SuppressLint("VisibleForTests")
    public static void maybeOverrideEnableTabGroupAutoCreationPreference(Context context) {
        if (TabUiFeatureUtilities.isTabGroupsAndroidEnabled(context)) {
            // Override it to make "Open in new tab" menu option in the context menu available if
            // applicable.
            SharedPreferencesManager sharedPreferencesManager = ChromeSharedPreferences.getInstance();
            sharedPreferencesManager.writeBoolean(
                    TAB_GROUP_AUTO_CREATION_PREFERENCE, true);
            CachedFeatureFlags.resetFlagsForTesting();
        }
    }

}
