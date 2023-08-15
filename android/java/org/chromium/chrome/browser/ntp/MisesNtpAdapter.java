/* Copyright (c) 2022 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at https://mozilla.org/MPL/2.0/. */

package org.chromium.chrome.browser.ntp;

import static org.chromium.ui.base.ViewUtils.dpToPx;

import android.text.TextUtils;
import android.app.Activity;
import android.content.Context;
import android.content.res.ColorStateList;
import android.graphics.Bitmap;
import android.os.Build;
import android.text.Spannable;
import android.text.SpannableStringBuilder;
import android.util.Pair;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Button;
import android.widget.RatingBar;

import androidx.annotation.NonNull;
import androidx.core.widget.ImageViewCompat;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.RequestManager;
import com.google.android.material.floatingactionbutton.FloatingActionButton;

import org.chromium.base.ContextUtils;
import org.chromium.base.Log;
import org.chromium.base.task.PostTask;
import org.chromium.base.Callback;
import org.chromium.chrome.R;
import org.chromium.chrome.browser.night_mode.GlobalNightModeStateProviderHolder;
import org.chromium.chrome.browser.preferences.MisesPref;
import org.chromium.chrome.browser.preferences.SharedPreferencesManager;
import org.chromium.chrome.browser.profiles.Profile;
import org.chromium.components.user_prefs.UserPrefs;
import org.chromium.content_public.browser.UiThreadTaskTraits;
import org.chromium.chrome.browser.tabmodel.TabCreatorManager;
import org.chromium.chrome.browser.tabmodel.TabCreator;
import org.chromium.chrome.browser.tab.TabLaunchType;

import com.google.android.gms.ads.AdView;
import com.google.android.gms.ads.nativead.NativeAdView;
import com.google.android.gms.ads.nativead.NativeAd;
import com.google.android.gms.ads.VideoController;
import com.google.android.gms.ads.VideoController.VideoLifecycleCallbacks;
import com.google.android.gms.ads.nativead.MediaView;


import org.chromium.base.MisesAdsUtil;
import org.chromium.base.MisesSysUtils;

import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

public class MisesNtpAdapter extends RecyclerView.Adapter<RecyclerView.ViewHolder> {
    private Activity mActivity;
    private RequestManager mGlide;
    private View mMvTilesContainerLayout;
    private View mMisesServiceTilesContainerLayout;
    private View mWeb3SiteTilesContainerLayout;
    private View mWeb3ExtensionTilesContainerLayout;
    private View mAdmobBannerLayout;

    private OnMisesNtpListener mOnMisesNtpListener;
    private boolean mIsTopSitesEnabled;
    private boolean mIsMisesServiceEnabled;
    private boolean mIsWeb3SiteEnabled;
    private boolean mIsWeb3ExtensionEnabled;
    private int mRecyclerViewHeight;
    private int mStatsHeight;
    private int mTopSitesHeight;
    private int mMisesServiceHeight;
    private int mNewContentHeight;
    private int mTopMarginImageCredit;
    private float mImageCreditAlpha = 1f;

    private SharedPreferencesManager.Observer mPreferenceObserver;

    private static int TYPE_MISES_SERVICE = 1;
    private static int TYPE_WEB3_SITE = 2;
    private static int TYPE_WEB3_EXTENSION = 3;
    private static int TYPE_TOP_SITES = 4;
    private static int TYPE_ADMOB_BANNER = 5;

    private static final int ONE_ITEM_SPACE = 1;
    private static final int TWO_ITEMS_SPACE = 2;
    private static final String TAG = "MisesNtpAdapter";

    public static final String PREF_SHOW_MISES_SERVICE = "show_mises_service";
    public static final String PREF_SHOW_WEB3_SITE = "show_web3_site";
    public static final String PREF_SHOW_WEB3_EXTENSION = "show_web3_extension";

