/* Copyright (c) 2024 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at https://mozilla.org/MPL/2.0/. */

package org.mises.bytecode;

import org.objectweb.asm.ClassVisitor;

public class MisesTabbedNavigationBarColorControllerBaseClassAdapter extends MisesClassVisitor {
    static String sTabbedNavigationBarColorControllerClassName =
            "org/chromium/chrome/browser/tabbed_mode/TabbedNavigationBarColorController";
    static String sMisesTabbedNavigationBarColorControllerBaseClassName =
            "org/chromium/chrome/browser/tabbed_mode/MisesTabbedNavigationBarColorControllerBase";

    public MisesTabbedNavigationBarColorControllerBaseClassAdapter(ClassVisitor visitor) {
        super(visitor);

        changeSuperName(
                sTabbedNavigationBarColorControllerClassName,
                sMisesTabbedNavigationBarColorControllerBaseClassName);

        deleteField(sTabbedNavigationBarColorControllerClassName, "mContext");

        deleteField(sTabbedNavigationBarColorControllerClassName, "mTabModelSelector");

        changeMethodOwner(
                sTabbedNavigationBarColorControllerClassName,
                "getNavigationBarColor",
                sMisesTabbedNavigationBarColorControllerBaseClassName);
    }
}
