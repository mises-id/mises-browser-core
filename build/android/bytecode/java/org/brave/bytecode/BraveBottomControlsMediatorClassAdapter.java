/* Copyright (c) 2021 The Mises Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

package org.mises.bytecode;

import org.objectweb.asm.ClassVisitor;

public class MisesBottomControlsMediatorClassAdapter extends MisesClassVisitor {
    static String sBottomControlsMediatorClassName =
            "org/chromium/chrome/browser/toolbar/bottom/BottomControlsMediator";
    static String sMisesBottomControlsMediatorClassName =
            "org/chromium/chrome/browser/toolbar/bottom/MisesBottomControlsMediator";

    public MisesBottomControlsMediatorClassAdapter(ClassVisitor visitor) {
        super(visitor);

        redirectConstructor(
                sBottomControlsMediatorClassName, sMisesBottomControlsMediatorClassName);

        deleteField(sMisesBottomControlsMediatorClassName, "mBottomControlsHeight");
        makeProtectedField(sBottomControlsMediatorClassName, "mBottomControlsHeight");

        deleteField(sMisesBottomControlsMediatorClassName, "mModel");
        makeProtectedField(sBottomControlsMediatorClassName, "mModel");

        deleteField(sMisesBottomControlsMediatorClassName, "mBrowserControlsSizer");
        makeProtectedField(sBottomControlsMediatorClassName, "mBrowserControlsSizer");
    }
}
