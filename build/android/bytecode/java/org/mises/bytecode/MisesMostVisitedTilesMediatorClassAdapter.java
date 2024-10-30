/* Copyright (c) 2022 The Mises Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

package org.mises.bytecode;

import org.objectweb.asm.ClassVisitor;

public class MisesMostVisitedTilesMediatorClassAdapter extends MisesClassVisitor {
    static String sMostVisitedTilesMediatorClassName =
            "org/chromium/chrome/browser/suggestions/tile/MostVisitedTilesMediator";
    static String sMisesMostVisitedTilesMediatorClassName =
            "org/chromium/chrome/browser/suggestions/tile/MisesMostVisitedTilesMediator";

    public MisesMostVisitedTilesMediatorClassAdapter(ClassVisitor visitor) {
        super(visitor);


        redirectConstructor(
                sMostVisitedTilesMediatorClassName, sMisesMostVisitedTilesMediatorClassName);

        makePublicMethod(sMostVisitedTilesMediatorClassName, "updateTilePlaceholderVisibility");
        addMethodAnnotation(sMisesMostVisitedTilesMediatorClassName,
                "updateTilePlaceholderVisibility", "Ljava/lang/Override;");

        deleteField(sMisesMostVisitedTilesMediatorClassName, "mTileGroup");
        makeProtectedField(sMostVisitedTilesMediatorClassName, "mTileGroup");
    }
}
