/* Copyright (c) 2022 The Mises Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

package org.mises.bytecode;

import org.objectweb.asm.ClassVisitor;

public class MisesManageAccountDevicesLinkViewClassAdapter extends MisesClassVisitor {
    static String sManageAccountDevicesLinkView =
            "org/chromium/chrome/browser/share/send_tab_to_self/ManageAccountDevicesLinkView";
    static String sMisesManageAccountDevicesLinkView =
            "org/chromium/chrome/browser/share/send_tab_to_self/MisesManageAccountDevicesLinkView";

    public MisesManageAccountDevicesLinkViewClassAdapter(ClassVisitor visitor) {
        super(visitor);

        changeSuperName(sManageAccountDevicesLinkView, sMisesManageAccountDevicesLinkView);

        changeMethodOwner(sManageAccountDevicesLinkView, "inflateIfVisible",
                sMisesManageAccountDevicesLinkView);
    }
}
