/* Copyright (c) 2020 The Mises Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

package org.mises.bytecode;

import org.objectweb.asm.ClassVisitor;

public class MisesBottomControlsCoordinatorClassAdapter extends MisesClassVisitor {
    static String sBottomControlsCoordinatorClassName =
            "org/chromium/chrome/browser/toolbar/bottom/BottomControlsCoordinator";
    static String sMisesBottomControlsCoordinatorClassName =
            "org/chromium/chrome/browser/toolbar/bottom/MisesBottomControlsCoordinator";

    public MisesBottomControlsCoordinatorClassAdapter(ClassVisitor visitor) {
        super(visitor);

        deleteField(sMisesBottomControlsCoordinatorClassName, "mMediator");
        makeProtectedField(sBottomControlsCoordinatorClassName, "mMediator");
    }
}
