/* Copyright (c) 2021 The Mises Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

package org.mises.bytecode;

import org.objectweb.asm.ClassVisitor;

public class MisesAutofillPopupBridgeClassAdapter extends MisesClassVisitor {
    static String sAutofillPopupBridgeClassName =
            "org/chromium/chrome/browser/autofill/AutofillPopupBridge";
    static String sMisesAutofillPopupBridgeClassName =
            "org/chromium/chrome/browser/autofill/MisesAutofillPopupBridge";

    public MisesAutofillPopupBridgeClassAdapter(ClassVisitor visitor) {
        super(visitor);

        redirectConstructor(sAutofillPopupBridgeClassName, sMisesAutofillPopupBridgeClassName);
    }
}
