/* Copyright (c) 2022 The Mises Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

package org.mises.bytecode;

import org.objectweb.asm.ClassVisitor;

public class MisesReaderModeManagerClassAdapter extends MisesClassVisitor {
    static String sReaderModeManagerClassName =
            "org/chromium/chrome/browser/dom_distiller/ReaderModeManager";
    static String sMisesReaderModeManagerClassName =
            "org/chromium/chrome/browser/dom_distiller/MisesReaderModeManager";

    public MisesReaderModeManagerClassAdapter(ClassVisitor visitor) {
        super(visitor);

        // redirectConstructor(sReaderModeManagerClassName, sMisesReaderModeManagerClassName);

        // deleteField(sMisesReaderModeManagerClassName, "mTab");
        // makeProtectedField(sReaderModeManagerClassName, "mTab");
    }
}
