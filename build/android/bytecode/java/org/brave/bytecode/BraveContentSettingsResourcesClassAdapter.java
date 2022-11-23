/* Copyright (c) 2021 The Mises Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

package org.mises.bytecode;

import org.objectweb.asm.ClassVisitor;

public class MisesContentSettingsResourcesClassAdapter extends MisesClassVisitor {
    static String sContentSettingsResourcesClassName =
            "org/chromium/components/browser_ui/site_settings/ContentSettingsResources";
    static String sMisesContentSettingsResourcesClassName =
            "org/chromium/components/browser_ui/site_settings/MisesContentSettingsResources";
    static String sContentSettingsResourcesResourceItemClassName =
            "org/chromium/components/browser_ui/site_settings/ContentSettingsResources$ResourceItem";
    static String sMisesContentSettingsResourcesResourceItemClassName =
            "org/chromium/components/browser_ui/site_settings/MisesContentSettingsResources$ResourceItem";

    public MisesContentSettingsResourcesClassAdapter(ClassVisitor visitor) {
        super(visitor);

        makePublicMethod(sContentSettingsResourcesClassName, "getResourceItem");
        changeMethodOwner(sContentSettingsResourcesClassName, "getResourceItem",
                sMisesContentSettingsResourcesClassName);
        makePublicInnerClass(sContentSettingsResourcesClassName, "ResourceItem");
        redirectConstructor(sMisesContentSettingsResourcesResourceItemClassName,
                sContentSettingsResourcesResourceItemClassName);
        redirectTypeInMethod(sMisesContentSettingsResourcesClassName, "getResourceItem",
                sMisesContentSettingsResourcesResourceItemClassName,
                sContentSettingsResourcesResourceItemClassName);
    }
}
