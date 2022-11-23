/* Copyright (c) 2020 The Mises Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

package org.mises.bytecode;

import org.objectweb.asm.ClassVisitor;

public class MisesTabSwitcherModeTTCoordinatorClassAdapter extends MisesClassVisitor {
    static String sTabSwitcherModeTTCoordinatorClassName =
            "org/chromium/chrome/browser/toolbar/top/TabSwitcherModeTTCoordinator";
    static String sMisesTabSwitcherModeTTCoordinatorClassName =
            "org/chromium/chrome/browser/toolbar/top/MisesTabSwitcherModeTTCoordinator";

    public MisesTabSwitcherModeTTCoordinatorClassAdapter(ClassVisitor visitor) {
        super(visitor);

        deleteField(sMisesTabSwitcherModeTTCoordinatorClassName, "mActiveTabSwitcherToolbar");
        makeProtectedField(sTabSwitcherModeTTCoordinatorClassName, "mActiveTabSwitcherToolbar");
    }
}