    public MisesNtpAdapter(Activity activity, OnMisesNtpListener onMisesNtpListener,
            RequestManager glide, 
            View mvTilesContainerLayout, 
            View misesServiceTilesContainerLayout,
            View web3SiteTilesContainerLayout,
            View web3ExtensionTilesContainerLayout,
            View admobBannerLayout,
            int recyclerViewHeight, boolean isTopSitesEnabled) {
        mActivity = activity;
        mOnMisesNtpListener = onMisesNtpListener;
        mGlide = glide;
        mMvTilesContainerLayout = mvTilesContainerLayout;
        mMisesServiceTilesContainerLayout = misesServiceTilesContainerLayout;
        mWeb3SiteTilesContainerLayout = web3SiteTilesContainerLayout;
        mWeb3ExtensionTilesContainerLayout = web3ExtensionTilesContainerLayout;
        mAdmobBannerLayout = admobBannerLayout;
        mRecyclerViewHeight = recyclerViewHeight;
        mIsTopSitesEnabled = isTopSitesEnabled;
        mIsMisesServiceEnabled = shouldDisplayMisesService();
        mIsWeb3SiteEnabled = shouldDisplayWeb3Site();
        mIsWeb3ExtensionEnabled = shouldDisplayWeb3Extension();

        initPreferenceObserver();
    }

    public static int getViewHeight(View view) {
        view.measure(View.MeasureSpec.UNSPECIFIED, View.MeasureSpec.UNSPECIFIED);
        return view.getMeasuredHeight();
    }

    @Override
    public void onBindViewHolder(@NonNull RecyclerView.ViewHolder holder, int position) {
        LinearLayout.LayoutParams layoutParams = new LinearLayout.LayoutParams(
        LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT);
        int margin = dpToPx(mActivity, 10);
        layoutParams.setMargins(0, margin, 0, 0);
        int background = GlobalNightModeStateProviderHolder.getInstance().isInNightMode()?
            R.drawable.rounded_dark_bg_alpha : R.drawable.rounded_light_bg_alpha;
        if (holder instanceof TopSitesViewHolder) {

            mMvTilesContainerLayout.setLayoutParams(layoutParams);
            mMvTilesContainerLayout.setBackgroundResource(background);

            mTopSitesHeight = getViewHeight(holder.itemView) + margin;

        } else if (holder instanceof Web3SiteViewHolder) {

            Web3SiteViewHolder misesServiceHolder = (Web3SiteViewHolder) holder;
            misesServiceHolder.update(mIsWeb3SiteEnabled);

            misesServiceHolder.getView().setLayoutParams(layoutParams);
            misesServiceHolder.getView().setBackgroundResource(background);


        } else if (holder instanceof Web3ExtensionViewHolder) {

            Web3ExtensionViewHolder misesServiceHolder = (Web3ExtensionViewHolder) holder;
            misesServiceHolder.update(mIsWeb3ExtensionEnabled);

            misesServiceHolder.getView().setLayoutParams(layoutParams);
            misesServiceHolder.getView().setBackgroundResource(background);


        } else if (holder instanceof MisesServiceViewHolder) {

            MisesServiceViewHolder misesServiceHolder = (MisesServiceViewHolder) holder;
            misesServiceHolder.update(mIsMisesServiceEnabled);

            misesServiceHolder.getView().setLayoutParams(layoutParams);
            misesServiceHolder.getView().setBackgroundResource(background);


        } else if (holder instanceof AdmobNativeViewHolder) {

            AdmobNativeViewHolder nativeViewHolder = (AdmobNativeViewHolder) holder;
            mAdmobBannerLayout.setLayoutParams(layoutParams);
            mAdmobBannerLayout.setBackgroundResource(background);


        }

        
    }

    @Override
    public int getItemCount() {
        return getTopSitesCount() + ONE_ITEM_SPACE;
    }

