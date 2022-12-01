/* Copyright (c) 2021 The Mises Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

package org.mises.bytecode;

import org.objectweb.asm.ClassVisitor;

public class MisesTabGroupUiCoordinatorClassAdapter extends MisesClassVisitor {
    static String sTabGroupUiCoordinatorClassName =
            "org/chromium/chrome/browser/tasks/tab_management/TabGroupUiCoordinator";
    static String sMisesTabGroupUiCoordinatorClassName =
            "org/chromium/chrome/browser/tasks/tab_management/MisesTabGroupUiCoordinator";

    public MisesTabGroupUiCoordinatorClassAdapter(ClassVisitor visitor) {
        super(visitor);

        // redirectConstructor(sTabGroupUiCoordinatorClassName, sMisesTabGroupUiCoordinatorClassName);

        // deleteField(sMisesTabGroupUiCoordinatorClassName, "mToolbarView");
        // makeProtectedField(sTabGroupUiCoordinatorClassName, "mToolbarView");
    }
}
