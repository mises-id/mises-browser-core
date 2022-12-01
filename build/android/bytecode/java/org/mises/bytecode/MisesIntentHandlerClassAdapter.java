/* Copyright (c) 2021 The Mises Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

package org.mises.bytecode;

import org.objectweb.asm.ClassVisitor;

public class MisesIntentHandlerClassAdapter extends MisesClassVisitor {
    static String sIntentHandlerClassName = "org/chromium/chrome/browser/IntentHandler";
    static String sMisesIntentHandlerClassName = "org/chromium/chrome/browser/MisesIntentHandler";

    public MisesIntentHandlerClassAdapter(ClassVisitor visitor) {
        super(visitor);

        // redirectConstructor(sIntentHandlerClassName, sMisesIntentHandlerClassName);

        // makePublicMethod(sIntentHandlerClassName, "getUrlForCustomTab");
        // changeMethodOwner(
        //         sMisesIntentHandlerClassName, "getUrlForCustomTab", sIntentHandlerClassName);

        // makePublicMethod(sIntentHandlerClassName, "getUrlForWebapp");
        // changeMethodOwner(sMisesIntentHandlerClassName, "getUrlForWebapp", sIntentHandlerClassName);

        // makePublicMethod(sIntentHandlerClassName, "isJavascriptSchemeOrInvalidUrl");
        // changeMethodOwner(sMisesIntentHandlerClassName, "isJavascriptSchemeOrInvalidUrl",
        //         sIntentHandlerClassName);

        // changeMethodOwner(
        //         sIntentHandlerClassName, "extractUrlFromIntent", sMisesIntentHandlerClassName);
    }
}
