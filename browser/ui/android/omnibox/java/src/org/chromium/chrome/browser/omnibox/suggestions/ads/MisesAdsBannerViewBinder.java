// Copyright 2020 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

package org.chromium.chrome.browser.omnibox.suggestions.ads;

import android.graphics.drawable.Drawable;
import android.view.View;
import org.chromium.base.Log;

import org.chromium.chrome.browser.omnibox.styles.OmniboxResourceProvider;
import org.chromium.chrome.browser.omnibox.suggestions.DropdownCommonProperties;
import org.chromium.chrome.browser.omnibox.suggestions.SuggestionCommonProperties;
import org.chromium.chrome.browser.omnibox.suggestions.base.BaseSuggestionViewBinder;
import org.chromium.chrome.browser.omnibox.suggestions.basic.SuggestionViewViewBinder;
import org.chromium.ui.modelutil.PropertyKey;
import org.chromium.ui.modelutil.PropertyModel;
import org.chromium.ui.modelutil.PropertyModelChangeProcessor.ViewBinder;


import java.util.ArrayList;
import android.os.Build.VERSION;
import android.os.Build.VERSION_CODES;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import org.chromium.chrome.browser.omnibox.R;
import android.content.Context;


/** Binder proxy for EditURL Suggestions. */
public class MisesAdsBannerViewBinder
        implements ViewBinder<PropertyModel, MisesAdsBannerView, PropertyKey> {
    private static final String TAG = "MisesAdsBannerViewBinder";
    private final BaseSuggestionViewBinder<View> mBinder;
    private ArrayList<NativeAd> adsCache = new ArrayList<>();
    private boolean adsLoading;
    private int showAdCounter;
    private AdLoader adLoader;

    public MisesAdsBannerViewBinder(final Context context) {
        mBinder = new BaseSuggestionViewBinder<>(SuggestionViewViewBinder::bind);
        initAdLoader(context);
        maybeLoadAds();
    }

    private void initAdLoader(final Context context) {

       
    }

    private void maybeLoadAds() {
        Log.i(TAG, "loadAds");
    }


    @Override
    public void bind(PropertyModel model, MisesAdsBannerView view, PropertyKey propertyKey) {

        


        if (propertyKey == MisesAdsBannerProperties.SHOWADS) {
            Log.i(TAG, "bind showads");
            final NativeAdView adView = view.getAdsView();
            if (!adsCache.isEmpty()) {
                adView.setVisibility(View.VISIBLE);
                int nextAdIdx = (showAdCounter / 4) % adsCache.size();
                final NativeAd ad = adsCache.get(nextAdIdx);
                populateNativeAdView(ad, adView);
                showAdCounter += 1;
                return;
            } else {
                adView.setVisibility(View.GONE);
                maybeLoadAds();
            }
        }

        if (propertyKey == MisesAdsBannerProperties.DELEGATE) {
            MisesAdsBannerProperties.Delegate delegate =
                    model.get(MisesAdsBannerProperties.DELEGATE);
            if (delegate != null) {
                // btnPositive.setOnClickListener(view -> { delegate.onPositiveClicked(); });

                // btnNegative.setOnClickListener(view -> {
                //     delegate.onNegativeClicked();
                // });
            }


        } else {
          if (SuggestionCommonProperties.COLOR_SCHEME == propertyKey) {
              Drawable drawable = OmniboxResourceProvider.resolveAttributeToDrawable(
                      view.getContext(), model.get(SuggestionCommonProperties.COLOR_SCHEME),
                      android.R.attr.listDivider);
              view.getDivider().setBackground(drawable);
          } else if (DropdownCommonProperties.BG_TOP_CORNER_ROUNDED == propertyKey) {
              // No divider line when the background shadow is present.
              // Also once the background shadow is present, the divider line will not to be shown
              // again, so do not need to consider to set it View.VISIBLE again.
              view.getDivider().setVisibility(View.GONE);
          }
        }
    }
}