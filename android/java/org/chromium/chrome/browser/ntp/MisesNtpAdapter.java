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
import android.graphics.drawable.Drawable;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.text.Spannable;
import android.text.SpannableStringBuilder;
import android.util.Pair;
import android.view.animation.AnimationUtils;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewGroup.LayoutParams;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Button;
import android.widget.RatingBar;
import android.widget.RelativeLayout;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.widget.ImageViewCompat;
import androidx.recyclerview.widget.RecyclerView;
import androidx.recyclerview.widget.LinearLayoutManager;

import com.bumptech.glide.RequestManager;
import com.google.android.material.floatingactionbutton.FloatingActionButton;

import org.chromium.base.ContextUtils;
import org.chromium.base.Log;
import org.chromium.base.task.PostTask;
import org.chromium.base.Callback;
import org.chromium.chrome.R;
import org.chromium.chrome.browser.night_mode.GlobalNightModeStateProviderHolder;
import org.chromium.chrome.browser.ntp.NewsFlowService;
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

import com.bumptech.glide.Glide;
import com.bumptech.glide.request.RequestListener;
import com.bumptech.glide.request.RequestOptions;
import com.bumptech.glide.load.DataSource;
import com.bumptech.glide.load.engine.GlideException;
import com.bumptech.glide.request.target.Target;
import com.bumptech.glide.load.resource.bitmap.RoundedCorners;
import com.bumptech.glide.load.resource.bitmap.CenterCrop;

import com.github.islamkhsh.CardSliderViewPager;
import com.github.islamkhsh.CardSliderIndicator;

import org.chromium.base.MisesAdsUtil;
import org.chromium.base.MisesSysUtils;
import org.chromium.components.user_prefs.UserPrefs;

import java.lang.Math;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;
import java.util.List;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.Locale;

// import javax.sql.DataSource;

public class MisesNtpAdapter extends RecyclerView.Adapter<RecyclerView.ViewHolder> implements PrefObserver{

    private Activity mActivity;
    private TabCreator mTabCreator;
    private RequestManager mGlide;
    private View mMvTilesContainerLayout;
    private View mMisesServiceTilesContainerLayout;
    private View mWeb3SiteTilesContainerLayout;
    private View mWeb3ExtensionTilesContainerLayout;
    private View mShortcutTilesContainerLayout;
    private View mNewsFlowListControlPanelLayout;
    private View mLoadMoreLayout;
    private View mCarouselAdContainerLayout;
    private View mMisesSearchContainerLayout;

    private OnMisesNtpListener mOnMisesNtpListener;
    private boolean mIsTopSitesEnabled;
    private boolean mIsMisesServiceEnabled;
    private boolean mIsWeb3SiteEnabled;
    private boolean mIsWeb3ExtensionEnabled;
    private boolean mIsShortcutEnabled;
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
    private static int TYPE_NEWS_FLOW_LIST_CONTROL_PANEL = 7;
    private static int TYPE_NEWS_FLOW_LIST_ITEM = 8;
    private static int TYPE_SHORTCUT = 9;
    private static int TYPE_LOADMORE = 10;

    private List<Integer> mTopItemViewTypes;

    private static final int ONE_ITEM_SPACE = 1;
    private static final int TWO_ITEMS_SPACE = 2;
    private static final String TAG = "MisesNtpAdapter";

    public static final String PREF_SHOW_MISES_SERVICE = "show_mises_service";
    public static final String PREF_SHOW_WEB3_SITE = "show_web3_site";
    public static final String PREF_SHOW_WEB3_EXTENSION = "show_web3_extension";
    public static final String PREF_SHOW_SHORTCUT = "show_shortcut";

    private Handler mHandler = new Handler(Looper.getMainLooper());
    private List<String> mCarouselPlacmentIds;
    private Set<String> mLoadedPlacmentIds;

    private SharedPreferences.OnSharedPreferenceChangeListener mPreferenceListener;

