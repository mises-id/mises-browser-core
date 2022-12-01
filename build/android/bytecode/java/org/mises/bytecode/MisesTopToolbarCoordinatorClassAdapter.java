/* Copyright (c) 2020 The Mises Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

package org.mises.bytecode;

import org.objectweb.asm.ClassVisitor;

public class MisesTopToolbarCoordinatorClassAdapter extends MisesClassVisitor {
    static String sTopToolbarCoordinatorClassName =
            "org/chromium/chrome/browser/toolbar/top/TopToolbarCoordinator";
    static String sMisesTopToolbarCoordinatorClassName =
            "org/chromium/chrome/browser/toolbar/top/MisesTopToolbarCoordinator";

    public MisesTopToolbarCoordinatorClassAdapter(ClassVisitor visitor) {
        super(visitor);

        // redirectConstructor(sTopToolbarCoordinatorClassName, sMisesTopToolbarCoordinatorClassName);

        // deleteField(sMisesTopToolbarCoordinatorClassName, "mTabSwitcherModeCoordinator");
        // makeProtectedField(sTopToolbarCoordinatorClassName, "mTabSwitcherModeCoordinator");

        // deleteField(sMisesTopToolbarCoordinatorClassName, "mOptionalButtonController");
        // makeProtectedField(sTopToolbarCoordinatorClassName, "mOptionalButtonController");
    }
}
