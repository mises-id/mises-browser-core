/* Copyright (c) 2022 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at https://mozilla.org/MPL/2.0/. */

package org.chromium.chrome.browser.feed;

import android.content.Context;
import android.widget.FrameLayout;

import androidx.annotation.Nullable;

import org.chromium.chrome.browser.feed.sort_ui.FeedOptionsCoordinator;
import org.chromium.chrome.browser.profiles.Profile;
import org.chromium.components.browser_ui.widget.displaystyle.UiConfig;
import org.chromium.ui.modelutil.PropertyModel;

public class MisesFeedSurfaceMediator extends FeedSurfaceMediator {
    // Own members.
    private Profile mProfile;
    // To delete in bytecode, members from parent class will be used instead.
    private FeedSurfaceCoordinator mCoordinator;
    private SnapScrollHelper mSnapScrollHelper;

    MisesFeedSurfaceMediator(
            FeedSurfaceCoordinator coordinator,
            Context context,
            @Nullable SnapScrollHelper snapScrollHelper,
            PropertyModel headerModel,
            @FeedSurfaceCoordinator.StreamTabId int openingTabId,
            FeedActionDelegate actionDelegate,
            FeedOptionsCoordinator optionsCoordinator,
            @Nullable UiConfig uiConfig,
            Profile profile) {
        super(
                coordinator,
                context,
                snapScrollHelper,
                headerModel,
                openingTabId,
                actionDelegate,
                optionsCoordinator,
                uiConfig,
                profile);

        mProfile = profile;
    }

    @Override
    void updateContent() {

        super.updateContent();

        assert !FeedFeatures.isFeedEnabled(mProfile) : "Feed should be disabled in Mises!";
        assert mCoordinator
                instanceof MisesFeedSurfaceCoordinator : "Wrong feed surface coordinator!";

        if (FeedFeatures.isFeedEnabled(mProfile)
                || !(mCoordinator instanceof MisesFeedSurfaceCoordinator)) {
            super.updateContent();
            return;
        }

        FrameLayout view = ((MisesFeedSurfaceCoordinator) mCoordinator).getFrameLayoutForPolicy();
        if (view != null) {
            return;
        }
        
        destroyPropertiesForStream();
        ((MisesFeedSurfaceCoordinator) mCoordinator).createFrameLayoutForPolicy();
        view = ((MisesFeedSurfaceCoordinator) mCoordinator).getFrameLayoutForPolicy();
        if (mSnapScrollHelper != null) {
            mSnapScrollHelper.setView(view);
            view.getViewTreeObserver().addOnScrollChangedListener(mSnapScrollHelper::handleScroll);
        }
    }

    @Override
    public void onTemplateURLServiceChanged() {
        if (!FeedFeatures.isFeedEnabled(mProfile)) {
            // We don't need any special handling since feed is disabled.
            return;
        }
        super.onTemplateURLServiceChanged();
    }
}
