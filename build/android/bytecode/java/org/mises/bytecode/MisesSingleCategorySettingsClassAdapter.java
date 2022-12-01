/* Copyright (c) 2021 The Mises Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

package org.mises.bytecode;

import org.objectweb.asm.ClassVisitor;

public class MisesSingleCategorySettingsClassAdapter extends MisesClassVisitor {
    static String sSingleCategorySettingsClassName = "org/chromium/components/browser_ui/site_settings/SingleCategorySettings";
    static String sMisesSingleCategorySettingsClassName = "org/chromium/components/browser_ui/site_settings/MisesSingleCategorySettings";

    public MisesSingleCategorySettingsClassAdapter(ClassVisitor visitor) {
        super(visitor);

        // changeSuperName(sSingleCategorySettingsClassName, sMisesSingleCategorySettingsClassName);
        // changeMethodOwner(sSingleCategorySettingsClassName, "onOptionsItemSelected",
        //         sMisesSingleCategorySettingsClassName);
        // changeMethodOwner(sSingleCategorySettingsClassName, "getAddExceptionDialogMessage",
        //         sMisesSingleCategorySettingsClassName);
        // changeMethodOwner(sSingleCategorySettingsClassName, "resetList",
        //         sMisesSingleCategorySettingsClassName);
    }
}
