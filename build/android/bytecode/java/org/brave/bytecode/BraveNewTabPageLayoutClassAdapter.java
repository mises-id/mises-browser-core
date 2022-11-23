/* Copyright (c) 2020 The Mises Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

package org.mises.bytecode;

import org.objectweb.asm.ClassVisitor;

public class MisesNewTabPageLayoutClassAdapter extends MisesClassVisitor {
    static String sNewTabPageLayoutClassName = "org/chromium/chrome/browser/ntp/NewTabPageLayout";
    static String sMisesNewTabPageLayoutClassName =
            "org/chromium/chrome/browser/ntp/MisesNewTabPageLayout";
    static String sNewTabPageLayoutSuperClassName = "android/widget/FrameLayout";

    public MisesNewTabPageLayoutClassAdapter(ClassVisitor visitor) {
        super(visitor);

        deleteField(sMisesNewTabPageLayoutClassName, "mMvTilesContainerLayout");
        makeProtectedField(sNewTabPageLayoutClassName, "mMvTilesContainerLayout");

        makePublicMethod(sNewTabPageLayoutClassName, "insertSiteSectionView");
        addMethodAnnotation(
                sMisesNewTabPageLayoutClassName, "insertSiteSectionView", "Ljava/lang/Override;");

        changeSuperName(sNewTabPageLayoutClassName, sNewTabPageLayoutSuperClassName);
    }
}
