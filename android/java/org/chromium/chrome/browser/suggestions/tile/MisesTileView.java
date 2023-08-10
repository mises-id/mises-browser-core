/* Copyright (c) 2020 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at https://mozilla.org/MPL/2.0/. */

package org.chromium.chrome.browser.suggestions.tile;

import android.content.Context;
import android.graphics.drawable.Drawable;
import android.util.AttributeSet;
import android.widget.TextView;
import android.content.res.Resources;

import org.chromium.base.Log;
import org.chromium.chrome.R;
import org.chromium.chrome.browser.ChromeTabbedActivity;
import org.chromium.chrome.browser.profiles.Profile;
import org.chromium.chrome.browser.profiles.ProfileManager;
import org.chromium.chrome.browser.tabmodel.TabModel;
import org.chromium.components.browser_ui.widget.tile.TileView;
import org.chromium.components.user_prefs.UserPrefs;

public class MisesTileView extends SuggestionsTileView {
    private static final String TAG = "MisesTileView";

    public MisesTileView(Context context, AttributeSet attrs) {
        super(context, attrs);
    }

    @Override
    protected void setIconViewLayoutParams(Tile tile) {
        Log.v(TAG, "setIconViewLayoutParams");
        MarginLayoutParams params = (MarginLayoutParams) getIconView().getLayoutParams();
        Resources resources = getResources();
        params.width = resources.getDimensionPixelSize(R.dimen.tile_view_icon_size_mises);
        params.height = resources.getDimensionPixelSize(R.dimen.tile_view_icon_size_mises);
        params.topMargin =
                    resources.getDimensionPixelSize(R.dimen.tile_view_icon_margin_top_modern);
        getIconView().setLayoutParams(params);
    }
 
}

