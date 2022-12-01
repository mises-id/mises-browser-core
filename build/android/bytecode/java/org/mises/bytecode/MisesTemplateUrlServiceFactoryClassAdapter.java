/* Copyright (c) 2022 The Mises Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

package org.mises.bytecode;

import org.objectweb.asm.ClassVisitor;

public class MisesTemplateUrlServiceFactoryClassAdapter extends MisesClassVisitor {
    static String sTemplateUrlServiceFactory =
            "org/chromium/chrome/browser/search_engines/TemplateUrlServiceFactory";

    static String sMisesTemplateUrlServiceFactory =
            "org/chromium/chrome/browser/search_engines/MisesTemplateUrlServiceFactory";

    public MisesTemplateUrlServiceFactoryClassAdapter(ClassVisitor visitor) {
        super(visitor);

        //changeMethodOwner(sTemplateUrlServiceFactory, "get", sMisesTemplateUrlServiceFactory);
    }
}
