/* Copyright (c) 2022 The Mises Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

package org.mises.bytecode;

import org.objectweb.asm.ClassVisitor;

public class MisesLocationBarCoordinatorClassAdapter extends MisesClassVisitor {
    static String sLocationBarCoordinator =
            "org/chromium/chrome/browser/omnibox/LocationBarCoordinator";
    static String sMisesLocationBarCoordinator =
            "org/chromium/chrome/browser/omnibox/MisesLocationBarCoordinator";

    public MisesLocationBarCoordinatorClassAdapter(ClassVisitor visitor) {
        super(visitor);

        redirectConstructor(sLocationBarCoordinator, sMisesLocationBarCoordinator);
        deleteField(sMisesLocationBarCoordinator, "mLocationBarMediator");
        makeProtectedField(sLocationBarCoordinator, "mLocationBarMediator");
    }
}
