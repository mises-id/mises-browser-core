/* Copyright (c) 2020 The Mises Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

package org.mises.bytecode;

import org.objectweb.asm.ClassVisitor;

public class MisesToolbarLayoutClassAdapter extends MisesClassVisitor {
    static String sCustomTabToolbarClassName =
            "org/chromium/chrome/browser/customtabs/features/toolbar/CustomTabToolbar";
    static String sToolbarPhoneClassName = "org/chromium/chrome/browser/toolbar/top/ToolbarPhone";
    static String sToolbarTabletClassName = "org/chromium/chrome/browser/toolbar/top/ToolbarTablet";
    static String sMisesToolbarLayoutClassName =
            "org/chromium/chrome/browser/toolbar/top/MisesToolbarLayoutImpl";

    public MisesToolbarLayoutClassAdapter(ClassVisitor visitor) {
        super(visitor);
        changeSuperName(sCustomTabToolbarClassName, sMisesToolbarLayoutClassName);

        changeSuperName(sToolbarPhoneClassName, sMisesToolbarLayoutClassName);

        changeSuperName(sToolbarTabletClassName, sMisesToolbarLayoutClassName);

        deleteMethod(sToolbarPhoneClassName, "onHomeButtonUpdate");
    }
}

