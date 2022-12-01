/* Copyright (c) 2021 The Mises Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

package org.mises.bytecode;

import org.objectweb.asm.ClassVisitor;

public class MisesShareDelegateImplClassAdapter extends MisesClassVisitor {
    static String sShareDelegateImplClassName =
            "org/chromium/chrome/browser/share/ShareDelegateImpl";
    static String sMisesShareDelegateImplClassName =
            "org/chromium/chrome/browser/share/MisesShareDelegateImpl";

    public MisesShareDelegateImplClassAdapter(ClassVisitor visitor) {
        super(visitor);

        //redirectConstructor(sShareDelegateImplClassName, sMisesShareDelegateImplClassName);
    }
}
