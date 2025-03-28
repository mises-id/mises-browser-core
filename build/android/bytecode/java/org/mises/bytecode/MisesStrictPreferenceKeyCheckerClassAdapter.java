/* Copyright (c) 2023 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at https://mozilla.org/MPL/2.0/. */

package org.mises.bytecode;

import org.objectweb.asm.ClassVisitor;

public class MisesStrictPreferenceKeyCheckerClassAdapter extends MisesClassVisitor {
    static String sStrictPreferenceKeyCheckerClassName =
            "org/chromium/base/shared_preferences/StrictPreferenceKeyChecker";

    static String sMisesStrictPreferenceKeyCheckerClassName =
            "org/chromium/base/shared_preferences/MisesStrictPreferenceKeyChecker";

    public MisesStrictPreferenceKeyCheckerClassAdapter(ClassVisitor visitor) {
        super(visitor);

        redirectConstructor(
                sStrictPreferenceKeyCheckerClassName, sMisesStrictPreferenceKeyCheckerClassName);

        deleteMethod(sMisesStrictPreferenceKeyCheckerClassName, "isKeyInUse");
        makePublicMethod(sStrictPreferenceKeyCheckerClassName, "isKeyInUse");
    }
}
