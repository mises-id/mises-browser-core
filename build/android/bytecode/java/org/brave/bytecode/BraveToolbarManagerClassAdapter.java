/* Copyright (c) 2020 The Mises Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

package org.mises.bytecode;

import org.objectweb.asm.ClassVisitor;

public class MisesToolbarManagerClassAdapter extends MisesClassVisitor {
    static String sToolbarManagerClassName = "org/chromium/chrome/browser/toolbar/ToolbarManager";
    static String sMisesToolbarManagerClassName =
            "org/chromium/chrome/browser/toolbar/MisesToolbarManager";

    public MisesToolbarManagerClassAdapter(ClassVisitor visitor) {
        super(visitor);

        redirectConstructor(sToolbarManagerClassName, sMisesToolbarManagerClassName);

        deleteField(sMisesToolbarManagerClassName, "mBottomControlsCoordinatorSupplier");
        makeProtectedField(sToolbarManagerClassName, "mBottomControlsCoordinatorSupplier");

        deleteField(sMisesToolbarManagerClassName, "mCallbackController");
        makeProtectedField(sToolbarManagerClassName, "mCallbackController");

        deleteField(sMisesToolbarManagerClassName, "mBrowserControlsSizer");
        makeProtectedField(sToolbarManagerClassName, "mBrowserControlsSizer");

        deleteField(sMisesToolbarManagerClassName, "mFullscreenManager");
        makeProtectedField(sToolbarManagerClassName, "mFullscreenManager");

        deleteField(sMisesToolbarManagerClassName, "mActivityTabProvider");
        makeProtectedField(sToolbarManagerClassName, "mActivityTabProvider");

        deleteField(sMisesToolbarManagerClassName, "mAppThemeColorProvider");
        makeProtectedField(sToolbarManagerClassName, "mAppThemeColorProvider");

        deleteField(sMisesToolbarManagerClassName, "mShareDelegateSupplier");
        makeProtectedField(sToolbarManagerClassName, "mShareDelegateSupplier");

        deleteField(sMisesToolbarManagerClassName, "mScrimCoordinator");
        makeProtectedField(sToolbarManagerClassName, "mScrimCoordinator");

        deleteField(sMisesToolbarManagerClassName, "mShowStartSurfaceSupplier");
        makeProtectedField(sToolbarManagerClassName, "mShowStartSurfaceSupplier");

        deleteField(sMisesToolbarManagerClassName, "mMenuButtonCoordinator");
        makeProtectedField(sToolbarManagerClassName, "mMenuButtonCoordinator");

        deleteField(sMisesToolbarManagerClassName, "mToolbarTabController");
        makeProtectedField(sToolbarManagerClassName, "mToolbarTabController");

        deleteField(sMisesToolbarManagerClassName, "mLocationBar");
        makeProtectedField(sToolbarManagerClassName, "mLocationBar");

        deleteField(sMisesToolbarManagerClassName, "mActionModeController");
        makeProtectedField(sToolbarManagerClassName, "mActionModeController");

        deleteField(sMisesToolbarManagerClassName, "mLocationBarModel");
        makeProtectedField(sToolbarManagerClassName, "mLocationBarModel");

        deleteField(sMisesToolbarManagerClassName, "mToolbar");
        makeProtectedField(sToolbarManagerClassName, "mToolbar");

        deleteField(sMisesToolbarManagerClassName, "mBookmarkModelSupplier");
        makeProtectedField(sToolbarManagerClassName, "mBookmarkModelSupplier");

        deleteField(sMisesToolbarManagerClassName, "mLayoutManager");
        makeProtectedField(sToolbarManagerClassName, "mLayoutManager");

        deleteField(sMisesToolbarManagerClassName, "mOverlayPanelVisibilitySupplier");
        makeProtectedField(sToolbarManagerClassName, "mOverlayPanelVisibilitySupplier");

        deleteField(sMisesToolbarManagerClassName, "mTabModelSelector");
        makeProtectedField(sToolbarManagerClassName, "mTabModelSelector");

        deleteField(sMisesToolbarManagerClassName, "mIncognitoStateProvider");
        makeProtectedField(sToolbarManagerClassName, "mIncognitoStateProvider");

        deleteField(sMisesToolbarManagerClassName, "mTabCountProvider");
        makeProtectedField(sToolbarManagerClassName, "mTabCountProvider");

        deleteField(sMisesToolbarManagerClassName, "mTabGroupUi");
        makeProtectedField(sToolbarManagerClassName, "mTabGroupUi");

        deleteField(sMisesToolbarManagerClassName, "mBottomSheetController");
        makeProtectedField(sToolbarManagerClassName, "mBottomSheetController");

        deleteField(sMisesToolbarManagerClassName, "mActivityLifecycleDispatcher");
        makeProtectedField(sToolbarManagerClassName, "mActivityLifecycleDispatcher");

        deleteField(sMisesToolbarManagerClassName, "mIsWarmOnResumeSupplier");
        makeProtectedField(sToolbarManagerClassName, "mIsWarmOnResumeSupplier");

        deleteField(sMisesToolbarManagerClassName, "mTabContentManager");
        makeProtectedField(sToolbarManagerClassName, "mTabContentManager");

        deleteField(sMisesToolbarManagerClassName, "mTabCreatorManager");
        makeProtectedField(sToolbarManagerClassName, "mTabCreatorManager");

        deleteField(sMisesToolbarManagerClassName, "mSnackbarManager");
        makeProtectedField(sToolbarManagerClassName, "mSnackbarManager");

        deleteField(sMisesToolbarManagerClassName, "mTabObscuringHandler");
        makeProtectedField(sToolbarManagerClassName, "mTabObscuringHandler");

        makePublicMethod(sToolbarManagerClassName, "onOrientationChange");
        addMethodAnnotation(
                sMisesToolbarManagerClassName, "onOrientationChange", "Ljava/lang/Override;");

        makePublicMethod(sToolbarManagerClassName, "updateBookmarkButtonStatus");
        addMethodAnnotation(sMisesToolbarManagerClassName, "updateBookmarkButtonStatus",
                "Ljava/lang/Override;");

        makePublicMethod(sToolbarManagerClassName, "updateReloadState");
        deleteMethod(sMisesToolbarManagerClassName, "updateReloadState");
    }
}
