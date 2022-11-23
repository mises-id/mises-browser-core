/* Copyright (c) 2020 The Mises Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

package org.mises.bytecode;

import org.objectweb.asm.ClassVisitor;

public class MisesManageSyncSettingsClassAdapter extends MisesClassVisitor {
    static String sManageSyncSettingsClassName =
            "org/chromium/chrome/browser/sync/settings/ManageSyncSettings";
    static String sMisesManageSyncSettingsClassName =
            "org/chromium/chrome/browser/sync/settings/MisesManageSyncSettings";

    MisesManageSyncSettingsClassAdapter(ClassVisitor visitor) {
        super(visitor);

        deleteField(sMisesManageSyncSettingsClassName, "mTurnOffSync");
        makeProtectedField(sManageSyncSettingsClassName, "mTurnOffSync");

        deleteField(sMisesManageSyncSettingsClassName, "mGoogleActivityControls");
        makeProtectedField(sManageSyncSettingsClassName, "mGoogleActivityControls");

        deleteField(sMisesManageSyncSettingsClassName, "mSyncEncryption");
        makeProtectedField(sManageSyncSettingsClassName, "mSyncEncryption");

        deleteField(sMisesManageSyncSettingsClassName, "mReviewSyncData");
        makeProtectedField(sManageSyncSettingsClassName, "mReviewSyncData");

        deleteField(sMisesManageSyncSettingsClassName, "mSyncPaymentsIntegration");
        makeProtectedField(sManageSyncSettingsClassName, "mSyncPaymentsIntegration");

        deleteField(sMisesManageSyncSettingsClassName, "mSyncReadingList");
        makeProtectedField(sManageSyncSettingsClassName, "mSyncReadingList");
    }
}
