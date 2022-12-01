/* Copyright (c) 2022 The Mises Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

package org.mises.bytecode;

import org.objectweb.asm.ClassVisitor;

public class MisesDynamicColorsClassAdapter extends MisesClassVisitor {
    static String sDynamicColorsClassName = "com/google/android/material/color/DynamicColors";

    static String sMisesDynamicColorsClassName =
            "org/chromium/chrome/browser/util/MisesDynamicColors";

    public MisesDynamicColorsClassAdapter(ClassVisitor visitor) {
        super(visitor);

        // changeMethodOwner(sDynamicColorsClassName, "applyToActivityIfAvailable",
        //         sMisesDynamicColorsClassName);
    }
}
