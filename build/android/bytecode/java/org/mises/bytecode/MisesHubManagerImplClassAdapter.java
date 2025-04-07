/* Copyright (c) 2024 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at https://mozilla.org/MPL/2.0/. */

package org.mises.bytecode;

import org.objectweb.asm.ClassVisitor;

public class MisesHubManagerImplClassAdapter extends MisesClassVisitor {
    static String sHubManagerImplClassName = "org/chromium/chrome/browser/hub/HubManagerImpl";
    static String sMisesHubManagerImplClassName =
            "org/chromium/chrome/browser/hub/MisesHubManagerImpl";

    public MisesHubManagerImplClassAdapter(ClassVisitor visitor) {
        super(visitor);

        redirectConstructor(sHubManagerImplClassName, sMisesHubManagerImplClassName);
    }
}
