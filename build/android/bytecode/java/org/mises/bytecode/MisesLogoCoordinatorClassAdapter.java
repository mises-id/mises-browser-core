/* Copyright (c) 2022 The Mises Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

package org.mises.bytecode;

import org.objectweb.asm.ClassVisitor;

public class MisesLogoCoordinatorClassAdapter extends MisesClassVisitor {
    static String sLogoCoordinator = "org/chromium/chrome/browser/logo/LogoCoordinator";
    static String sMisesLogoCoordinator = "org/chromium/chrome/browser/logo/MisesLogoCoordinator";

    public MisesLogoCoordinatorClassAdapter(ClassVisitor visitor) {
        super(visitor);

        // redirectConstructor(sLogoCoordinator, sMisesLogoCoordinator);

        // deleteField(sMisesLogoCoordinator, "mShouldShowLogo");
        // makeProtectedField(sLogoCoordinator, "mShouldShowLogo");

        // makePublicMethod(sLogoCoordinator, "updateVisibility");
        // addMethodAnnotation(sMisesLogoCoordinator, "updateVisibility", "Ljava/lang/Override;");
    }
}
