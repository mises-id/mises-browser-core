/* Copyright (c) 2021 The Mises Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

package org.mises.bytecode;

import org.objectweb.asm.ClassVisitor;

public class MisesSingleWebsiteSettingsClassAdapter extends MisesClassVisitor {
    static String sSingleWebsiteSettingsClassName =
            "org/chromium/components/browser_ui/site_settings/SingleWebsiteSettings";
    static String sMisesSingleWebsiteSettingsClassName =
            "org/chromium/components/browser_ui/site_settings/MisesSingleWebsiteSettings";

    public MisesSingleWebsiteSettingsClassAdapter(ClassVisitor visitor) {
        super(visitor);

        changeSuperName(sSingleWebsiteSettingsClassName, sMisesSingleWebsiteSettingsClassName);

        changeMethodOwner(sSingleWebsiteSettingsClassName, "getPreferenceKey",
                sMisesSingleWebsiteSettingsClassName);
        changeMethodOwner(sSingleWebsiteSettingsClassName, "setupContentSettingsPreferences",
                sMisesSingleWebsiteSettingsClassName);

        makePublicMethod(sSingleWebsiteSettingsClassName, "setupContentSettingsPreference");
        changeMethodOwner(sMisesSingleWebsiteSettingsClassName, "setupContentSettingsPreference",
                sSingleWebsiteSettingsClassName);
    }
}
