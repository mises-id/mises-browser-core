/* Copyright (c) 2020 The Mises Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

package org.mises.bytecode;

import org.objectweb.asm.ClassVisitor;

public class MisesFeedSurfaceCoordinatorClassAdapter extends MisesClassVisitor {
    static String sFeedSurfaceCoordinatorClassName =
            "org/chromium/chrome/browser/feed/FeedSurfaceCoordinator";
    static String sMisesFeedSurfaceCoordinatorClassName =
            "org/chromium/chrome/browser/feed/MisesFeedSurfaceCoordinator";

    public MisesFeedSurfaceCoordinatorClassAdapter(ClassVisitor visitor) {
        super(visitor);

        deleteField(sMisesFeedSurfaceCoordinatorClassName, "mNtpHeader");
        makeProtectedField(sFeedSurfaceCoordinatorClassName, "mNtpHeader");

        deleteField(sMisesFeedSurfaceCoordinatorClassName, "mRootView");
        makeProtectedField(sFeedSurfaceCoordinatorClassName, "mRootView");
    }
}
