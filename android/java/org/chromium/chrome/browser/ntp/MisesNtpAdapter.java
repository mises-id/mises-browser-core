/* Copyright (c) 2022 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at https://mozilla.org/MPL/2.0/. */

package org.chromium.chrome.browser.ntp;

import static org.chromium.ui.base.ViewUtils.dpToPx;


import android.text.TextUtils;
import android.app.Activity;
import android.content.Context;
import android.content.SharedPreferences;
import android.content.res.ColorStateList;
import android.graphics.Bitmap;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
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
import android.widget.RelativeLayout;



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
import org.chromium.chrome.browser.profiles.Profile;
import org.chromium.components.user_prefs.UserPrefs;
import org.chromium.chrome.browser.tabmodel.TabCreatorManager;
import org.chromium.chrome.browser.tabmodel.TabCreator;
import org.chromium.chrome.browser.tab.TabLaunchType;

import org.chromium.chrome.browser.preferences.PrefChangeRegistrar;
import org.chromium.chrome.browser.preferences.PrefChangeRegistrar.PrefObserver;

import com.openmediation.sdk.nativead.AdIconView;
import com.openmediation.sdk.nativead.AdInfo;
import com.openmediation.sdk.nativead.MediaView;
import com.openmediation.sdk.nativead.NativeAd;
import com.openmediation.sdk.nativead.NativeAdListener;
import com.openmediation.sdk.nativead.NativeAdView;
import com.openmediation.sdk.utils.error.Error;

import com.github.islamkhsh.CardSliderViewPager;
import com.github.islamkhsh.CardSliderIndicator;

import org.chromium.base.MisesAdsUtil;
import org.chromium.base.MisesSysUtils;
import org.chromium.components.user_prefs.UserPrefs;

import java.util.HashSet;
import java.util.Set;
import java.util.List;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.concurrent.CopyOnWriteArrayList;

public class MisesNtpAdapter extends RecyclerView.Adapter<RecyclerView.ViewHolder> implements PrefObserver{
    private Activity mActivity;
    private RequestManager mGlide;
    private View mMvTilesContainerLayout;
    private View mMisesServiceTilesContainerLayout;
    private View mWeb3SiteTilesContainerLayout;
    private View mWeb3ExtensionTilesContainerLayout;
    private View mCarouselAdContainerLayout;
    private View mMisesSearchContainerLayout;

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

    private List<CarouselAdapter.CarouselAdInfo> mData;

    private static int TYPE_MISES_SERVICE = 1;
    private static int TYPE_WEB3_SITE = 2;
    private static int TYPE_WEB3_EXTENSION = 3;
    private static int TYPE_TOP_SITES = 4;
    private static int TYPE_CAROUSEL_AD = 5;
    private static int TYPE_MISES_SEARCH = 6;

    private static final int ONE_ITEM_SPACE = 1;
    private static final int TWO_ITEMS_SPACE = 2;
    private static final String TAG = "MisesNtpAdapter";

    public static final String PREF_SHOW_MISES_SERVICE = "show_mises_service";
    public static final String PREF_SHOW_WEB3_SITE = "show_web3_site";
    public static final String PREF_SHOW_WEB3_EXTENSION = "show_web3_extension";

    private Handler mHandler = new Handler(Looper.getMainLooper());
    private List<String> mCarouselPlacmentIds;
    private Set<String> mLoadedPlacmentIds;

    private SharedPreferences.OnSharedPreferenceChangeListener mPreferenceListener;

