/* Copyright (c) 2022 The Mises Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

package org.mises.bytecode;

import org.objectweb.asm.ClassVisitor;

public class MisesFeedSurfaceMediatorClassAdapter extends MisesClassVisitor {
    static String sFeedSurfaceMediatorClassName =
            "org/chromium/chrome/browser/feed/FeedSurfaceMediator";
    static String sMisesFeedSurfaceMediatorClassName =
            "org/chromium/chrome/browser/feed/MisesFeedSurfaceMediator";

    public MisesFeedSurfaceMediatorClassAdapter(ClassVisitor visitor) {
        super(visitor);

        redirectConstructor(sFeedSurfaceMediatorClassName, sMisesFeedSurfaceMediatorClassName);

        // deleteMethod(sMisesFeedSurfaceMediatorClassName, "destroyPropertiesForStream");
        // makePublicMethod(sFeedSurfaceMediatorClassName, "destroyPropertiesForStream");

        deleteField(sMisesFeedSurfaceMediatorClassName, "mCoordinator");
        makeProtectedField(sFeedSurfaceMediatorClassName, "mCoordinator");

        deleteField(sMisesFeedSurfaceMediatorClassName, "mSnapScrollHelper");
        makeProtectedField(sFeedSurfaceMediatorClassName, "mSnapScrollHelper");
    }
}
