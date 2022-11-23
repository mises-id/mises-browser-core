/* Copyright (c) 2020 The Mises Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

package org.mises.bytecode;

import org.objectweb.asm.ClassVisitor;

public class MisesNotificationManagerProxyImplClassAdapter extends MisesClassVisitor {
    static String sNotificationManagerProxyImplClassName =
            "org/chromium/components/browser_ui/notifications/NotificationManagerProxyImpl";
    static String sMisesNotificationManagerProxyImplClassName =
            "org/chromium/chrome/browser/notifications/MisesNotificationManagerProxyImpl";

    public MisesNotificationManagerProxyImplClassAdapter(ClassVisitor visitor) {
        super(visitor);

        redirectConstructor(sNotificationManagerProxyImplClassName,
                sMisesNotificationManagerProxyImplClassName);
    }
}
