/* Copyright (c) 2022 The Mises Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

package org.mises.bytecode;

import org.objectweb.asm.ClassVisitor;

public class MisesNotificationPermissionRationaleDialogControllerClassAdapter
        extends MisesClassVisitor {
    static String sContoller =
            "org/chromium/chrome/browser/notifications/permissions/NotificationPermissionRationaleDialogController";
    static String sMisesContoller =
            "org/chromium/chrome/browser/notifications/permissions/MisesNotificationPermissionRationaleDialogController";

    public MisesNotificationPermissionRationaleDialogControllerClassAdapter(ClassVisitor visitor) {
        super(visitor);

        redirectConstructor(sContoller, sMisesContoller);
        deleteMethod(sMisesContoller, "wrapDialogDismissalCallback");
        makePublicMethod(sContoller, "wrapDialogDismissalCallback");
    }
}