    private NewsFlowService mNewsFlowService;
    private boolean mIsRefreshingNewsFlow;
    private boolean mIsInitializingNewsCache;
    private MoreStatus mMoreStatus;

    private LinearLayoutManager mLayoutManager;
    private RecyclerView mRecyclerView;

    public MisesNtpAdapter(Activity activity, OnMisesNtpListener onMisesNtpListener,
            RequestManager glide, 
            View mvTilesContainerLayout, 
            View misesServiceTilesContainerLayout,
            View web3SiteTilesContainerLayout,
            View web3ExtensionTilesContainerLayout,
            View shortcutTilesContainerLayout,
            View newsFlowListControlPanelLayout,
            View loadMoreLayout,
            View carouselAdContainerLayout,
            View misesSearchContainerLayout,
            int recyclerViewHeight, boolean isTopSitesEnabled) {
        
        Log.d(TAG, "MisesNtpAdapter()");
        mActivity = activity;
        mOnMisesNtpListener = onMisesNtpListener;
        mGlide = glide;

        mTopItemViewTypes = new ArrayList<>();
        mTopItemViewTypes.add(TYPE_MISES_SEARCH);
        mTopItemViewTypes.add(TYPE_SHORTCUT);
        mTopItemViewTypes.add(TYPE_TOP_SITES);
        mTopItemViewTypes.add(TYPE_CAROUSEL_AD);
        mTopItemViewTypes.add(TYPE_NEWS_FLOW_LIST_CONTROL_PANEL);

        mMvTilesContainerLayout = mvTilesContainerLayout;
        mMisesServiceTilesContainerLayout = misesServiceTilesContainerLayout;
        mWeb3SiteTilesContainerLayout = web3SiteTilesContainerLayout;
        mWeb3ExtensionTilesContainerLayout = web3ExtensionTilesContainerLayout;
        mShortcutTilesContainerLayout = shortcutTilesContainerLayout;
        mNewsFlowListControlPanelLayout = newsFlowListControlPanelLayout;
        mLoadMoreLayout = loadMoreLayout;
        mCarouselAdContainerLayout = carouselAdContainerLayout;
        mMisesSearchContainerLayout = misesSearchContainerLayout;
        mRecyclerViewHeight = recyclerViewHeight;
        mIsTopSitesEnabled = isTopSitesEnabled;
        mIsMisesServiceEnabled = shouldDisplayMisesService();
        mIsWeb3SiteEnabled = shouldDisplayWeb3Site();
        mIsWeb3ExtensionEnabled = shouldDisplayWeb3Extension();
        mIsShortcutEnabled = shouldDisplayShortcut();

        mNewsFlowService = new NewsFlowService();
        mIsRefreshingNewsFlow = false;
        mIsInitializingNewsCache = false;
        mMoreStatus = MoreStatus.Idle;

        if (mActivity instanceof TabCreatorManager) {
            TabCreatorManager tabCreatorManager = (TabCreatorManager)mActivity;
            mTabCreator = tabCreatorManager.getTabCreator(false);;
        }

        initPreferenceObserver();

        mData = new ArrayList<>();
        mCarouselPlacmentIds = new ArrayList<>();
        mLoadedPlacmentIds = new HashSet<>();
        maybeInitCarouselAd();

        initNewsFlowListControlPanel();
    }

