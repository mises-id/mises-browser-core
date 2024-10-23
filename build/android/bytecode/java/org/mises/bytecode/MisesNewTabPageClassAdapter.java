/* Copyright (c) 2020 The Mises Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

package org.mises.bytecode;

import org.objectweb.asm.ClassVisitor;

public class MisesNewTabPageClassAdapter extends MisesClassVisitor {
    static String sNewTabPageClassName = "org/chromium/chrome/browser/ntp/NewTabPage";
    static String sMisesNewTabPageClassName = "org/chromium/chrome/browser/ntp/MisesNewTabPage";

    public MisesNewTabPageClassAdapter(ClassVisitor visitor) {
        super(visitor);

        redirectConstructor(sNewTabPageClassName, sMisesNewTabPageClassName);

        deleteField(sMisesNewTabPageClassName, "mBrowserControlsStateProvider");
        makeProtectedField(sNewTabPageClassName, "mBrowserControlsStateProvider");

        deleteField(sMisesNewTabPageClassName, "mNewTabPageLayout");
        makeProtectedField(sNewTabPageClassName, "mNewTabPageLayout");

        deleteField(sMisesNewTabPageClassName, "mFeedSurfaceProvider");
        makeProtectedField(sNewTabPageClassName, "mFeedSurfaceProvider");

        deleteField(sMisesNewTabPageClassName, "mToolbarSupplier");
        makeProtectedField(sNewTabPageClassName, "mToolbarSupplier");

        deleteField(sMisesNewTabPageClassName, "mTabModelSelector");
        makeProtectedField(sNewTabPageClassName, "mTabModelSelector");

        deleteField(sMisesNewTabPageClassName, "mBottomSheetController");
        makeProtectedField(sNewTabPageClassName, "mBottomSheetController");

        deleteField(sMisesNewTabPageClassName, "mJankTracker");
        makeProtectedField(sNewTabPageClassName, "mJankTracker");

        deleteField(sMisesNewTabPageClassName, "mTabStripHeightSupplier");
        makeProtectedField(sNewTabPageClassName, "mTabStripHeightSupplier");

        makePublicMethod(sNewTabPageClassName, "updateSearchProviderHasLogo");
        addMethodAnnotation(
                sMisesNewTabPageClassName, "updateSearchProviderHasLogo", "Ljava/lang/Override;");
    }
}
