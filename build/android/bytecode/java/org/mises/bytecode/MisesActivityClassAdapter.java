/* Copyright (c) 2020 The Mises Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

package org.mises.bytecode;

import org.objectweb.asm.ClassVisitor;

public class MisesActivityClassAdapter extends MisesClassVisitor {
    static String sChromeActivityClassName = "org/chromium/chrome/browser/app/ChromeActivity";
    static String sMisesActivityClassName = "org/chromium/chrome/browser/app/MisesActivity";

    public MisesActivityClassAdapter(ClassVisitor visitor) {
        super(visitor);

        deleteField(sMisesActivityClassName, "mBrowserControlsManagerSupplier");
        makeProtectedField(sChromeActivityClassName, "mBrowserControlsManagerSupplier");
    }
}
