/* Copyright (c) 2021 The Mises Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

package org.mises.bytecode;

import org.objectweb.asm.ClassVisitor;

public class MisesStatusMediatorClassAdapter extends MisesClassVisitor {
    static String sStatusMediatorClassName =
            "org/chromium/chrome/browser/omnibox/status/StatusMediator";
    static String sMisesStatusMediatorClassName =
            "org/chromium/chrome/browser/omnibox/status/MisesStatusMediator";

    public MisesStatusMediatorClassAdapter(ClassVisitor visitor) {
        super(visitor);

        // redirectConstructor(sStatusMediatorClassName, sMisesStatusMediatorClassName);

        // deleteField(sMisesStatusMediatorClassName, "mUrlHasFocus");
        // makeProtectedField(sStatusMediatorClassName, "mUrlHasFocus");
    }
}
