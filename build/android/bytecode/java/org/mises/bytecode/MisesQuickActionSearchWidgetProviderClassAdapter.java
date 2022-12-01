/* Copyright (c) 2022 The Mises Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

package org.mises.bytecode;

import org.objectweb.asm.ClassVisitor;

public class MisesQuickActionSearchWidgetProviderClassAdapter extends MisesClassVisitor {
    static String sQuickActionSearchWidgetProviderClassName =
            "org/chromium/chrome/browser/quickactionsearchwidget/QuickActionSearchWidgetProvider";
    static String sMisesQuickActionSearchWidgetProviderClassName =
            "org/chromium/chrome/browser/quickactionsearchwidget/MisesQuickActionSearchWidgetProvider";

    public MisesQuickActionSearchWidgetProviderClassAdapter(ClassVisitor visitor) {
        super(visitor);
        // changeMethodOwner(sQuickActionSearchWidgetProviderClassName, "setWidgetEnabled",
        //         sMisesQuickActionSearchWidgetProviderClassName);
    }
}