    @NonNull
    @Override
    public RecyclerView.ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View view;
        if (viewType == TYPE_MISES_SERVICE) {
            return new MisesServiceViewHolder(mMisesServiceTilesContainerLayout, mActivity);

        }
        else if (viewType == TYPE_WEB3_SITE) {
            return new Web3SiteViewHolder(mWeb3SiteTilesContainerLayout, mActivity);

        }
        else if (viewType == TYPE_WEB3_EXTENSION) {
            return new Web3ExtensionViewHolder(mWeb3ExtensionTilesContainerLayout, mActivity);

        }
        else if (viewType == TYPE_ADMOB_BANNER) {
            return new AdmobNativeViewHolder(mAdmobBannerLayout, mActivity);

        }
        return new TopSitesViewHolder(mMvTilesContainerLayout);
    }

    @Override
    public void onViewDetachedFromWindow(@NonNull RecyclerView.ViewHolder holder) {
        if (holder instanceof AdmobNativeViewHolder) {

            AdmobNativeViewHolder nativeAdsHolder = (AdmobNativeViewHolder) holder;
            nativeAdsHolder.destroy();

        }
    }

    @Override
    public int getItemViewType(int position) {
        if (position == 0) {
            return TYPE_MISES_SERVICE;
        } else if (position == 1) {
            return TYPE_WEB3_SITE;
        } else if (position == 2) {
            return TYPE_WEB3_EXTENSION;
        } else if (position == 3) {
            return TYPE_TOP_SITES;
        }

        return TYPE_ADMOB_BANNER;
    }

    public int getTopSitesCount() {
        return mIsTopSitesEnabled ? 4 : 0;
    }

    public void setTopSitesEnabled(boolean isTopSitesEnabled) {
        if (mIsTopSitesEnabled != isTopSitesEnabled) {
            mIsTopSitesEnabled = isTopSitesEnabled;
            notifyItemRangeChanged(0, getTopSitesCount());
        }
    }

    public void setMisesServiceEnabled(boolean enabled) {
        Log.v(TAG, "setMisesServiceEnabled " + enabled);
        if (mIsMisesServiceEnabled != enabled) {
            mIsMisesServiceEnabled = enabled;
            notifyItemRangeChanged(0, getTopSitesCount());
        }
    }
    public void setWeb3SiteEnabled(boolean enabled) {
        Log.v(TAG, "setWeb3SiteEnabled " + enabled);
        if (mIsWeb3SiteEnabled != enabled) {
            mIsWeb3SiteEnabled = enabled;
            notifyItemRangeChanged(0, getTopSitesCount());
        }
    }
    public void setWeb3ExtensionEnabled(boolean enabled) {
        Log.v(TAG, "setWeb3ExtensionEnabled " + enabled);
        if (mIsWeb3ExtensionEnabled != enabled) {
            mIsWeb3ExtensionEnabled = enabled;
            notifyItemRangeChanged(0, getTopSitesCount());
        }
    }



    public void setRecyclerViewHeight(int recyclerViewHeight) {
        mRecyclerViewHeight = recyclerViewHeight;
        int count = getTopSitesCount();
        if (getItemCount() > count) {
            count += 1;
        }
        notifyItemRangeChanged(0, count);
    }


    public static boolean shouldDisplayMisesService() {
        return ContextUtils.getAppSharedPreferences().getBoolean(
                PREF_SHOW_MISES_SERVICE, true);
    }
    public static boolean shouldDisplayWeb3Site() {
        return ContextUtils.getAppSharedPreferences().getBoolean(
                PREF_SHOW_WEB3_SITE, true);
    }
    public static boolean shouldDisplayWeb3Extension() {
        return ContextUtils.getAppSharedPreferences().getBoolean(
                PREF_SHOW_WEB3_EXTENSION, true);
    }

    private void initPreferenceObserver() {
        mPreferenceObserver = (key) -> {
            if (TextUtils.equals(key, PREF_SHOW_MISES_SERVICE)) {
                setMisesServiceEnabled(shouldDisplayMisesService());
            }
            if (TextUtils.equals(key, PREF_SHOW_WEB3_SITE)) {
                setWeb3SiteEnabled(shouldDisplayWeb3Site());
            }

            if (TextUtils.equals(key, PREF_SHOW_WEB3_EXTENSION)) {
                setWeb3ExtensionEnabled(shouldDisplayWeb3Extension());
            }
        };
         if (mPreferenceObserver != null) {
            SharedPreferencesManager.getInstance().addObserver(mPreferenceObserver);
        }
    }

    public static class TopSitesViewHolder extends RecyclerView.ViewHolder {
        TopSitesViewHolder(View itemView) {
            super(itemView);
        }
    }

    public static class AdmobBannerViewHolder extends RecyclerView.ViewHolder {
        protected AdView mAdView;
        AdmobBannerViewHolder(View itemView, Context ctx) {
            super(itemView);
            mAdView = itemView.findViewById(R.id.av_banner);
            MisesAdsUtil.maybeLoadBannerAd(mAdView);
        }
    }
    
    public static class AdmobNativeViewHolder extends RecyclerView.ViewHolder implements Callback<NativeAd>  {
        protected NativeAdView mNativeAdView;
        private NativeAd mNativeAd;
        AdmobNativeViewHolder(View itemView, Activity ctx) {
            super(itemView);
            mNativeAdView = itemView.findViewById(R.id.av_native);
            MisesAdsUtil.maybeLoadNativeAd(ctx, mNativeAdView, this);
        }
        public void destroy() {
            Log.v(TAG, "AdmobNativeViewHolder::destroy");
            if (mNativeAd != null) {
                mNativeAd.destroy();
                mNativeAd = null;
            }
        }
        @Override
        public final void onResult(NativeAd nativeAd) {
            mNativeAdView.setVisibility(View.VISIBLE);
            mNativeAd = nativeAd;
            final NativeAdView adView = mNativeAdView;
            MediaView mediaView = adView.findViewById(R.id.ad_media);
            // Set the media view.
            adView.setMediaView(mediaView);

            // Set other ad assets.
            adView.setHeadlineView(adView.findViewById(R.id.ad_headline));
            adView.setBodyView(adView.findViewById(R.id.ad_body));
            adView.setCallToActionView(adView.findViewById(R.id.ad_call_to_action));
            adView.setAdvertiserView(adView.findViewById(R.id.ad_advertiser));
            adView.setStarRatingView(adView.findViewById(R.id.ad_stars));

            ImageView imageView = adView.findViewById(R.id.ad_app_icon);
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
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

            if (nativeAd.getStarRating() == null) {
                adView.getStarRatingView().setVisibility(View.INVISIBLE);
            } else {
                ((RatingBar) adView.getStarRatingView())
                        .setRating(nativeAd.getStarRating().floatValue());
                adView.getStarRatingView().setVisibility(View.VISIBLE);
            }

            if (nativeAd.getAdvertiser() == null) {
                adView.getAdvertiserView().setVisibility(View.INVISIBLE);
            } else {
                ((TextView) adView.getAdvertiserView()).setText(nativeAd.getAdvertiser());
                adView.getAdvertiserView().setVisibility(View.VISIBLE);
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

    }

    public static class MisesServiceViewHolder extends RecyclerView.ViewHolder {
        protected LinearLayout toggleLayout;
        protected LinearLayout moreLayout;
        protected ImageView toggleImage;
        protected TextView titleView;
        protected TextView moreView;
        protected FrameLayout tilesLayout;
        protected View view;
        protected TabCreator mTabCreator;
        MisesServiceViewHolder(View itemView, Context ctx) {
            super(itemView);
            toggleImage = (ImageView)itemView.findViewById(R.id.iv_title);
            toggleLayout = (LinearLayout)itemView.findViewById(R.id.ll_toggle);
            moreLayout = (LinearLayout)itemView.findViewById(R.id.ll_more);
            titleView= (TextView)itemView.findViewById(R.id.tv_title);
            moreView = (TextView)itemView.findViewById(R.id.tv_more);
            tilesLayout = (FrameLayout)itemView.findViewById(R.id.fl_tiles);
            view = itemView;
            if (ctx instanceof TabCreatorManager) {
                TabCreatorManager tabCreatorManager = (TabCreatorManager)ctx;
                mTabCreator = tabCreatorManager.getTabCreator(false);;
            }
        }
        public View getView() {
            return view;
        }
        public void update(boolean enabled) {
            titleView.setText("Mises Features");
            moreView.setText("");
            if (enabled) {
                toggleImage.setRotation(180);
                tilesLayout.setVisibility(View.VISIBLE);
            } else {
                toggleImage.setRotation(0);
                tilesLayout.setVisibility(View.GONE);
            }
            moreLayout.setVisibility(View.GONE);
            toggleLayout.setOnClickListener(view -> {
                SharedPreferencesManager.getInstance().writeBooleanUnchecked(
                        PREF_SHOW_MISES_SERVICE, !enabled);
                MisesSysUtils.logEvent("ntp_box_expand", "step", !enabled ? "service_off" : "service_on");
            }); 

            
        }
    }

    public static class Web3SiteViewHolder extends MisesServiceViewHolder {
        Web3SiteViewHolder(View itemView, Context ctx) {
            super(itemView, ctx);
        }
        @Override
        public void update(boolean enabled) {
            titleView.setText("Web3 Sites");
            moreView.setText("View all");
            if (enabled) {
                toggleImage.setRotation(180);
                tilesLayout.setVisibility(View.VISIBLE);
            } else {
                toggleImage.setRotation(0);
                tilesLayout.setVisibility(View.GONE);
            }
            moreLayout.setVisibility(View.VISIBLE);
            moreLayout.setOnClickListener(view -> {
                final String url = "https://web3.mises.site/";
                if (mTabCreator != null) {
                    mTabCreator.launchUrl(url, TabLaunchType.FROM_LINK);
                }
                MisesSysUtils.logEvent("ntp_open_web3_site", "url", url);
                
            }); 
            toggleLayout.setOnClickListener(view -> {
                SharedPreferencesManager.getInstance().writeBooleanUnchecked(
                        PREF_SHOW_WEB3_SITE, !enabled);
                MisesSysUtils.logEvent("ntp_box_expand", "step", !enabled ? "site_off" : "site_on");
            }); 
        }
    }


    public static class Web3ExtensionViewHolder extends MisesServiceViewHolder {
        Web3ExtensionViewHolder(View itemView, Context ctx) {
            super(itemView, ctx);
        }
        @Override
        public void update(boolean enabled) {
            titleView.setText("Extensions");
            moreView.setText("More");
            if (enabled) {
                toggleImage.setRotation(180);
                tilesLayout.setVisibility(View.VISIBLE);
            } else {
                toggleImage.setRotation(0);
                tilesLayout.setVisibility(View.GONE);
            }
            moreLayout.setVisibility(View.VISIBLE);
            moreLayout.setOnClickListener(view -> {
                final String url = "https://web3.mises.site/extensions";
                if (mTabCreator != null) {
                    mTabCreator.launchUrl(url, TabLaunchType.FROM_LINK);
                }
                
                MisesSysUtils.logEvent("ntp_open_web3_site", "url", url);

            }); 
            toggleLayout.setOnClickListener(view -> {
                SharedPreferencesManager.getInstance().writeBooleanUnchecked(
                        PREF_SHOW_WEB3_EXTENSION, !enabled);
                MisesSysUtils.logEvent("ntp_box_expand", "step", !enabled ? "extension_off" : "extension_on");
            }); 
        }
    }

}
