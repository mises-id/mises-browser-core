/* Copyright (c) 2020 The Mises Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

package org.mises.bytecode;

import org.objectweb.asm.ClassVisitor;

public class MisesTileViewClassAdapter extends MisesClassVisitor {
    static String sSuggestionsTileViewClassName =
            "org/chromium/chrome/browser/suggestions/tile/SuggestionsTileView";

    static String sMisesSuggestionsTileViewBaseClassName =
            "org/chromium/chrome/browser/suggestions/tile/MisesTileView";

    public MisesTileViewClassAdapter(ClassVisitor visitor) {
        super(visitor);
        changeSuperName(sSuggestionsTileViewClassName, sMisesSuggestionsTileViewBaseClassName);
    }
}