    private void initNewsFlowListControlPanel() {
        androidx.appcompat.widget.AppCompatImageButton btnRefresh = mNewsFlowListControlPanelLayout.findViewById(R.id.btn_refresh);
        btnRefresh.setOnClickListener(new View.OnClickListener() {
            @Override public void onClick(View v) {
                Log.v(TAG, "click refresh btn, do refreshNews");
                MisesSysUtils.logEvent("ntp_news_flow", "step", "click_refresh");
                refreshNews();
            }
        });

        Button btnLoadMore = mLoadMoreLayout.findViewById(R.id.btn_load_more);
        btnLoadMore.setOnClickListener(new View.OnClickListener() {

            @Override public void onClick(View v) {
                Log.v(TAG, "click load more btn, do loadMoreNews");
                MisesSysUtils.logEvent("ntp_news_flow", "step", "click_loadmore");
                loadMoreNews();
            }
        });
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
            notifyItemChanged(3);
        }
    }

    public static int getViewHeight(View view) {
        view.measure(View.MeasureSpec.UNSPECIFIED, View.MeasureSpec.UNSPECIFIED);
        return view.getMeasuredHeight();
    }

    @Override
    public void onBindViewHolder(@NonNull RecyclerView.ViewHolder holder, int position) {
        // Log.v(TAG, "onBindViewHolder");
        LinearLayout.LayoutParams layoutParams = new LinearLayout.LayoutParams(
        LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT);
        int margin = dpToPx(mActivity, 10);
        layoutParams.setMargins(0, margin, 0, 0);
        int background = GlobalNightModeStateProviderHolder.getInstance().isInNightMode()?
            R.drawable.rounded_dark_bg_alpha : R.drawable.rounded_light_bg_alpha;
        if (holder instanceof TopSitesViewHolder) {

            LinearLayout.LayoutParams topSitesLayoutParams = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT);
            mMvTilesContainerLayout.setLayoutParams(topSitesLayoutParams);
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

        } else if (holder instanceof ShortcutViewHolder) {
            // Shortcut View Holder
            LinearLayout.LayoutParams shortcutLayoutParams = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT);
            ShortcutViewHolder shortcutHolder = (ShortcutViewHolder) holder;
            shortcutHolder.getView().setLayoutParams(shortcutLayoutParams);
            shortcutHolder.getView().setBackgroundResource(background);

        } else if (holder instanceof CarouselAdViewHolder) {

            Log.v(TAG, "updating CarouselAdViewHolder");
            LinearLayout.LayoutParams adsLayoutParams = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT);
            adsLayoutParams.setMargins(0, margin, 0, 0);
            CarouselAdViewHolder carouselAdViewHolder = (CarouselAdViewHolder) holder;
            mCarouselAdContainerLayout.setLayoutParams(adsLayoutParams);
            mCarouselAdContainerLayout.setBackgroundResource(background);
            carouselAdViewHolder.update(mData.size());

        } else if (holder instanceof MisesSearchViewHolder) {

            Log.v(TAG, "updating MisesSearchViewHolder");
            MisesSearchViewHolder misesSearchViewHolder = (MisesSearchViewHolder) holder;
            // mMisesSearchContainerLayout.setLayoutParams(layoutParams);

            misesSearchViewHolder.searchView.setOnClickListener(view -> {
                mOnMisesNtpListener.focusSearchBox();
                MisesSysUtils.logEvent("ntp_box_search", "step", "click");
            }); 

        } else if (holder instanceof NewsFlowControlPanelViewHolder) {
            Log.v(TAG, "updating NewsFlowControlPanelViewHolder");
            // NewsFlowControlPanelViewHolder vh = (NewsFlowControlPanelViewHolder) holder;
            // mNewsFlowListControlPanelLayout.setLayoutParams(layoutParams);

        } else if (holder instanceof NewsFlowItemViewHolder) {
            Log.v(TAG, "updating NewsFlowItemViewHolder");
            NewsFlowItemViewHolder vh = (NewsFlowItemViewHolder) holder;

            News news = mNewsFlowService.newsAtIndex(position - mTopItemViewTypes.size());
            vh.setNews(news);
            vh.itemView.setOnClickListener(new View.OnClickListener() {
                @Override public void onClick(View v) {
                    Log.d(TAG, String.format(Locale.getDefault(), "click news: link=%s", news.link));
                    MisesSysUtils.logEvent("ntp_news_flow_open", "url", MisesSysUtils.shortenUrl(news.link));
                    if (mTabCreator != null) {
                        mTabCreator.launchUrl(news.link, TabLaunchType.FROM_LINK);
                    }
                }
            });

        } else if (holder instanceof LoadMoreViewHolder) {

            Log.v(TAG, "updating LoadMoreViewHolder");

        } else if (holder instanceof MisesServiceViewHolder) {

            MisesServiceViewHolder misesServiceHolder = (MisesServiceViewHolder) holder;
            misesServiceHolder.update(mIsMisesServiceEnabled);

            misesServiceHolder.getView().setLayoutParams(layoutParams);
            misesServiceHolder.getView().setBackgroundResource(background);

        }
    }

    private void refreshAllPublishedAtInVisibleNewsFlowItems() {
        if (mLayoutManager == null || mRecyclerView == null) {
            return;
        }

        int first = mLayoutManager.findFirstVisibleItemPosition();
        int last = mLayoutManager.findLastVisibleItemPosition();
        for (int i = first; i <= last; i ++) {
            RecyclerView.ViewHolder viewHolder = mRecyclerView.findViewHolderForAdapterPosition(i);
            if (viewHolder instanceof NewsFlowItemViewHolder) {
                NewsFlowItemViewHolder vh = (NewsFlowItemViewHolder) viewHolder;
                vh.refreshPublishedAt();
            }
        }
    }

    @Override
    public int getItemCount() {
        // return getTopSitesCount() + ONE_ITEM_SPACE;
        // return 6;
        return mTopItemViewTypes.size() + mNewsFlowService.numOfNews() + 1;
    }

    @NonNull
    @Override
    public RecyclerView.ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View view;
        if (viewType == TYPE_CAROUSEL_AD) {
            return new CarouselAdViewHolder(mCarouselAdContainerLayout, mData, mHandler);
        } else if (viewType == TYPE_MISES_SERVICE) {
            return new MisesServiceViewHolder(mMisesServiceTilesContainerLayout, mActivity);
        } else if (viewType == TYPE_WEB3_SITE) {
            return new Web3SiteViewHolder(mWeb3SiteTilesContainerLayout, mActivity);
        } else if (viewType == TYPE_WEB3_EXTENSION) {
            return new Web3ExtensionViewHolder(mWeb3ExtensionTilesContainerLayout, mActivity);
        } else if (viewType == TYPE_SHORTCUT) {
            return new ShortcutViewHolder(mShortcutTilesContainerLayout, mActivity);
        } else if (viewType == TYPE_NEWS_FLOW_LIST_CONTROL_PANEL) {
            return new NewsFlowControlPanelViewHolder(mNewsFlowListControlPanelLayout, mActivity);
        } else if (viewType == TYPE_NEWS_FLOW_LIST_ITEM) {
            View itemView = (ViewGroup) LayoutInflater.from(mActivity)
            .inflate(R.layout.mises_news_flow_list_item, parent, false);
            return new NewsFlowItemViewHolder(itemView, mActivity);
        } else if (viewType == TYPE_MISES_SEARCH) {
            return new MisesSearchViewHolder(mMisesSearchContainerLayout, mActivity);
        } else if (viewType == TYPE_LOADMORE) {
            return new LoadMoreViewHolder(mLoadMoreLayout, mActivity);
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
            NativeAd.setDisplayParams(placementId, 320, 160);// heigh == 0 will switch to native banner
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
        Log.d(TAG, "onAttached: view="+this.mRecyclerView);
        loadNativeAd();

        // recyclerView添加到屏幕，从缓存中加载数据
        // tab页切换到前台时触发这个操作
        // 加载好缓存之后触发刷新操作
        mIsInitializingNewsCache = true;
        loadNewsFromCache(() -> {
            // 判断上次更新已过去多久，如果大于1分钟，则触发刷新操作
            Date latestRefreshTime = mNewsFlowService.latestRefreshTime();
            Date now = new Date();
            if (latestRefreshTime == null) {
                Log.d(TAG, "latestRefreshTime is null");
            } else {
                Log.d(TAG, "latestRefreshTime offset="+((now.getTime() - latestRefreshTime.getTime()) / 1000));
            }
            if (latestRefreshTime == null || (now.getTime() - latestRefreshTime.getTime()) / 1000 > 60 * 1) {
                this.mHandler.post(() -> {
                    Log.v(TAG, "refreshNews after loadNewsFromCache in onAttached");
                    refreshNews();
                });
            }
            mIsInitializingNewsCache = false;
        });
    }

    @Override
    public void onAttachedToRecyclerView(@NonNull RecyclerView recyclerView) {
        Log.v(TAG, "onAttachedToRecyclerView: view="+recyclerView);

        RecyclerView.LayoutManager layoutManager = recyclerView.getLayoutManager();
        if (layoutManager instanceof LinearLayoutManager) {
            mLayoutManager = (LinearLayoutManager)layoutManager;
        }
        mRecyclerView = recyclerView;

        // recyclerView刚初始化完成，从缓存中加载数据
        // recyclerView第一次被创建时触发这个操作
        mIsInitializingNewsCache = true;
        loadNewsFromCache(() -> {
            // 判断上次更新已过去多久，如果大于1分钟，则触发刷新操作
            Date latestRefreshTime = mNewsFlowService.latestRefreshTime();
            Date now = new Date();
            if (latestRefreshTime == null) {
                Log.d(TAG, "latestRefreshTime is null");
            } else {
                Log.d(TAG, "latestRefreshTime offset="+((now.getTime() - latestRefreshTime.getTime()) / 1000));
            }
            if (latestRefreshTime == null || (now.getTime() - latestRefreshTime.getTime()) / 1000 > 60 * 1) {
                this.mHandler.post(() -> {
                    Log.v(TAG, "refreshNews after loadNewsFromCache in onAttachedToRecyclerView");
                    refreshNews();
                });
            }
            mIsInitializingNewsCache = false;
        });
    }

    private void loadNewsFromCache(Runnable completionHandler) {
        // markMoreStatus(MoreStatus.Idle);
        mNewsFlowService.loadFromCache(new Callback<NewsFlowService.RefreshResponse>() {
            @Override
            public final void onResult(NewsFlowService.RefreshResponse resp) {
                handleNewsUpdate(resp.action);
                if (completionHandler != null) {
                    completionHandler.run();
                }
            }
        });
    }

    public void onSwitchToForeground() {
        Log.v(TAG, "onSwitchToForeground");

    }

    private void handleNewsUpdate(NewsFlowService.UpdateAction action) {
        int start;
        switch (action.mode) {
            case NOP:
                break;
            case INSERTED:
                start = mTopItemViewTypes.size() + action.range.start;
                notifyItemRangeInserted(start, action.range.size);
                break;
            case REMOVED:
                start = mTopItemViewTypes.size() + action.range.start;
                notifyItemRangeRemoved(start, action.range.size);
                break;
            case CHANGED:
                start = mTopItemViewTypes.size() + action.range.start;
                notifyItemRangeChanged(start, action.range.size);
                break;
            default: // RELOAD_ALL
                notifyDataSetChanged();
                return;
        }
        // 更新所有可见新闻Item的发布时间
        refreshAllPublishedAtInVisibleNewsFlowItems();
    }

    public void onDetached() {
        Log.d(TAG, "onDetached: view="+mRecyclerView);
        removeNativeAdListener();
    }

    @Override
    public void onDetachedFromRecyclerView(@NonNull RecyclerView recyclerView) {
        Log.d(TAG, "onDetachedFromRecyclerView: view="+recyclerView);
        mLayoutManager = null;
        mRecyclerView = null;
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
        if (position < mTopItemViewTypes.size()) {
            return mTopItemViewTypes.get(position);
        }
        if (position == mTopItemViewTypes.size() + mNewsFlowService.numOfNews()) {
            return TYPE_LOADMORE;
        }
        return TYPE_NEWS_FLOW_LIST_ITEM;
    }

    @Override
    public void onViewDetachedFromWindow(@NonNull RecyclerView.ViewHolder holder) {
        super.onViewDetachedFromWindow(holder);
        Log.v(TAG, "onViewDetachedFromWindow: " + holder);
    }

    @Override
    public void onViewRecycled(@NonNull RecyclerView.ViewHolder holder) {
        super.onViewRecycled(holder);
        Log.v(TAG, "onViewRecycled: " + holder);
    }

    public int getTopSitesCount() {
        return mIsTopSitesEnabled ? 6 : 0;
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

    public void setShortcutEnabled(boolean enabled) {
        Log.v(TAG, "setShortcutEnabled " + enabled);
        if (mIsShortcutEnabled != enabled) {
            mIsShortcutEnabled = enabled;
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
    public static boolean shouldDisplayShortcut() {
        return ContextUtils.getAppSharedPreferences().getBoolean(
                PREF_SHOW_SHORTCUT, true);
    }

    @Override
    public void onPreferenceChange() {
        setMisesServiceEnabled(shouldDisplayMisesService());
        setWeb3SiteEnabled(shouldDisplayWeb3Site());
        setWeb3ExtensionEnabled(shouldDisplayWeb3Extension());
        setShortcutEnabled(shouldDisplayShortcut());
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
            if (TextUtils.equals(key, PREF_SHOW_SHORTCUT)) {
                setWeb3SiteEnabled(shouldDisplayShortcut());
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
                viewPager.setSliderPageMargin(3);
                viewPager.setOtherPagesWidth(0);
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
            Log.v(TAG, "CarouselAdViewHolder update finished");
        }
    }


    public static class MisesSearchViewHolder extends RecyclerView.ViewHolder {
        private Context mContext;

        public View searchView;
        public MisesSearchViewHolder(View itemView, Context ctx) {
            super(itemView);
            mContext = itemView.getContext();

            searchView = itemView.findViewById(R.id.mises_search_box_text);
            searchView.setLongClickable(false);
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
                MisesSysUtils.logEvent("ntp_open_web3_site", "url", MisesSysUtils.shortenUrl(url));
                
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
                
                MisesSysUtils.logEvent("ntp_open_web3_site", "url", MisesSysUtils.shortenUrl(url));

            }); 
            toggleLayout.setOnClickListener(view -> {
                writeBooleanUnchecked(
                        PREF_SHOW_WEB3_EXTENSION, !enabled);
                MisesSysUtils.logEvent("ntp_box_expand", "step", !enabled ? "extension_off" : "extension_on");
            }); 
        }
    }

    public static class ShortcutViewHolder extends MisesServiceViewHolder {
        ShortcutViewHolder(View itemView, Context ctx) {
            super(itemView, ctx);
        }
    }

    public static class NewsFlowControlPanelViewHolder extends RecyclerView.ViewHolder {
        NewsFlowControlPanelViewHolder(View itemView, Context ctx) {
            super(itemView);
        }
    }

    public static class NewsFlowItemViewHolder extends RecyclerView.ViewHolder {

        Context mContext;
        TextView mtvTitle;
        ImageView mivImage;
        TextView mtvSource;
        TextView mtvPublishedAt;
        Date mDatePublishedAt;

        public NewsFlowItemViewHolder(View itemView, Context ctx) {
            super(itemView);

            mContext = ctx;
            mtvTitle = (TextView) itemView.findViewById(R.id.tv_title);
            mivImage = (ImageView) itemView.findViewById(R.id.iv_image);
            mtvSource = (TextView) itemView.findViewById(R.id.tv_source);
            mtvPublishedAt = (TextView) itemView.findViewById(R.id.tv_published_at);
        }

        static private String dateOffsetNowDesc(Date date) {
            long offset = (new Date().getTime() - date.getTime()) / 1000;
            if (offset == 0) {
                return "now";
            }

            final String suffix = offset > 0 ? "ago" : "later";
            if (offset < 60) {
                return String.format(Locale.getDefault(), "%d second%s %s", offset, offset == 1 ? "" : "s", suffix);
            }

            offset /= 60;
            if (offset < 60) {
                return String.format(Locale.getDefault(), "%d minute%s %s", offset, offset == 1 ? "" : "s", suffix);
            }

            offset /= 60;
            if (offset < 60) {
                return String.format(Locale.getDefault(), "%d hour%s %s", offset, offset == 1 ? "" : "s", suffix);
            }

            offset /= 24;
            return String.format(Locale.getDefault(), "%d day%s %s", offset, offset == 1 ? "" : "s", suffix);
        }

        public void setNews(News news) {
            mtvTitle.setText(news.title);
            mtvSource.setText(news.source);
            mtvPublishedAt.setText(
                String.format(Locale.getDefault(), "%s", dateOffsetNowDesc(news.publishedAt)));
            mDatePublishedAt = news.publishedAt;
            mivImage.setVisibility(View.GONE);
            Log.d(TAG, String.format(Locale.getDefault(), "setNews: thumbnail=%s", news.thumbnail));
            RequestOptions options = new RequestOptions().transform(new CenterCrop(), new RoundedCorners(dpToPx(mContext, 10)));
            Glide.with(itemView.getContext())
                .load(news.thumbnail)
                .listener(new RequestListener<Drawable>() {
                    @Override
                    public boolean onLoadFailed(
                        @Nullable GlideException e,
                        Object model,
                        Target<Drawable> target,
                        boolean isFirstResource) {
                            Log.e(TAG, "fetch image in news failed: id=%s url=`%s` err=%s", news.id, news.thumbnail, e.toString());
                            return false;
                        }
                    
                    @Override
                    public boolean onResourceReady(
                        Drawable resource,
                        Object model,
                        Target<Drawable> target,
                        DataSource dataSource,
                        boolean isFirstResource) {
                            // 根据图片宽高比调整ImageView高度
                            // adjustViewBounds="true"无效
                            /*int realWidth = resource.getIntrinsicWidth();
                            int realHeight = resource.getIntrinsicHeight();
                            LayoutParams lp = mivImage.getLayoutParams();
                            lp.height = realHeight * lp.width / realWidth;
                            mivImage.setLayoutParams(lp);*/
                            mivImage.setVisibility(View.VISIBLE);
                            return false;
                        }
                })
                .apply(options)
                .into(mivImage);
        }

        public void refreshPublishedAt() {
            mtvPublishedAt.setText(String.format(Locale.getDefault(), "%s", dateOffsetNowDesc(mDatePublishedAt)));
        }
    }

    public static class LoadMoreViewHolder extends RecyclerView.ViewHolder {
        private ImageView ivLoading;
        private Button btnLoadMore;
        LoadMoreViewHolder(View itemView, Context ctx) {
            super(itemView);
        }
    }

    private void startRefreshAnimation() {
        Log.d(TAG, "start refresh animation");
        androidx.appcompat.widget.AppCompatImageButton btnRefresh = mNewsFlowListControlPanelLayout.findViewById(R.id.btn_refresh);
        btnRefresh.startAnimation(AnimationUtils.loadAnimation(mActivity, R.anim.rotate_anim));
        btnRefresh.setEnabled(false);
    }

    private void stopRefreshAnimation() {
        Log.d(TAG, "stop refresh animation");
        androidx.appcompat.widget.AppCompatImageButton btnRefresh = mNewsFlowListControlPanelLayout.findViewById(R.id.btn_refresh);
        btnRefresh.clearAnimation();
        btnRefresh.setEnabled(true);
    }

    enum MoreStatus {
        Idle, // 空闲，隐藏nomore文字、reload按钮和loading图标
        Loading, // 加载中，显示loading图标及旋转动画，隐藏nomore文字、reload按钮
        HaveNoMore, // 没有更多新闻可加载，显示nomore文字，隐藏reload按钮和loading图标
        ToBeLoaded, // 待加载，显示reload按钮，隐藏nomore文字、loading图标
    }

    private void markMoreStatus(MoreStatus moreStatus) {
        Log.d(TAG, "markMoreStatus="+moreStatus);
        mMoreStatus = moreStatus;

        ImageView ivLoading = mLoadMoreLayout.findViewById(R.id.iv_loading);
        if (mMoreStatus == MoreStatus.Loading) {
            ivLoading.setVisibility(View.VISIBLE);
            ivLoading.startAnimation(AnimationUtils.loadAnimation(mActivity, R.anim.rotate_anim));
        } else {
            ivLoading.setVisibility(View.GONE);
            ivLoading.clearAnimation();
        }

        TextView tvNoMore = mLoadMoreLayout.findViewById(R.id.tv_no_more);
        tvNoMore.setVisibility(mMoreStatus == MoreStatus.HaveNoMore ? View.VISIBLE : View.GONE);

        Button btnLoadMore = mLoadMoreLayout.findViewById(R.id.btn_load_more);
        btnLoadMore.setVisibility(mMoreStatus == MoreStatus.ToBeLoaded ? View.VISIBLE : View.GONE);
    }

    @Override
    public void onViewAttachedToWindow(@NonNull RecyclerView.ViewHolder holder) {
        super.onViewAttachedToWindow(holder);

        if (holder instanceof LoadMoreViewHolder) {
            Log.v(TAG, "LoadMoreViewHolder attached to window, do loadMoreNews");
            loadMoreNews();
        }
    }

    private void refreshNews() {
        // 没有在刷新，才可以触发刷新操作
        if (mIsRefreshingNewsFlow) {
            Log.v(TAG, "already refreshing, no more refreshing");
            return;
        }

        mIsRefreshingNewsFlow = true;
        startRefreshAnimation();
        mNewsFlowService.refreshAsync(
            new Callback<NewsFlowService.RefreshResponse>() {
                @Override
                public final void onResult(NewsFlowService.RefreshResponse resp) {
                    Log.v(TAG, "refreshAsync return ok=%b haveMore=%b", resp.ok, resp.haveMore);
                    stopRefreshAnimation();
                    mIsRefreshingNewsFlow = false;
                    if (!resp.ok) {
                        markMoreStatus(MoreStatus.ToBeLoaded);
                        return;
                    }
                    if (!resp.haveMore) {
                        markMoreStatus(MoreStatus.HaveNoMore);
                    } else {
                        markMoreStatus(MoreStatus.Idle);
                    }
                    if (resp.action != null) {
                        handleNewsUpdate(resp.action);
                    }
                }
            }
        );
    }

    private void loadMoreNews() {
        // 如果正在初始化缓存，则不允许加载更多
        if (mIsInitializingNewsCache) {
            Log.v(TAG, "is initializing news cache, not loading more");
            return;
        }
        Log.v(TAG, "loadMoreNews: MoreStatus="+mMoreStatus);
        if (mMoreStatus == MoreStatus.HaveNoMore || mMoreStatus == MoreStatus.Loading) {
            return;
        }
        Log.v(TAG, "start load more news");
        markMoreStatus(MoreStatus.Loading);
        mNewsFlowService.fetchMoreAsync(
            new Callback<NewsFlowService.RefreshResponse>() {
                @Override
                public final void onResult(NewsFlowService.RefreshResponse resp) {
                    Log.v(TAG, "onResult load more news");
                    if (!resp.ok) {
                        Log.v(TAG, "fetchMoreAsync return failed");
                        markMoreStatus(MoreStatus.ToBeLoaded);
                        return;
                    }
                    if (!resp.haveMore) {
                        Log.v(TAG, "fetchMoreAsync return have no more");
                        markMoreStatus(MoreStatus.HaveNoMore);
                    } else {
                        Log.v(TAG, "fetchMoreAsync return have more");
                        markMoreStatus(MoreStatus.Idle);
                    }
                    handleNewsUpdate(resp.action);
                }
            }
        );
    }
}
