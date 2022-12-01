/* Copyright (c) 2021 The Mises Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

package org.mises.bytecode;

import org.objectweb.asm.ClassVisitor;

public class MisesIncognitoToggleTabLayoutClassAdapter extends MisesClassVisitor {
    static String sIncognitoToggleTabLayoutClassName =
            "org/chromium/chrome/browser/toolbar/IncognitoToggleTabLayout";
    static String sMisesIncognitoToggleTabLayoutClassName =
            "org/chromium/chrome/browser/toolbar/MisesIncognitoToggleTabLayout";

    public MisesIncognitoToggleTabLayoutClassAdapter(ClassVisitor visitor) {
        super(visitor);

        // deleteField(sMisesIncognitoToggleTabLayoutClassName, "mIncognitoButtonIcon");
        // makeProtectedField(sIncognitoToggleTabLayoutClassName, "mIncognitoButtonIcon");
    }
}
