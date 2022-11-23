/* Copyright (c) 2021 The Mises Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

package org.mises.bytecode;

import org.objectweb.asm.ClassVisitor;

public class MisesSiteSettingsPreferencesBaseClassAdapter extends MisesClassVisitor {
    static String sSiteSettingsClassName =
            "org/chromium/components/browser_ui/site_settings/SiteSettings";
    static String sMisesSiteSettingsPreferencesBaseClassName =
            "org/chromium/components/browser_ui/site_settings/MisesSiteSettingsPreferencesBase";

    public MisesSiteSettingsPreferencesBaseClassAdapter(ClassVisitor visitor) {
        super(visitor);

        changeSuperName(sSiteSettingsClassName, sMisesSiteSettingsPreferencesBaseClassName);
    }
}
