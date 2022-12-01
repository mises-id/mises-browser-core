/* Copyright (c) 2021 The Mises Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

package org.mises.bytecode;

import org.objectweb.asm.ClassVisitor;

public class MisesTabUiThemeProviderClassAdapter extends MisesClassVisitor {
    static String sTabUiThemeProviderClassName =
            "org/chromium/chrome/browser/tasks/tab_management/TabUiThemeProvider";
    static String sMisesTabUiThemeProviderClassName =
            "org/chromium/chrome/browser/tasks/tab_management/MisesTabUiThemeProvider";

    public MisesTabUiThemeProviderClassAdapter(ClassVisitor visitor) {
        super(visitor);

        // changeMethodOwner(sTabUiThemeProviderClassName, "getTitleTextColor",
        //         sMisesTabUiThemeProviderClassName);

        // changeMethodOwner(sTabUiThemeProviderClassName, "getActionButtonTintList",
        //         sMisesTabUiThemeProviderClassName);

        // changeMethodOwner(sTabUiThemeProviderClassName, "getCardViewBackgroundColor",
        //         sMisesTabUiThemeProviderClassName);
    }
}
