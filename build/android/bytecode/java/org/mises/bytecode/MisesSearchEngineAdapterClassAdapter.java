/* Copyright (c) 2020 The Mises Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

package org.mises.bytecode;

import org.objectweb.asm.ClassVisitor;

public class MisesSearchEngineAdapterClassAdapter extends MisesClassVisitor {
    static String sSearchEngineAdapterClassName =
            "org/chromium/chrome/browser/search_engines/settings/SearchEngineAdapter";

    static String sMisesSearchEngineAdapterBaseClassName =
            "org/chromium/chrome/browser/search_engines/settings/MisesBaseSearchEngineAdapter";

    static String sSearchEngineSettingsClassName =
            "org/chromium/chrome/browser/search_engines/settings/SearchEngineSettings";

    static String sMisesSearchEnginePreferenceClassName =
            "org/chromium/chrome/browser/search_engines/settings/MisesSearchEnginePreference";

    static String sMethodGetSearchEngineSourceType = "getSearchEngineSourceType";

    static String sMethodSortAndFilterUnnecessaryTemplateUrl =
            "sortAndFilterUnnecessaryTemplateUrl";

    public MisesSearchEngineAdapterClassAdapter(ClassVisitor visitor) {
        super(visitor);
        // changeSuperName(sSearchEngineAdapterClassName, sMisesSearchEngineAdapterBaseClassName);

        // changeMethodOwner(sSearchEngineAdapterClassName, sMethodGetSearchEngineSourceType,
        //         sMisesSearchEngineAdapterBaseClassName);

        // changeMethodOwner(sSearchEngineAdapterClassName, sMethodSortAndFilterUnnecessaryTemplateUrl,
        //         sMisesSearchEngineAdapterBaseClassName);

        // deleteField(sMisesSearchEnginePreferenceClassName, "mSearchEngineAdapter");
        // makeProtectedField(sSearchEngineSettingsClassName, "mSearchEngineAdapter");

        // makePublicMethod(sSearchEngineSettingsClassName, "createAdapterIfNecessary");
        // addMethodAnnotation(sMisesSearchEnginePreferenceClassName, "createAdapterIfNecessary",
        //         "Ljava/lang/Override;");
    }
}
