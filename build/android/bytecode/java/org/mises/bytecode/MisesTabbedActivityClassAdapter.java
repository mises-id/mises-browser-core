/* Copyright (c) 2020 The Mises Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

package org.mises.bytecode;

import org.objectweb.asm.ClassVisitor;

public class MisesTabbedActivityClassAdapter extends MisesClassVisitor {
    static String sChromeTabbedActivityClassName =
            "org/chromium/chrome/browser/ChromeTabbedActivity";
    static String sMisesActivityClassName = "org/chromium/chrome/browser/app/MisesActivity";
    static String sTabbedRootUiCoordinatorClassName =
            "org/chromium/chrome/browser/tabbed_mode/TabbedRootUiCoordinator";
    static String sTabbedAppMenuPropertiesDelegateClassName =
            "org/chromium/chrome/browser/tabbed_mode/TabbedAppMenuPropertiesDelegate";
    static String sMisesTabbedAppMenuPropertiesDelegateClassName =
            "org/chromium/chrome/browser/appmenu/MisesTabbedAppMenuPropertiesDelegate";
    static String sChromeTabCreatorClassName =
            "org/chromium/chrome/browser/tabmodel/ChromeTabCreator";
    static String sMisesTabCreatorClassName =
            "org/chromium/chrome/browser/tabmodel/MisesTabCreator";
    static String sAppMenuPropertiesDelegateImplClassName =
            "org/chromium/chrome/browser/app/appmenu/AppMenuPropertiesDelegateImpl";
    static String sMisesAppMenuPropertiesDelegateImplClassName =
            "org/chromium/chrome/browser/app/appmenu/MisesAppMenuPropertiesDelegateImpl";
    static String sCustomTabAppMenuPropertiesDelegateClassName =
            "org/chromium/chrome/browser/customtabs/CustomTabAppMenuPropertiesDelegate";

    public MisesTabbedActivityClassAdapter(ClassVisitor visitor) {
        super(visitor);

        //changeSuperName(sChromeTabbedActivityClassName, sMisesActivityClassName);

        changeSuperName(sTabbedAppMenuPropertiesDelegateClassName,
                sMisesAppMenuPropertiesDelegateImplClassName);

        changeSuperName(sCustomTabAppMenuPropertiesDelegateClassName,
                sMisesAppMenuPropertiesDelegateImplClassName);

        redirectConstructor(sTabbedAppMenuPropertiesDelegateClassName,
                sMisesTabbedAppMenuPropertiesDelegateClassName);

        redirectConstructor(sAppMenuPropertiesDelegateImplClassName,
                sMisesAppMenuPropertiesDelegateImplClassName);

        redirectConstructor(sChromeTabCreatorClassName, sMisesTabCreatorClassName);

        makePublicMethod(sChromeTabCreatorClassName, "getProfile");

        

        makePublicMethod(sChromeTabbedActivityClassName, "hideOverview");

        deleteMethod(sChromeTabbedActivityClassName, "supportsDynamicColors");
    }
}
