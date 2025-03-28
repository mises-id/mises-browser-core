/* Copyright (c) 2023 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at https://mozilla.org/MPL/2.0/. */

package org.chromium.base.shared_preferences;

import org.chromium.base.MisesPreferenceKeys;

public class MisesStrictPreferenceKeyChecker extends StrictPreferenceKeyChecker {
    MisesStrictPreferenceKeyChecker(PreferenceKeyRegistry registry) {
        super(registry);
    }
    
    @Override
    public void checkIsKeyInUse(String key) {
        if (!isKeyInUse(key) && !MisesPreferenceKeys.isMisesKeyInUse(key)) {
            // Do nothing here for now. We might reconsider it in the future
            // in case we want to make some kind of sanitation of pref keys
            // used in Mises.
            // Upstreams function isKeyInUse is called here and Mises's
            // MisesPreferenceKeys.isMisesKeyInUse is just a stub method
        }
    }

    /*
     * Dummy method that will be deleted form the bytecode. {@link
     * StrictPreferenceKeyChecker#isKeyInUse} will be used instead.
     */
    private boolean isKeyInUse(String key) {
        assert false : "This method should be deleted in bytecode!";
        return false;
    }
}
