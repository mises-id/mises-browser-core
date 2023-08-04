// Copyright 2020 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

package org.chromium.chrome.browser.omnibox.suggestions.ads;

import android.content.Context;
import android.view.Gravity;
import android.view.View;
import android.widget.FrameLayout;

import android.view.LayoutInflater;
import org.chromium.chrome.browser.omnibox.R;
//import com.google.android.gms.ads.nativead.NativeAdView;

/**
 * Container view for Search-Ready Omnibox suggestions.
 * Decorates the suggestion with a divider.
 */
public class MisesAdsBannerView extends FrameLayout {
    private NativeAdView mContent;
    private View mDivider;

    public MisesAdsBannerView(Context context) {
        super(context, null);
        
        mContent = (NativeAdView)LayoutInflater.from(context).inflate(R.layout.omnibox_mises_ads_banner,null);
        LayoutParams contentLayoutParams = generateDefaultLayoutParams();
        contentLayoutParams.width = LayoutParams.MATCH_PARENT;
        contentLayoutParams.height = LayoutParams.WRAP_CONTENT;
        addView(mContent, contentLayoutParams);

        mDivider = new View(context, null, 0, R.style.HorizontalDivider);
        LayoutParams dividerLayoutParams = generateDefaultLayoutParams();
        dividerLayoutParams.gravity = Gravity.BOTTOM;
        dividerLayoutParams.width = LayoutParams.MATCH_PARENT;
        dividerLayoutParams.height = getResources().getDimensionPixelSize(R.dimen.divider_height);
        addView(mDivider, dividerLayoutParams);
    }

    /** @return The base suggestion view for this edit URL suggestion. */
    NativeAdView getAdsView() {
        return mContent;
    }

    /** @return The divider of this edit URL suggestion. */
    View getDivider() {
        return mDivider;
    }

    @Override
    public void setSelected(boolean selected) {
        mContent.setSelected(selected);
    }
}