    public MisesNtpAdapter(Activity activity, OnMisesNtpListener onMisesNtpListener,
            RequestManager glide, 
            View mvTilesContainerLayout, 
            View misesServiceTilesContainerLayout,
            View web3SiteTilesContainerLayout,
            View web3ExtensionTilesContainerLayout,
            View carouselAdContainerLayout,
            View misesSearchContainerLayout,
            int recyclerViewHeight, boolean isTopSitesEnabled) {
        
        Log.d(TAG, "MisesNtpAdapter()");
        mActivity = activity;
        mOnMisesNtpListener = onMisesNtpListener;
        mGlide = glide;
        mMvTilesContainerLayout = mvTilesContainerLayout;
        mMisesServiceTilesContainerLayout = misesServiceTilesContainerLayout;
        mWeb3SiteTilesContainerLayout = web3SiteTilesContainerLayout;
        mWeb3ExtensionTilesContainerLayout = web3ExtensionTilesContainerLayout;
        mCarouselAdContainerLayout = carouselAdContainerLayout;
        mMisesSearchContainerLayout = misesSearchContainerLayout;
        mRecyclerViewHeight = recyclerViewHeight;
        mIsTopSitesEnabled = isTopSitesEnabled;
        mIsMisesServiceEnabled = shouldDisplayMisesService();
        mIsWeb3SiteEnabled = shouldDisplayWeb3Site();
        mIsWeb3ExtensionEnabled = shouldDisplayWeb3Extension();

        initPreferenceObserver();

        mData = new ArrayList<>();
        mCarouselPlacmentIds = new ArrayList<>();
        mLoadedPlacmentIds = new HashSet<>();
        maybeInitCarouselAd();

        
        
       
    }
    private void maybeInitCarouselAd() {
        if (MisesAdsUtil.getInstance().isInitSucess()) {
            mCarouselPlacmentIds = NativeAd.getCachedPlacementIds("carousel");
            loadNativeAd();
        } else {
            mHandler.postDelayed( () -> {
                maybeInitCarouselAd();
            }, 200);
        }

    }


    private final NativeAdListener mNativeAdListener = new NativeAdListener() {
        @Override
        public void onNativeAdLoaded(String placementId, AdInfo info) {
            Log.d(TAG, "onNativeAdLoaded, placementId: " + placementId + ", AdInfo : " + info);
            if (!mLoadedPlacmentIds.contains(placementId)) {
                loadSuccess(new CarouselAdapter.CarouselAdInfo(placementId, info));
            }
            mLoadedPlacmentIds.add(placementId);
        }

        @Override
        public void onNativeAdLoadFailed(String placementId, Error error) {
            Log.d(TAG, "onNativeAdLoadFailed, placementId: " + placementId + ", error : " + error);
        }

        @Override
        public void onNativeAdImpression(String placementId, AdInfo info) {
            Log.d(TAG, "onNativeAdImpression, placementId: " + placementId + ", info : " + info);
        }

        @Override
        public void onNativeAdClicked(String placementId, AdInfo info) {
            Log.d(TAG, "onNativeAdClicked, placementId: " + placementId + ", info : " + info);
        }
    };


    private void loadSuccess(CarouselAdapter.CarouselAdInfo info) {
        Log.d(TAG, "loadSuccess");
        if (info != null) {
            mData.add(info);
            Collections.sort(mData, new Comparator<CarouselAdapter.CarouselAdInfo>() {

                private int strToInt(final String myString) {
                    int ret = 0;
                    try {
                        ret = Integer.parseInt(myString);
                    }
                    catch (NumberFormatException e) {

                    }
                    return ret;
                }
                @Override
                public int compare(CarouselAdapter.CarouselAdInfo o1, CarouselAdapter.CarouselAdInfo o2) {
                    // TODO Auto-generated method stub
                    return Integer.compare(strToInt(o1.mPlacementId) , strToInt(o2.mPlacementId));
                }
            });
            notifyItemChanged(0);
        }
        
    }

    public static int getViewHeight(View view) {
        view.measure(View.MeasureSpec.UNSPECIFIED, View.MeasureSpec.UNSPECIFIED);
        return view.getMeasuredHeight();
    }

