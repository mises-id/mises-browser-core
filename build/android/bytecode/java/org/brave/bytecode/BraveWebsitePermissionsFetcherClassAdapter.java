/* Copyright (c) 2021 The Mises Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

package org.mises.bytecode;

import org.objectweb.asm.ClassVisitor;

public class MisesWebsitePermissionsFetcherClassAdapter extends MisesClassVisitor {
    static String sWebsitePermissionsFetcherClassName =
            "org/chromium/components/browser_ui/site_settings/WebsitePermissionsFetcher";
    static String sMisesWebsitePermissionsFetcherClassName =
            "org/chromium/components/browser_ui/site_settings/MisesWebsitePermissionsFetcher";

    public MisesWebsitePermissionsFetcherClassAdapter(ClassVisitor visitor) {
        super(visitor);

        changeMethodOwner(sWebsitePermissionsFetcherClassName, "getPermissionsType",
                sMisesWebsitePermissionsFetcherClassName);
    }
}
