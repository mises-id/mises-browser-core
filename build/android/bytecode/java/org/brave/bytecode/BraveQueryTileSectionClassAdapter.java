/* Copyright (c) 2021 The Mises Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

package org.mises.bytecode;

import org.objectweb.asm.ClassVisitor;

public class MisesQueryTileSectionClassAdapter extends MisesClassVisitor {
    static String sQueryTileSectionClassName =
            "org/chromium/chrome/browser/query_tiles/QueryTileSection";
    static String sMisesQueryTileSectionClassName =
            "org/chromium/chrome/browser/query_tiles/MisesQueryTileSection";

    public MisesQueryTileSectionClassAdapter(ClassVisitor visitor) {
        super(visitor);

        changeMethodOwner(sQueryTileSectionClassName, "getMaxRowsForMostVisitedTiles",
                sMisesQueryTileSectionClassName);
    }
}
