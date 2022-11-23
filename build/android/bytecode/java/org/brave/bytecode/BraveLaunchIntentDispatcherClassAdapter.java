/* Copyright (c) 2020 The Mises Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

package org.mises.bytecode;

import org.objectweb.asm.ClassVisitor;

public class MisesLaunchIntentDispatcherClassAdapter extends MisesClassVisitor {
    static String sLaunchIntentDispatcherClassName = "org/chromium/chrome/browser/LaunchIntentDispatcher";
    static String sMisesLaunchIntentDispatcherClassName = "org/chromium/chrome/browser/MisesLaunchIntentDispatcher";

    public MisesLaunchIntentDispatcherClassAdapter(ClassVisitor visitor) {
        super(visitor);
        changeMethodOwner(sLaunchIntentDispatcherClassName, "isCustomTabIntent", sMisesLaunchIntentDispatcherClassName);
    }
}
