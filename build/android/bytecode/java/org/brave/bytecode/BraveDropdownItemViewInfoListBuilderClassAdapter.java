/* Copyright (c) 2022 The Mises Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

package org.mises.bytecode;

import org.objectweb.asm.ClassVisitor;

public class MisesDropdownItemViewInfoListBuilderClassAdapter extends MisesClassVisitor {
    static String sDropdownItemViewInfoListBuilder =
            "org/chromium/chrome/browser/omnibox/suggestions/DropdownItemViewInfoListBuilder";

    static String sMisesDropdownItemViewInfoListBuilder =
            "org/chromium/chrome/browser/omnibox/suggestions/MisesDropdownItemViewInfoListBuilder";

    public MisesDropdownItemViewInfoListBuilderClassAdapter(ClassVisitor visitor) {
        super(visitor);

        redirectConstructor(
                sDropdownItemViewInfoListBuilder, sMisesDropdownItemViewInfoListBuilder);
    }
}
