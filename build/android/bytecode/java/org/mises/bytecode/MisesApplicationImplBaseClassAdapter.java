/* Copyright (c) 2022 The Mises Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

package org.mises.bytecode;

import org.objectweb.asm.ClassVisitor;

public class MisesApplicationImplBaseClassAdapter extends MisesClassVisitor {
    static String sChromeApplicationImplClassName =
            "org/chromium/chrome/browser/ChromeApplicationImpl";

    static String sMisesApplicationImplBaseClassName =
            "org/chromium/chrome/browser/MisesApplicationImplBase";

    public MisesApplicationImplBaseClassAdapter(ClassVisitor visitor) {
        super(visitor);
        //changeSuperName(sChromeApplicationImplClassName, sMisesApplicationImplBaseClassName);
    }
}
