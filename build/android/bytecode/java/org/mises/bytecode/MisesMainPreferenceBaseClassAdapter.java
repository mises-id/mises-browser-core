/* Copyright (c) 2020 The Mises Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

package org.mises.bytecode;

import org.objectweb.asm.ClassVisitor;

public class MisesMainPreferenceBaseClassAdapter extends MisesClassVisitor {
    static String sMainPreferencesClassName =
            "org/chromium/chrome/browser/settings/MainSettings";

    static String sMisesMainPreferencesBaseClassName =
            "org/chromium/chrome/browser/settings/MisesMainPreferencesBase";

    public MisesMainPreferenceBaseClassAdapter(ClassVisitor visitor) {
        super(visitor);
        //changeSuperName(sMainPreferencesClassName,
        //                sMisesMainPreferencesBaseClassName);
    }
}
