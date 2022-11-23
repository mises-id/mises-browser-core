/* Copyright (c) 2020 The Mises Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

package org.mises.bytecode;

import org.objectweb.asm.ClassVisitor;

public class MisesTabSwitcherModeTopToolbarClassAdapter extends MisesClassVisitor {
    static String sTabSwitcherModeTopToolbarClassName =
            "org/chromium/chrome/browser/toolbar/top/TabSwitcherModeTopToolbar";
    static String sMisesTabSwitcherModeTopToolbarClassName =
            "org/chromium/chrome/browser/toolbar/top/MisesTabSwitcherModeTopToolbar";

    public MisesTabSwitcherModeTopToolbarClassAdapter(ClassVisitor visitor) {
        super(visitor);

        deleteField(sMisesTabSwitcherModeTopToolbarClassName, "mNewTabViewButton");
        makeProtectedField(sTabSwitcherModeTopToolbarClassName, "mNewTabViewButton");

        deleteField(sMisesTabSwitcherModeTopToolbarClassName, "mNewTabImageButton");
        makeProtectedField(sTabSwitcherModeTopToolbarClassName, "mNewTabImageButton");

        deleteField(sMisesTabSwitcherModeTopToolbarClassName, "mToggleTabStackButton");
        makeProtectedField(sTabSwitcherModeTopToolbarClassName, "mToggleTabStackButton");

        deleteField(sMisesTabSwitcherModeTopToolbarClassName, "mShouldShowNewTabVariation");
        makeProtectedField(sTabSwitcherModeTopToolbarClassName, "mShouldShowNewTabVariation");

        deleteField(sMisesTabSwitcherModeTopToolbarClassName, "mIsIncognito");
        makeProtectedField(sTabSwitcherModeTopToolbarClassName, "mIsIncognito");

        makePublicMethod(sTabSwitcherModeTopToolbarClassName, "updateNewTabButtonVisibility");
        addMethodAnnotation(sMisesTabSwitcherModeTopToolbarClassName,
                "updateNewTabButtonVisibility", "Ljava/lang/Override;");

        makePublicMethod(sTabSwitcherModeTopToolbarClassName, "getToolbarColorForCurrentState");
        addMethodAnnotation(sMisesTabSwitcherModeTopToolbarClassName,
                "getToolbarColorForCurrentState", "Ljava/lang/Override;");

        makePublicMethod(sTabSwitcherModeTopToolbarClassName, "shouldShowIncognitoToggle");
        deleteMethod(sMisesTabSwitcherModeTopToolbarClassName, "shouldShowIncognitoToggle");
    }
}
