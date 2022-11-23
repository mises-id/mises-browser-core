/* Copyright (c) 2022 The Mises Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

package org.mises.bytecode;

import org.objectweb.asm.ClassVisitor;

public class MisesLocationBarMediatorClassAdapter extends MisesClassVisitor {
    static String sLocationBarMediator = "org/chromium/chrome/browser/omnibox/LocationBarMediator";
    static String sMisesLocationBarMediator =
            "org/chromium/chrome/browser/omnibox/MisesLocationBarMediator";

    public MisesLocationBarMediatorClassAdapter(ClassVisitor visitor) {
        super(visitor);

        redirectConstructor(sLocationBarMediator, sMisesLocationBarMediator);

        deleteMethod(sMisesLocationBarMediator, "shouldShowDeleteButton");
        makePublicMethod(sLocationBarMediator, "shouldShowDeleteButton");

        deleteField(sMisesLocationBarMediator, "mNativeInitialized");
        makeProtectedField(sLocationBarMediator, "mNativeInitialized");
        deleteField(sMisesLocationBarMediator, "mWindowAndroid");
        makeProtectedField(sLocationBarMediator, "mWindowAndroid");
        deleteField(sMisesLocationBarMediator, "mLocationBarLayout");
        makeProtectedField(sLocationBarMediator, "mLocationBarLayout");
        deleteField(sMisesLocationBarMediator, "mIsUrlFocusChangeInProgress");
        makeProtectedField(sLocationBarMediator, "mIsUrlFocusChangeInProgress");
        deleteField(sMisesLocationBarMediator, "mUrlHasFocus");
        makeProtectedField(sLocationBarMediator, "mUrlHasFocus");
        deleteField(sMisesLocationBarMediator, "mIsTablet");
        makeProtectedField(sLocationBarMediator, "mIsTablet");
        deleteField(sMisesLocationBarMediator, "mIsLocationBarFocusedFromNtpScroll");
        makeProtectedField(sLocationBarMediator, "mIsLocationBarFocusedFromNtpScroll");
        deleteField(sMisesLocationBarMediator, "mContext");
        makeProtectedField(sLocationBarMediator, "mContext");
        deleteField(sMisesLocationBarMediator, "mBrandedColorScheme");
        makeProtectedField(sLocationBarMediator, "mBrandedColorScheme");
        deleteField(sMisesLocationBarMediator, "mAssistantVoiceSearchServiceSupplier");
        makeProtectedField(sLocationBarMediator, "mAssistantVoiceSearchServiceSupplier");
    }
}
