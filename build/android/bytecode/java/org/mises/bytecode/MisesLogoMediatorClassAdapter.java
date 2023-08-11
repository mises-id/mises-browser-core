/* Copyright (c) 2023 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at https://mozilla.org/MPL/2.0/. */

package org.mises.bytecode;

import org.objectweb.asm.ClassVisitor;

public class MisesLogoMediatorClassAdapter extends MisesClassVisitor {
    static String sLogoMediator = "org/chromium/chrome/browser/logo/LogoMediator";
    static String sMisesLogoMediator = "org/chromium/chrome/browser/logo/MisesLogoMediator";

    public MisesLogoMediatorClassAdapter(ClassVisitor visitor) {
        super(visitor);

        redirectConstructor(sLogoMediator, sMisesLogoMediator);

        deleteField(sMisesLogoMediator, "mLogoModel");
        makeProtectedField(sLogoMediator, "mLogoModel");

        deleteField(sMisesLogoMediator, "mShouldShowLogo");
        makeProtectedField(sLogoMediator, "mShouldShowLogo");

        makePublicMethod(sLogoMediator, "updateVisibility");
        addMethodAnnotation(sMisesLogoMediator, "updateVisibility", "Ljava/lang/Override;");
    }
}

