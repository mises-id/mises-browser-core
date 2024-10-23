/* Copyright (c) 2024 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at https://mozilla.org/MPL/2.0/. */

package org.mises.bytecode;

import org.objectweb.asm.ClassVisitor;

public class MisesMostVisitedTilesLayoutBaseClassAdapter extends MisesClassVisitor {
    static String sMostVisitedTilesLayoutClassName =
            "org/chromium/chrome/browser/suggestions/tile/MostVisitedTilesLayout";
    static String sMisesMostVisitedTilesLayoutBaseClassName =
            "org/chromium/chrome/browser/suggestions/tile/MisesMostVisitedTilesLayoutBase";

    public MisesMostVisitedTilesLayoutBaseClassAdapter(ClassVisitor visitor) {
        super(visitor);

        changeSuperName(
                sMostVisitedTilesLayoutClassName, sMisesMostVisitedTilesLayoutBaseClassName);
    }
}
