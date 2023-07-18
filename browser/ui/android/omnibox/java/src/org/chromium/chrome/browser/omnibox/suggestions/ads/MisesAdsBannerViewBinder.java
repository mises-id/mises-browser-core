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
import com.google.android.gms.ads.AdLoader;
import com.google.android.gms.ads.MobileAds;
import com.google.android.gms.ads.AdListener;
import com.google.android.gms.ads.AdRequest;
import com.google.android.gms.ads.LoadAdError;
import com.google.android.gms.ads.MediaContent;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import com.google.android.gms.ads.VideoController;
import com.google.android.gms.ads.VideoController.VideoLifecycleCallbacks;
import com.google.android.gms.ads.nativead.MediaView;
import com.google.android.gms.ads.nativead.NativeAd;
import com.google.android.gms.ads.nativead.NativeAdView;
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

        //test unit ca-app-pub-3940256099942544/2247696110
        //real unit ca-app-pub-3526707353288294/8739102663
        adLoader = new AdLoader.Builder(context, "ca-app-pub-3526707353288294/8739102663")
            .forNativeAd(new NativeAd.OnNativeAdLoadedListener() {
                @Override
                public void onNativeAdLoaded(NativeAd nativeAd) {
                    // if (isDestroyed()) {
                    //     nativeAd.destroy();
                    //     return;
                    // }
                    // This method sets the text, images and the native ad, etc into the ad
                    // view.
                    Log.i(TAG, "onNativeAdLoaded");
                    adsCache.add(nativeAd);
                }
            }).withAdListener(new AdListener() {
                @Override
                public void onAdFailedToLoad(LoadAdError adError) {
                    // Handle the failure by logging, altering the UI, and so on.
                    Log.i(TAG, "onAdFailedToLoad:" + adError);
                }
                @Override
                public void onAdClicked() {
                    // Log the click event or other custom behavior.
                    Log.i(TAG, "onAdClicked");
                }
            }).build();
    }

    private void maybeLoadAds() {
        if (adLoader.isLoading()) {
            return;
        }
        adLoader.loadAds(new AdRequest.Builder().build(), 5);
        Log.i(TAG, "loadAds");
    }

    public static void populateNativeAdView(NativeAd nativeAd, NativeAdView adView) {
        MediaView mediaView = adView.findViewById(R.id.ad_media);
        // Set the media view.
        adView.setMediaView(mediaView);

        // Set other ad assets.
        adView.setHeadlineView(adView.findViewById(R.id.ad_headline));
        adView.setBodyView(adView.findViewById(R.id.ad_body));
        adView.setCallToActionView(adView.findViewById(R.id.ad_call_to_action));
        ImageView imageView = adView.findViewById(R.id.ad_app_icon);
        if (VERSION.SDK_INT >= VERSION_CODES.LOLLIPOP) {
            imageView.setClipToOutline(true);
        }
        adView.setIconView(imageView);

        // The headline and mediaContent are guaranteed to be in every NativeAd.
        ((TextView) adView.getHeadlineView()).setText(nativeAd.getHeadline());
        mediaView.setMediaContent(nativeAd.getMediaContent());

        // These assets aren't guaranteed to be in every NativeAd, so it's important to
        // check before trying to display them.
        if (nativeAd.getBody() == null) {
            adView.getBodyView().setVisibility(View.INVISIBLE);
        } else {
            adView.getBodyView().setVisibility(View.VISIBLE);
            ((TextView) adView.getBodyView()).setText(nativeAd.getBody());
        }

        if (nativeAd.getCallToAction() == null) {
            adView.getCallToActionView().setVisibility(View.INVISIBLE);
        } else {
            adView.getCallToActionView().setVisibility(View.VISIBLE);
            ((Button) adView.getCallToActionView()).setText(nativeAd.getCallToAction());
        }

        if (nativeAd.getIcon() == null) {
            adView.getIconView().setVisibility(View.GONE);
        } else {
            ((ImageView) adView.getIconView()).setImageDrawable(nativeAd.getIcon().getDrawable());
            adView.getIconView().setVisibility(View.VISIBLE);
        }

        // This method tells the Google Mobile Ads SDK that you have finished populating your
        // native ad view with this native ad.
        adView.setNativeAd(nativeAd);

        // Get the video controller for the ad. One will always be provided,
        // even if the ad doesn't have a video asset.
        VideoController videoController = nativeAd.getMediaContent().getVideoController();

        // Updates the UI to say whether or not this ad has a video asset.
        if (videoController.hasVideoContent()) {

            // Create a new VideoLifecycleCallbacks object and pass it to the VideoController.
            // The VideoController will call methods on this object when events occur in the
            // video lifecycle.
            videoController.setVideoLifecycleCallbacks(
                new VideoLifecycleCallbacks() {
                    @Override
                    public void onVideoEnd() {
                    // Publishers should allow native ads to complete video playback before
                    // refreshing or replacing them with another ad in the same UI location.
                    super.onVideoEnd();
                    }
                });
        }
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