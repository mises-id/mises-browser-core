/* Copyright (c) 2020 The Mises Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

package org.mises.bytecode;

import org.objectweb.asm.ClassVisitor;

public class MisesTileViewClassAdapter extends MisesClassVisitor {
    
    static String sTileRenderClassName =
            "org/chromium/chrome/browser/suggestions/tile/TileRenderer";

    static String sMisesTileRenderClassName =
            "org/chromium/chrome/browser/suggestions/tile/MisesTileRenderer";

    public MisesTileViewClassAdapter(ClassVisitor visitor) {
        super(visitor);
        redirectConstructor(sTileRenderClassName, sMisesTileRenderClassName);

        makePublicMethod(sTileRenderClassName, "getLayout");
        addMethodAnnotation(
                sMisesTileRenderClassName, "getLayout", "Ljava/lang/Override;");

    }
}
