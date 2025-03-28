/* Copyright (c) 2020 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at https://mozilla.org/MPL/2.0/. */

package org.chromium.base;

public final class MisesPreferenceKeys {
    public static final String MISES_BOTTOM_TOOLBAR_ENABLED_KEY =
            "mises_bottom_toolbar_enabled_key";
    public static final String MISES_BOTTOM_TOOLBAR_SET_KEY = "mises_bottom_toolbar_enabled";
    public static final String MISES_IS_MENU_FROM_BOTTOM = "mises_is_menu_from_bottom";
    

    /*
     * Checks if preference key is used in Mises.
     * It's no op currently. We might reconsider
     * using it in the future for keys sanitation
     */
    public static boolean isMisesKeyInUse(String key) {
        return true;
    }
}
