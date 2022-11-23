/* Copyright (c) 2021 The Mises Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

package org.mises.bytecode;

import org.objectweb.asm.ClassVisitor;

public class MisesSiteSettingsCategoryClassAdapter extends MisesClassVisitor {
    static String sSiteSettingsCategoryClassName =
            "org/chromium/components/browser_ui/site_settings/SiteSettingsCategory";
    static String sMisesSiteSettingsCategoryClassName =
            "org/chromium/components/browser_ui/site_settings/MisesSiteSettingsCategory";

    public MisesSiteSettingsCategoryClassAdapter(ClassVisitor visitor) {
        super(visitor);

        changeMethodOwner(sSiteSettingsCategoryClassName, "contentSettingsType",
                sMisesSiteSettingsCategoryClassName);
        changeMethodOwner(sSiteSettingsCategoryClassName, "preferenceKey",
                sMisesSiteSettingsCategoryClassName);
    }
}
