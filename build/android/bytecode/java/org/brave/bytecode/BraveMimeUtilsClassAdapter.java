/* Copyright (c) 2020 The Mises Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

package org.mises.bytecode;

import org.objectweb.asm.ClassVisitor;

public class MisesMimeUtilsClassAdapter extends MisesClassVisitor {
    static String sMimeUtilsClassName = "org/chromium/chrome/browser/download/MimeUtils";

    static String sMisesMimeUtilsClassName = "org/chromium/chrome/browser/download/MisesMimeUtils";

    public MisesMimeUtilsClassAdapter(ClassVisitor visitor) {
        super(visitor);
        changeMethodOwner(sMimeUtilsClassName, "canAutoOpenMimeType", sMisesMimeUtilsClassName);
    }
}
