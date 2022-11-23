/* Copyright (c) 2020 The Mises Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

package org.mises.bytecode;

import org.objectweb.asm.ClassVisitor;

public class MisesAppMenuClassAdapter extends MisesClassVisitor {
    static String sAppMenuClassName = "org/chromium/chrome/browser/ui/appmenu/AppMenu";

    static String sMisesAppMenuClassName = "org/chromium/chrome/browser/ui/appmenu/MisesAppMenu";

    public MisesAppMenuClassAdapter(ClassVisitor visitor) {
        super(visitor);

        redirectConstructor(sAppMenuClassName, sMisesAppMenuClassName);

        changeMethodOwner(sAppMenuClassName, "getPopupPosition", sMisesAppMenuClassName);

        makePublicMethod(sAppMenuClassName, "runMenuItemEnterAnimations");
        addMethodAnnotation(
                sMisesAppMenuClassName, "runMenuItemEnterAnimations", "Ljava/lang/Override;");
    }
}
