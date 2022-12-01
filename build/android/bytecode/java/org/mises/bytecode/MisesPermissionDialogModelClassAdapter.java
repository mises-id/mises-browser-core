/* Copyright (c) 2021 The Mises Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

package org.mises.bytecode;

import org.objectweb.asm.ClassVisitor;

public class MisesPermissionDialogModelClassAdapter extends MisesClassVisitor {
    static String sPermissionDialogModelClassName =
            "org/chromium/components/permissions/PermissionDialogModel";

    static String sMisesPermissionDialogModelClassName =
            "org/chromium/components/permissions/MisesPermissionDialogModel";

    public MisesPermissionDialogModelClassAdapter(ClassVisitor visitor) {
        super(visitor);
        // changeMethodOwner(
        //         sPermissionDialogModelClassName, "getModel", sMisesPermissionDialogModelClassName);
    }
}
