/* Copyright (c) 2024 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at https://mozilla.org/MPL/2.0/. */

package org.mises.bytecode;

import org.objectweb.asm.ClassVisitor;

public class MisesTabSwitcherPaneBaseClassAdapter extends MisesClassVisitor {
    static String sMisesTabSwitcherPaneBaseClassName =
            "org/chromium/chrome/browser/tasks/tab_management/MisesTabSwitcherPaneBase";

    static String sTabSwitcherPaneClassName =
            "org/chromium/chrome/browser/tasks/tab_management/TabSwitcherPane";

    static String sIncognitoTabSwitcherPaneClassName =
            "org/chromium/chrome/browser/tasks/tab_management/IncognitoTabSwitcherPane";

    public MisesTabSwitcherPaneBaseClassAdapter(ClassVisitor visitor) {
        super(visitor);

        changeSuperName(sTabSwitcherPaneClassName, sMisesTabSwitcherPaneBaseClassName);
        changeSuperName(sIncognitoTabSwitcherPaneClassName, sMisesTabSwitcherPaneBaseClassName);
    }
}
