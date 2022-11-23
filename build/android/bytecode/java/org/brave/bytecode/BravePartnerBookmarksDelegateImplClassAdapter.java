/* Copyright (c) 2022 The Mises Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

package org.mises.bytecode;

import org.objectweb.asm.ClassVisitor;

public class MisesPartnerBookmarksDelegateImplClassAdapter extends MisesClassVisitor {
    static String sPartnerBookmarksDelegateImplClassName =
            "org/chromium/chrome/browser/partnerbookmarks/PartnerBookmarksDelegateImpl";
    static String sMisesPartnerBookmarksDelegateImplClassName =
            "org/chromium/chrome/browser/partnerbookmarks/MisesPartnerBookmarksDelegateImpl";

    public MisesPartnerBookmarksDelegateImplClassAdapter(ClassVisitor visitor) {
        super(visitor);

        redirectConstructor(sPartnerBookmarksDelegateImplClassName,
                sMisesPartnerBookmarksDelegateImplClassName);
    }
}