    @Override
    public void onBindViewHolder(@NonNull RecyclerView.ViewHolder holder, int position) {
        Log.v(TAG, "onBindViewHolder");
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


        } else if (holder instanceof CarouselAdViewHolder) {
            Log.v(TAG, "updating CarouselAdViewHolder");
            LinearLayout.LayoutParams adsLayoutParams = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT);
            CarouselAdViewHolder carouselAdViewHolder = (CarouselAdViewHolder) holder;
            mCarouselAdContainerLayout.setLayoutParams(adsLayoutParams);
            mCarouselAdContainerLayout.setBackgroundResource(background);
            carouselAdViewHolder.update(mData.size());


        } else if (holder instanceof MisesSearchViewHolder) {
            Log.v(TAG, "updating MisesSearchViewHolder");
            MisesSearchViewHolder misesSearchViewHolder = (MisesSearchViewHolder) holder;
            mMisesSearchContainerLayout.setLayoutParams(layoutParams);

            misesSearchViewHolder.searchView.setOnClickListener(view -> {
                mOnMisesNtpListener.focusSearchBox();
                MisesSysUtils.logEvent("ntp_box_search", "step", "click");
            }); 


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
        else if (viewType == TYPE_CAROUSEL_AD) {
            return new CarouselAdViewHolder(mCarouselAdContainerLayout, mData, mHandler);
        }
        else if (viewType == TYPE_MISES_SEARCH) {
            return new MisesSearchViewHolder(mMisesSearchContainerLayout, mActivity);
        }
        return new TopSitesViewHolder(mMvTilesContainerLayout);
    }

    private void loadNativeAd() {
        Log.d(TAG, "loadNativeAd");

        addNativeAdListener();

        for (final String placementId : mCarouselPlacmentIds) {
            if (mLoadedPlacmentIds.contains(placementId)) {
                continue;
            }
            // for TikTok and TencentAd in China traffic
            NativeAd.setDisplayParams(placementId, 320, 0);
            NativeAd.loadAd(placementId);
        }
    }
    private void addNativeAdListener() {
        for (final String placementId : mCarouselPlacmentIds) {
            NativeAd.addAdListener(placementId, mNativeAdListener);
        }
    }
    private void removeNativeAdListener() {
        for (final String placementId : mCarouselPlacmentIds) {
            NativeAd.removeAdListener(placementId, mNativeAdListener);
        }
    }

    public void onAttached() {
        Log.d(TAG, "onAttached");
        loadNativeAd();
    }
    public void onDetached() {
        Log.d(TAG, "onDetached");
        removeNativeAdListener();
    }
    public void onDestroy() {
        Log.d(TAG, "onDestroy");
        removeNativeAdListener();

        boolean need_notify = false;
        for (CarouselAdapter.CarouselAdInfo info : mData) {
            if (info != null) {
                NativeAd.destroy(info.mPlacementId, info.mAdInfo);
            }
        }
        mHandler.removeCallbacksAndMessages(null);
        mData.clear();

        // Removes preference listener.
        ContextUtils.getAppSharedPreferences()
                .unregisterOnSharedPreferenceChangeListener(mPreferenceListener);
        mPreferenceListener = null;
        
    }

    @Override
    public int getItemViewType(int position) {
        if (position == 1) {
            return TYPE_MISES_SERVICE;
        } else if (position == 2) {
            return TYPE_WEB3_SITE;
        } else if (position == 3) {
            return TYPE_WEB3_EXTENSION;
        } else if (position == 4) {
            return TYPE_TOP_SITES;
        }

        return TYPE_CAROUSEL_AD;
    }

    public int getTopSitesCount() {
        return mIsTopSitesEnabled ? 4 : 0;
    }
    public void notifySiteChanged() {
        notifyItemRangeChanged(ONE_ITEM_SPACE, getTopSitesCount() + ONE_ITEM_SPACE);
    }

    public void setTopSitesEnabled(boolean isTopSitesEnabled) {
        if (mIsTopSitesEnabled != isTopSitesEnabled) {
            mIsTopSitesEnabled = isTopSitesEnabled;
            notifySiteChanged();
        }
    }

    public void setMisesServiceEnabled(boolean enabled) {
        Log.v(TAG, "setMisesServiceEnabled " + enabled);
        if (mIsMisesServiceEnabled != enabled) {
            mIsMisesServiceEnabled = enabled;
            notifySiteChanged();
        }
    }
    public void setWeb3SiteEnabled(boolean enabled) {
        Log.v(TAG, "setWeb3SiteEnabled " + enabled);
        if (mIsWeb3SiteEnabled != enabled) {
            mIsWeb3SiteEnabled = enabled;
            notifySiteChanged();
        }
    }
    public void setWeb3ExtensionEnabled(boolean enabled) {
        Log.v(TAG, "setWeb3ExtensionEnabled " + enabled);
        if (mIsWeb3ExtensionEnabled != enabled) {
            mIsWeb3ExtensionEnabled = enabled;
            notifySiteChanged();
        }
    }



    public void setRecyclerViewHeight(int recyclerViewHeight) {
        mRecyclerViewHeight = recyclerViewHeight;
        notifySiteChanged();
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

    @Override
    public void onPreferenceChange() {
        setMisesServiceEnabled(shouldDisplayMisesService());
        setWeb3SiteEnabled(shouldDisplayWeb3Site());
        setWeb3ExtensionEnabled(shouldDisplayWeb3Extension());
    }

    private void initPreferenceObserver() {
        mPreferenceListener = (prefs, key) -> {
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
        if (mPreferenceListener != null) {
            ContextUtils.getAppSharedPreferences()
                    .registerOnSharedPreferenceChangeListener(mPreferenceListener);
        }
    }

    public static class TopSitesViewHolder extends RecyclerView.ViewHolder {
        TopSitesViewHolder(View itemView) {
            super(itemView);
        }
    }
    
    public static class CarouselAdViewHolder extends RecyclerView.ViewHolder {
        private LinearLayout itemContainView;
        private Context mContext;
        private CardSliderIndicator mIndicator;

        private CarouselAdapter mAdapter;
        private boolean mEnabled;
        private Handler mHandler;
        


        public CarouselAdViewHolder(View itemView, List<CarouselAdapter.CarouselAdInfo> data, Handler handler) {
            super(itemView);
            mContext = itemView.getContext();
            itemContainView = itemView.findViewById(R.id.carousel_container);
            
            
            mAdapter = new CarouselAdapter(mContext, data);
            mEnabled = false;
            this.mHandler = handler;

        }

        public void update(int adCount) {
            Log.v(TAG, "CarouselAdViewHolder update " + adCount);
            if (adCount > 0 && !mEnabled) {
                View adView  = LayoutInflater.from(mContext).inflate(R.layout.carousel_ad_view, null);
                RelativeLayout.LayoutParams layoutParams = new RelativeLayout.LayoutParams(
                            RelativeLayout.LayoutParams.WRAP_CONTENT, RelativeLayout.LayoutParams.WRAP_CONTENT);
                itemContainView.addView(adView, layoutParams);

                CardSliderViewPager viewPager = (CardSliderViewPager) adView.findViewById(R.id.viewPager);
                viewPager.setAutoSlideTime(6);
                viewPager.setSliderPageMargin(6);
                viewPager.setOtherPagesWidth(12);
                viewPager.setSmallScaleFactor(0.9f);
                viewPager.setSmallAlphaFactor(0.5f);
                viewPager.setAdapter(mAdapter);
                mIndicator = (CardSliderIndicator) adView.findViewById(R.id.indicator);
                mIndicator.setViewPager(viewPager);
                
                mEnabled = true;
            }

            if (mIndicator != null) {
                if (adCount > 1) {
                    mIndicator.setVisibility(View.VISIBLE);
                } else {
                    mIndicator.setVisibility(View.INVISIBLE);
                }
            }
            

            mAdapter.notifyDataSetChanged();
            
        }
    }


    public static class MisesSearchViewHolder extends RecyclerView.ViewHolder {
        private Context mContext;

        public View searchView;
        public MisesSearchViewHolder(View itemView, Context ctx) {
            super(itemView);
            mContext = itemView.getContext();

            searchView = itemView.findViewById(R.id.mises_search_box_text);
        }
    }

    private static void writeBooleanUnchecked(final String prefKey, boolean value) {
        SharedPreferences.Editor sharedPreferencesEditor =
                ContextUtils.getAppSharedPreferences().edit();
        sharedPreferencesEditor.putBoolean(prefKey, value);
        sharedPreferencesEditor.apply();
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
                writeBooleanUnchecked(
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
                writeBooleanUnchecked(
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
                writeBooleanUnchecked(
                        PREF_SHOW_WEB3_EXTENSION, !enabled);
                MisesSysUtils.logEvent("ntp_box_expand", "step", !enabled ? "extension_off" : "extension_on");
            }); 
        }
    }

}
