/* Copyright (c) 2023 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at https://mozilla.org/MPL/2.0/. */

package org.chromium.chrome.browser.logo;

import android.content.Context;
import android.view.View;

import org.chromium.base.Callback;
import org.chromium.chrome.browser.logo.LogoBridge.Logo;
import org.chromium.content_public.browser.LoadUrlParams;
import org.chromium.ui.modelutil.PropertyModel;

public class MisesLogoMediator extends LogoMediator {
    // To delete in bytecode, members from parent class will be used instead.
    private PropertyModel mLogoModel;
    private boolean mShouldShowLogo;
    private LogoCoordinator.VisibilityObserver mVisibilityObserver;

    public MisesLogoMediator(
            Context context,
            Callback<LoadUrlParams> logoClickedCallback,
            PropertyModel logoModel,
            boolean shouldFetchDoodle,
            Callback<LogoBridge.Logo> onLogoAvailableCallback,
            LogoCoordinator.VisibilityObserver visibilityObserver,
            CachedTintedBitmap defaultGoogleLogo) {
        super(
                context,
                logoClickedCallback,
                logoModel,
                shouldFetchDoodle,
                onLogoAvailableCallback,
                visibilityObserver,
                defaultGoogleLogo);
    }

    public void updateVisibility() {
        // We don't want any logo to be shown regardless of the search engine chosen.
        mShouldShowLogo = false;
        mLogoModel.set(LogoProperties.VISIBILITY, mShouldShowLogo);
        if (mVisibilityObserver != null) {
            mVisibilityObserver.onLogoVisibilityChanged();
        }
        
    }
}

