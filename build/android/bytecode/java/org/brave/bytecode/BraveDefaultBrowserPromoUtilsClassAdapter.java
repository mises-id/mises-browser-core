/* Copyright (c) 2022 The Mises Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

package org.mises.bytecode;

import org.objectweb.asm.ClassVisitor;

public class MisesDefaultBrowserPromoUtilsClassAdapter extends MisesClassVisitor {
    static String sDefaultBrowserPromoUtilsClassName =
            "org/chromium/chrome/browser/ui/default_browser_promo/DefaultBrowserPromoUtils";

    static String sMisesDefaultBrowserPromoUtilsClassName =
            "org/chromium/chrome/browser/ui/default_browser_promo/MisesDefaultBrowserPromoUtils";

    public MisesDefaultBrowserPromoUtilsClassAdapter(ClassVisitor visitor) {
        super(visitor);

        changeMethodOwner(sDefaultBrowserPromoUtilsClassName, "prepareLaunchPromoIfNeeded",
                sMisesDefaultBrowserPromoUtilsClassName);
    }
}
