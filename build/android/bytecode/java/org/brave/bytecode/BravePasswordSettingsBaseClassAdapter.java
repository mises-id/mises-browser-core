/* Copyright (c) 2021 The Mises Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

package org.mises.bytecode;

import org.objectweb.asm.ClassVisitor;

public class MisesPasswordSettingsBaseClassAdapter extends MisesClassVisitor {
    static String sPasswordSettingsClassName =
            "org/chromium/chrome/browser/password_manager/settings/PasswordSettings";
    static String sMisesPasswordSettingsBaseClassName =
            "org/chromium/chrome/browser/password_manager/settings/MisesPasswordSettingsBase";

    public MisesPasswordSettingsBaseClassAdapter(ClassVisitor visitor) {
        super(visitor);

        changeSuperName(sPasswordSettingsClassName, sMisesPasswordSettingsBaseClassName);

        changeMethodOwner(sPasswordSettingsClassName, "createCheckPasswords",
                sMisesPasswordSettingsBaseClassName);
        deleteMethod(sPasswordSettingsClassName, "createCheckPasswords");
    }
}
