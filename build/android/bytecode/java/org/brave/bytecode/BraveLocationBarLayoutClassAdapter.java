/* Copyright (c) 2022 The Mises Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

package org.mises.bytecode;

import org.objectweb.asm.ClassVisitor;

public class MisesLocationBarLayoutClassAdapter extends MisesClassVisitor {
    static String sMisesLocationBarLayout =
            "org/chromium/chrome/browser/omnibox/MisesLocationBarLayout";
    static String sLocationBarPhone = "org/chromium/chrome/browser/omnibox/LocationBarPhone";
    static String sLocationBarTablet = "org/chromium/chrome/browser/omnibox/LocationBarTablet";
    static String sSearchActivityLocationBarLayout =
            "org/chromium/chrome/browser/searchwidget/SearchActivityLocationBarLayout";

    public MisesLocationBarLayoutClassAdapter(ClassVisitor visitor) {
        super(visitor);

        changeSuperName(sLocationBarPhone, sMisesLocationBarLayout);
        changeSuperName(sLocationBarTablet, sMisesLocationBarLayout);
        changeSuperName(sSearchActivityLocationBarLayout, sMisesLocationBarLayout);
    }
}
