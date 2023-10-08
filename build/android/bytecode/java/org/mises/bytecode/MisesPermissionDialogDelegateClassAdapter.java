/* Copyright (c) 2021 The Mises Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

package org.mises.bytecode;

import org.objectweb.asm.ClassVisitor;

public class MisesPermissionDialogDelegateClassAdapter extends MisesClassVisitor {
    static String sPermissionDialogDelegateClassName =
            "org/chromium/components/permissions/PermissionDialogDelegate";

    static String sMisesPermissionDialogDelegateClassName =
            "org/chromium/components/permissions/MisesPermissionDialogDelegate";

    public MisesPermissionDialogDelegateClassAdapter(ClassVisitor visitor) {
        super(visitor);
        changeSuperName(
                 sPermissionDialogDelegateClassName, sMisesPermissionDialogDelegateClassName);
    }
}
