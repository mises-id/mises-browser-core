/* Copyright (c) 2022 The Mises Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

package org.mises.bytecode;

import org.objectweb.asm.ClassVisitor;

public class MisesAutocompleteMediatorClassAdapter extends MisesClassVisitor {
    static String sAutocompleteMediator =
            "org/chromium/chrome/browser/omnibox/suggestions/AutocompleteMediator";
    static String sMisesAutocompleteMediator =
            "org/chromium/chrome/browser/omnibox/suggestions/MisesAutocompleteMediator";

    public MisesAutocompleteMediatorClassAdapter(ClassVisitor visitor) {
        super(visitor);

        redirectConstructor(sAutocompleteMediator, sMisesAutocompleteMediator);


        deleteField(sMisesAutocompleteMediator, "mUrlBarEditingTextProvider");
        makeProtectedField(sAutocompleteMediator, "mUrlBarEditingTextProvider");

        deleteField(sMisesAutocompleteMediator, "mNativeInitialized");
        makeProtectedField(sAutocompleteMediator, "mNativeInitialized");

        deleteField(sMisesAutocompleteMediator, "mAutocomplete");
        makeProtectedField(sAutocompleteMediator, "mAutocomplete");


        deleteField(sMisesAutocompleteMediator, "mDeferredLoadAction");
        makeProtectedField(sAutocompleteMediator, "mDeferredLoadAction");


        deleteMethod(sMisesAutocompleteMediator, "cancelAutocompleteRequests");
        makePublicMethod(sAutocompleteMediator, "cancelAutocompleteRequests");

        deleteMethod(sMisesAutocompleteMediator, "findMatchAndLoadUrl");
        makePublicMethod(sAutocompleteMediator, "findMatchAndLoadUrl");

        deleteMethod(sMisesAutocompleteMediator, "findSuggestionInAutocompleteResult");
        makePublicMethod(sAutocompleteMediator, "findSuggestionInAutocompleteResult");
                
        deleteMethod(sMisesAutocompleteMediator, "getElapsedTimeSinceInputChange");
        makePublicMethod(sAutocompleteMediator, "getElapsedTimeSinceInputChange");

        makePublicMethod(sAutocompleteMediator, "updateSuggestionUrlIfNeeded");
        addMethodAnnotation(sMisesAutocompleteMediator,
                "updateSuggestionUrlIfNeeded", "Ljava/lang/Override;");

    }
}
