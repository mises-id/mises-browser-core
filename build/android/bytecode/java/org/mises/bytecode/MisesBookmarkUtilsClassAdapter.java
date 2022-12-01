/* Copyright (c) 2020 The Mises Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

package org.mises.bytecode;

import org.objectweb.asm.ClassVisitor;

public class MisesBookmarkUtilsClassAdapter extends MisesClassVisitor {
    static String sBookmarkUtilsClassName = "org/chromium/chrome/browser/bookmarks/BookmarkUtils";
    static String sMisesBookmarkUtilsClassName =
            "org/chromium/chrome/browser/bookmarks/MisesBookmarkUtils";

    public MisesBookmarkUtilsClassAdapter(ClassVisitor visitor) {
        super(visitor);

        // changeMethodOwner(
        //         sBookmarkUtilsClassName, "addOrEditBookmark", sMisesBookmarkUtilsClassName);
    }
}
