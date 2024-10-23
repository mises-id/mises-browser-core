/* Copyright (c) 2019 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at https://mozilla.org/MPL/2.0/. */

package org.chromium.chrome.browser.ntp;

import static org.chromium.ui.base.ViewUtils.dpToPx;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.content.SharedPreferences;
import android.content.res.Configuration;
import android.graphics.Bitmap;
import android.graphics.Color;
import android.graphics.Point;
import android.graphics.Rect;
import android.graphics.drawable.BitmapDrawable;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.text.TextUtils;
import android.util.AttributeSet;
import android.util.DisplayMetrics;
import android.view.ContextMenu;
import android.view.Display;
import android.view.GestureDetector;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.MenuItem;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewTreeObserver;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.cardview.widget.CardView;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import androidx.recyclerview.widget.SimpleItemAnimator;

import com.airbnb.lottie.LottieAnimationView;
import com.bumptech.glide.Glide;
import com.google.android.material.floatingactionbutton.FloatingActionButton;

import org.chromium.base.Callback;
import org.chromium.base.Log;
import org.chromium.base.MathUtils;
import org.chromium.base.ContextUtils;
import org.chromium.base.ThreadUtils;
import org.chromium.base.supplier.Supplier;
import org.chromium.base.supplier.ObservableSupplier;
import org.chromium.base.task.AsyncTask;
import org.chromium.chrome.R;
import org.chromium.chrome.browser.flags.ChromeFeatureList;
import org.chromium.chrome.browser.lifecycle.ActivityLifecycleDispatcher;
import org.chromium.chrome.browser.logo.LogoCoordinator;
import org.chromium.chrome.browser.native_page.ContextMenuManager;
import org.chromium.chrome.browser.ntp.NewTabPageLayout;
import org.chromium.chrome.browser.offlinepages.DownloadUiActionFlags;
import org.chromium.chrome.browser.offlinepages.OfflinePageBridge;
import org.chromium.chrome.browser.offlinepages.RequestCoordinatorBridge;
import org.chromium.chrome.browser.preferences.MisesPref;
import org.chromium.chrome.browser.preferences.MisesPrefServiceBridge;
import org.chromium.chrome.browser.profiles.Profile;
import org.chromium.chrome.browser.profiles.ProfileManager;
import org.chromium.chrome.browser.settings.SettingsLauncherImpl;
import org.chromium.chrome.browser.suggestions.tile.MisesMostVisitedTilesLayoutBase;
import org.chromium.chrome.browser.suggestions.tile.MostVisitedTilesCoordinator;
import org.chromium.chrome.browser.suggestions.tile.TileGroup;
import org.chromium.chrome.browser.suggestions.tile.TileGroup.Delegate;
import org.chromium.chrome.browser.tab.Tab;
import org.chromium.chrome.browser.tab.TabAttributes;
import org.chromium.chrome.browser.ui.native_page.TouchEnabledDelegate;
import org.chromium.components.browser_ui.settings.SettingsLauncher;
import org.chromium.components.browser_ui.widget.displaystyle.UiConfig;
import org.chromium.components.embedder_support.util.UrlUtilities;
import org.chromium.components.user_prefs.UserPrefs;
import org.chromium.mojo.bindings.ConnectionErrorHandler;
import org.chromium.mojo.system.MojoException;
import org.chromium.ui.base.DeviceFormFactor;
import org.chromium.ui.base.WindowAndroid;
import org.chromium.chrome.browser.feed.FeedSurfaceScrollDelegate;


import java.util.ArrayList;
import java.util.List;
import java.util.Timer;
import java.util.TimerTask;
import java.util.UUID;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import androidx.core.widget.NestedScrollView;


public class MisesNewTabPageLayout
        extends NewTabPageLayout implements ConnectionErrorHandler, OnMisesNtpListener {
    private static final String TAG = "MisesNewTabPageLayout";

    private static final int MINIMUM_VISIBLE_HEIGHT_THRESHOLD = 50;

    // To delete in bytecode, parent variable will be used instead.
    private ViewGroup mMvTilesContainerLayout;
    private LogoCoordinator mLogoCoordinator;

    // Own members.
    private final Context mContext;
    private ImageView mBgImageView;
    private Profile mProfile;

    private BitmapDrawable mImageDrawable;

    private boolean mIsFromBottomSheet;
    private ViewGroup mMainLayout;

    private Tab mTab;
    private Activity mActivity;
    private LinearLayout mSuperReferralSitesLayout;

    private MisesNtpAdapter mNtpAdapter;

    private NestedScrollView mNestedScrollView;
    private RecyclerView mRecyclerView;

    private String mCreativeInstanceId;
    private String mUuid;
    //@TODO alex make an enum
    private boolean mComesFromNewTab;
    private boolean mIsTopSitesEnabled;

    // private Supplier<Tab> mTabProvider;

    private ViewGroup mMisesServiceTilesContainerLayout;
    private MostVisitedTilesCoordinator mMisesServiceTilesCoordinator;

    private ViewGroup mWeb3SiteTilesContainerLayout;
    private MostVisitedTilesCoordinator mWeb3SiteTilesCoordinator;

    private ViewGroup mWeb3ExtensionTilesContainerLayout;
    private MostVisitedTilesCoordinator mWeb3ExtensionTilesCoordinator;

    private ViewGroup mShortcutTilesContainerLayout;
    private MostVisitedTilesCoordinator mShortcutTilesCoordinator;

    private ViewGroup mNewsFlowListControlPanelLayout;

    private ViewGroup mLoadMoreLayout;

    private ViewGroup mNativeAdLayout;
    private ViewGroup mMisesSearchLayout;

    private TileGroupDelegateWrapper mTileGroupDelegateWrapper;
    private NewTabPageManager mManager;

    private static final int SHOW_BRAVE_RATE_ENTRY_AT = 10; // 10th row
    private int scrollOffset;

    private boolean mIsRefreshingNewsFlow;

    public MisesNewTabPageLayout(Context context, AttributeSet attrs) {
        super(context, attrs);

        mContext = context;
        mProfile = ProfileManager.getLastUsedRegularProfile();
        mIsRefreshingNewsFlow = false;
    }

    @Override
    protected void onFinishInflate() {
        super.onFinishInflate();

        mComesFromNewTab = false;

    }

    protected void updateTileGridPlaceholderVisibility() {
        // This function is kept empty to avoid placeholder implementation
    }

    @Override
    protected void updateSearchBoxOnScroll() {
        Log.v(TAG, "updateSearchBoxOnScroll");
        super.updateSearchBoxOnScroll();

    }
    @Override
    float getToolbarTransitionPercentage() {
        Log.v(TAG, "getToolbarTransitionPercentage");
        return MathUtils.clamp(
                ((float)(scrollOffset - 168) / 100),
                0f,
                1f);
    }

    @Override
    void getSearchBoxBounds(Rect bounds, Point translation, View parentView) {
        super.getSearchBoxBounds(bounds, translation, parentView);
        // enforce  translation to zero, this fix tool button not showing in ntp
        translation.x = 0;
        translation.y = 0;
    }

    @Override
    public void setSearchBoxAlpha(float alpha) {
        Log.v(TAG, "setSearchBoxAlpha:" + alpha);
        //mMisesSearchLayout.setAlpha(alpha);
    }
    @Override
    public void checkForBraveStats() {

    }
    @Override
    public void focusSearchBox() {
        if (mManager != null) {
            Log.v(TAG, "focusSearchBox");
            mManager.focusSearchBox(false, null);
        }
    }

    protected void insertSiteSectionView() {


        mMainLayout = findViewById(R.id.ntp_content);


        mMvTilesContainerLayout = (ViewGroup) LayoutInflater.from(mMainLayout.getContext())
                                          .inflate(R.layout.mv_tiles_container, mMainLayout, false);
        mMvTilesContainerLayout.setVisibility(View.VISIBLE);

        final Runnable runable = new Runnable() {
            @Override
            public void run() {
                mMvTilesContainerLayout.addOnLayoutChangeListener(
                        (View view, int left, int top, int right, int bottom, int oldLeft,
                                int oldTop, int oldRight, int oldBottom) -> {
                            Log.v(TAG, "mMvTilesContainerLayout OnLayoutChange");
                            int oldHeight = oldBottom - oldTop;
                            int newHeight = bottom - top;

                            if (oldHeight != newHeight && mIsTopSitesEnabled
                                    && mNtpAdapter != null) {
                                new Handler(Looper.getMainLooper()).post(() -> {
                                    mNtpAdapter.notifySiteChanged();
                                });
                            }
                        });
            }
        };
        mMvTilesContainerLayout.post(runable);

        mMisesServiceTilesContainerLayout = (ViewGroup) LayoutInflater.from(mMainLayout.getContext())
                                        .inflate(R.layout.mises_service_tiles_container, mMainLayout, false);
        mMisesServiceTilesContainerLayout.setVisibility(View.VISIBLE);

        mWeb3SiteTilesContainerLayout = (ViewGroup) LayoutInflater.from(mMainLayout.getContext())
                                        .inflate(R.layout.mises_service_tiles_container, mMainLayout, false);
        mWeb3SiteTilesContainerLayout.setVisibility(View.VISIBLE);     
        
        mWeb3ExtensionTilesContainerLayout = (ViewGroup) LayoutInflater.from(mMainLayout.getContext())
                                        .inflate(R.layout.mises_service_tiles_container, mMainLayout, false);
        mWeb3ExtensionTilesContainerLayout.setVisibility(View.VISIBLE);
        mWeb3ExtensionTilesContainerLayout.post(runable);
        
        mShortcutTilesContainerLayout = (ViewGroup) LayoutInflater.from(mMainLayout.getContext())
                                        .inflate(R.layout.mises_service_tiles_container, mMainLayout, false);
        mShortcutTilesContainerLayout.setVisibility(View.VISIBLE);
        mShortcutTilesContainerLayout.post(runable);

        mNewsFlowListControlPanelLayout = (ViewGroup) LayoutInflater.from(mMainLayout.getContext())
            .inflate(R.layout.mises_news_flow_list_control_panel, mMainLayout, false);
        mNewsFlowListControlPanelLayout.setVisibility(View.VISIBLE);

        mLoadMoreLayout = (ViewGroup) LayoutInflater.from(mMainLayout.getContext())
                                        .inflate(R.layout.new_tab_page_load_more, mMainLayout, false);
        mLoadMoreLayout.setVisibility(View.VISIBLE);

        mNativeAdLayout= (ViewGroup) LayoutInflater.from(mMainLayout.getContext())
                                        .inflate(R.layout.mises_carousel_container, mMainLayout, false);
        mNativeAdLayout.setVisibility(View.VISIBLE);

        mMisesSearchLayout= (ViewGroup) LayoutInflater.from(mMainLayout.getContext())
                                        .inflate(R.layout.mises_search_box_layout, mMainLayout, false);
        mMisesSearchLayout.setVisibility(View.VISIBLE);


        // The page contents are initially hidden; otherwise they'll be drawn centered on the
        // page before the tiles are available and then jump upwards to make space once the
        // tiles are available.
        if (getVisibility() != View.VISIBLE) setVisibility(View.VISIBLE);
    }

    @Override
    protected void onAttachedToWindow() {
        super.onAttachedToWindow();
        if (mRecyclerView == null) {
            setNtpViews();
        }
        if (mRecyclerView != null) {
            Log.d(TAG, "mRecyclerView.addOnScrollListener" );
            mRecyclerView.addOnScrollListener(new RecyclerView.OnScrollListener() {
                @Override
                public void onScrollStateChanged(@NonNull RecyclerView recyclerView, int newState) {
                    super.onScrollStateChanged(recyclerView, newState);
                    Log.v(TAG, "mRecyclerView onScrollStateChanged: newState=" + newState);
                    
                }

                @Override
                public void onScrolled(@NonNull RecyclerView recyclerView, int dx, int dy) {
                    super.onScrolled(recyclerView, dx, dy);
                    scrollOffset = recyclerView.computeVerticalScrollOffset();
                    Log.v(TAG, "mRecyclerView onScrolled: scrollOffset=" + scrollOffset + ",dy="+ dy);
                    updateSearchBoxOnScroll();
                }
            });
        }
        
        if (mNtpAdapter != null) {
            mNtpAdapter.onAttached();
        }
    }

    public class LinearLayoutManagerWrapper extends LinearLayoutManager {
        private static final String TAG = "LLManagerWrapper";

        public LinearLayoutManagerWrapper(Context context) {
            super(context);
        }

        public LinearLayoutManagerWrapper(Context context, int orientation, boolean reverseLayout) {
            super(context, orientation, reverseLayout);
        }

        public LinearLayoutManagerWrapper(
                Context context, AttributeSet attrs, int defStyleAttr, int defStyleRes) {
            super(context, attrs, defStyleAttr, defStyleRes);
        }

        @Override
        public void onLayoutChildren(RecyclerView.Recycler recycler, RecyclerView.State state) {
            try {
                super.onLayoutChildren(recycler, state);
            } catch (IndexOutOfBoundsException e) {
                Log.e(TAG, "IndexOutOfBoundsException in RecyclerView: ", e);
                assert false;
            } catch (ClassCastException e) {
                Log.e(TAG, "ClassCastException in RecyclerView: ", e);
                assert false;
            }
        }
    }

    @SuppressLint("ClickableViewAccessibility")
    private void setNtpViews() {

        mRecyclerView = findViewById(R.id.recyclerview);
       // mNestedScrollView = findViewById(R.id.nestedScrollView);
        LinearLayoutManagerWrapper linearLayoutManager =
                new LinearLayoutManagerWrapper(mActivity, LinearLayoutManager.VERTICAL, false);
        mRecyclerView.setLayoutManager(linearLayoutManager);
        mRecyclerView.post(new Runnable() {
            @Override
            public void run() {
                setNtpRecyclerView(linearLayoutManager);
            }
        });
    }

    private boolean shouldDisplayTopSites() {
        return true;
    }

    private void setNtpRecyclerView(LinearLayoutManager linearLayoutManager) {
        mIsTopSitesEnabled = shouldDisplayTopSites();

        if (mNtpAdapter == null) {
            if (mActivity != null && !mActivity.isDestroyed() && !mActivity.isFinishing()) {
                mNtpAdapter = new MisesNtpAdapter(
                    mActivity, this, Glide.with(mActivity),
                    mMvTilesContainerLayout, mMisesServiceTilesContainerLayout, 
                    mWeb3SiteTilesContainerLayout, mWeb3ExtensionTilesContainerLayout,
                    mShortcutTilesContainerLayout,
                    mNewsFlowListControlPanelLayout,
                    mLoadMoreLayout,
                    mNativeAdLayout, mMisesSearchLayout,
                    mRecyclerView.getHeight(), mIsTopSitesEnabled
                );

                mRecyclerView.setAdapter(mNtpAdapter);

                if (mRecyclerView.getItemAnimator() != null) {
                    RecyclerView.ItemAnimator itemAnimator = mRecyclerView.getItemAnimator();
                    if (itemAnimator instanceof SimpleItemAnimator) {
                        SimpleItemAnimator simpleItemAnimator = (SimpleItemAnimator) itemAnimator;
                        simpleItemAnimator.setSupportsChangeAnimations(false);
                    }
                }
            }
        } else {
            mNtpAdapter.setRecyclerViewHeight(mRecyclerView.getHeight());
            mNtpAdapter.setTopSitesEnabled(mIsTopSitesEnabled);
        }

        if (mNtpAdapter == null) return;

        keepPosition();
    }

    private void keepPosition() {
        //keep recycle view scroll position
        RecyclerView.LayoutManager manager = mRecyclerView.getLayoutManager();
        if (manager instanceof LinearLayoutManager) {
            LinearLayoutManager linearLayoutManager = (LinearLayoutManager) manager;
            linearLayoutManager.scrollToPositionWithOffset(0, 0);
        }
    }


    @Override
    public void updateNewsOptin(boolean isOptin) {


    }




    @Override
    protected void onDetachedFromWindow() {

        if (!mIsFromBottomSheet) {
            setBackgroundResource(0);
            if (mImageDrawable != null && mImageDrawable.getBitmap() != null
                    && !mImageDrawable.getBitmap().isRecycled()) {
                mImageDrawable.getBitmap().recycle();
            }
        }
        Log.d(TAG, "mRecyclerView.clearOnScrollListeners" );
        mRecyclerView.clearOnScrollListeners();

        if (mNtpAdapter != null) {
            mNtpAdapter.onDetached();
        }
        super.onDetachedFromWindow();
    }

    @Override
    public void onConfigurationChanged(Configuration newConfig) {
       
        super.onConfigurationChanged(newConfig);
    }

    @Override
    public void loadNewContent() {
    }

    @Override
    public void getFeed(boolean isNewContent) {
    }



    @Override
    public void initialize(
            NewTabPageManager manager,
            Activity activity,
            Delegate tileGroupDelegate,
            boolean searchProviderHasLogo,
            boolean searchProviderIsGoogle,
            FeedSurfaceScrollDelegate scrollDelegate,
            TouchEnabledDelegate touchEnabledDelegate,
            UiConfig uiConfig,
            ActivityLifecycleDispatcher lifecycleDispatcher,
            NewTabPageUma uma,
            Profile profile,
            WindowAndroid windowAndroid,
            boolean isTablet,
            ObservableSupplier<Integer> tabStripHeightSupplier) {
        
        // must init before super initialize
        mTileGroupDelegateWrapper  = new TileGroupDelegateWrapper(tileGroupDelegate);

        super.initialize(
                manager,
                activity,
                tileGroupDelegate,
                searchProviderHasLogo,
                searchProviderIsGoogle,
                scrollDelegate,
                touchEnabledDelegate,
                uiConfig,
                lifecycleDispatcher,
                uma,
                profile,
                windowAndroid,
                isTablet,
                tabStripHeightSupplier);

        Log.d(TAG, "initialize " + searchProviderHasLogo);
        mActivity = activity;
        mManager = manager;
        mProfile = profile;

        assert mMvTilesContainerLayout != null : "Something has changed in the upstream!";

        if (mMvTilesContainerLayout != null && useFixedMVTLayout()) {
            ViewGroup tilesLayout = mMvTilesContainerLayout.findViewById(R.id.mv_tiles_layout);

            assert tilesLayout instanceof MisesMostVisitedTilesLayoutBase
                    : "Something has changed in the upstream!";

            if (tilesLayout instanceof MisesMostVisitedTilesLayoutBase) {
                ((MisesMostVisitedTilesLayoutBase) tilesLayout).setUseFixedLayout(true);
            }
        }
        
        initializeMisesServiceTilesCoordinator(mProfile, lifecycleDispatcher, mTileGroupDelegateWrapper,
                touchEnabledDelegate, windowAndroid);
        initializeWeb3SiteTilesCoordinator(mProfile, lifecycleDispatcher, mTileGroupDelegateWrapper,
                touchEnabledDelegate, windowAndroid);        
        initializeWeb3ExtensionTilesCoordinator(mProfile, lifecycleDispatcher, mTileGroupDelegateWrapper,
                touchEnabledDelegate, windowAndroid);
        initializeShortcutTilesCoordinator(mProfile, lifecycleDispatcher, mTileGroupDelegateWrapper,
            touchEnabledDelegate, windowAndroid);
        
        mTileGroupDelegateWrapper.setReady();

        manager.addDestructionObserver(MisesNewTabPageLayout.this::onDestroy);

        
    }

    @Override
    public void onSwitchToForeground() {
        Log.v(TAG, "onSwitchToForeground");
        super.onSwitchToForeground();
        
        if (mMisesServiceTilesCoordinator != null) {
            mMisesServiceTilesCoordinator.onSwitchToForeground();
        }
        if (mWeb3SiteTilesCoordinator != null) {
            mWeb3SiteTilesCoordinator.onSwitchToForeground();
        }
        if (mWeb3ExtensionTilesCoordinator != null) {
            mWeb3ExtensionTilesCoordinator.onSwitchToForeground();
        }
        if (mShortcutTilesCoordinator != null) {
            mShortcutTilesCoordinator.onSwitchToForeground();
        }
    }
    private void onDestroy() {
        Log.v(TAG, "onDestroy");
        if (mTileGroupDelegateWrapper != null) {
            mTileGroupDelegateWrapper.destroy();
            mTileGroupDelegateWrapper = null;
        }

        if (mMisesServiceTilesCoordinator != null) {
            mMisesServiceTilesCoordinator.destroyMvtiles();
            mMisesServiceTilesCoordinator = null;
        }
        if (mWeb3SiteTilesCoordinator != null) {
            mWeb3SiteTilesCoordinator.destroyMvtiles();
            mWeb3SiteTilesCoordinator = null;
        }
        if (mWeb3ExtensionTilesCoordinator != null) {
            mWeb3ExtensionTilesCoordinator.destroyMvtiles();
            mWeb3ExtensionTilesCoordinator = null;
        }
        if (mShortcutTilesCoordinator != null) {
            mShortcutTilesCoordinator.destroyMvtiles();
            mShortcutTilesCoordinator = null;
        }

        if (mNtpAdapter != null) {
            mNtpAdapter.onDestroy();
        }
    }

    /*public void setTabProvider(Supplier<Tab> tabProvider) {
        mTabProvider = tabProvider;
    }

    public void setTab(Tab tab) {
        mTab = tab;
    }

    private Tab getTab() {
        assert mTab != null;
        return mTab;
    }

    private TabImpl getTabImpl() {
        return (TabImpl) getTab();
    }*/

    @Override
    public void onConnectionError(MojoException e) {

    }


    protected boolean useFixedMVTLayout() {
        return true;
    }

    // @Override
    // void setSearchProviderTopMargin(int topMargin) {
    //     if (mLogoCoordinator != null) mLogoCoordinator.setTopMargin(topMargin);
    // }

    // @Override
    // void setSearchProviderBottomMargin(int bottomMargin) {
    //     if (mLogoCoordinator != null) mLogoCoordinator.setBottomMargin(bottomMargin);
    // }


    private void initializeMisesServiceTilesCoordinator(
            Profile profile,
            ActivityLifecycleDispatcher activityLifecycleDispatcher,
            TileGroup.Delegate tileGroupDelegate, TouchEnabledDelegate touchEnabledDelegate, 
            WindowAndroid windowAndroid) {
        assert mMisesServiceTilesContainerLayout != null;

        int maxRows = 3;

        mMisesServiceTilesCoordinator = new MostVisitedTilesCoordinator(mActivity,
                activityLifecycleDispatcher, mMisesServiceTilesContainerLayout, windowAndroid,
                () -> {}, () -> {});

        mMisesServiceTilesCoordinator.initWithNative(
                profile, mManager, tileGroupDelegate, touchEnabledDelegate);
    }


    private void initializeWeb3SiteTilesCoordinator(
            Profile profile,
            ActivityLifecycleDispatcher activityLifecycleDispatcher,
            TileGroup.Delegate tileGroupDelegate, TouchEnabledDelegate touchEnabledDelegate, 
            WindowAndroid windowAndroid) {
        assert mWeb3SiteTilesContainerLayout != null;

        int maxRows = 3;

        mWeb3SiteTilesCoordinator = new MostVisitedTilesCoordinator(
            mActivity,
            activityLifecycleDispatcher,
            mWeb3SiteTilesContainerLayout,
            windowAndroid,
            () -> {},
            () -> {});

        mWeb3SiteTilesCoordinator.initWithNative(
                profile, mManager, tileGroupDelegate, touchEnabledDelegate);
    }

    private void initializeWeb3ExtensionTilesCoordinator(
            Profile profile,
            ActivityLifecycleDispatcher activityLifecycleDispatcher,
            TileGroup.Delegate tileGroupDelegate, TouchEnabledDelegate touchEnabledDelegate, 
            WindowAndroid windowAndroid) {
        assert mWeb3ExtensionTilesContainerLayout != null;

        int maxRows = 1;

        mWeb3ExtensionTilesCoordinator = new MostVisitedTilesCoordinator(mActivity,
                activityLifecycleDispatcher, mWeb3ExtensionTilesContainerLayout, windowAndroid,
                () -> {}, () -> {});

        mWeb3ExtensionTilesCoordinator.initWithNative(
                profile, mManager, tileGroupDelegate, touchEnabledDelegate);
    }

    private void initializeShortcutTilesCoordinator(
            Profile profile,
            ActivityLifecycleDispatcher activityLifecycleDispatcher,
            TileGroup.Delegate tileGroupDelegate, TouchEnabledDelegate touchEnabledDelegate,
            WindowAndroid windowAndroid) {
        assert mShortcutTilesContainerLayout != null;

        int maxRows = 3;

        mShortcutTilesCoordinator = new MostVisitedTilesCoordinator(
            mActivity,
            activityLifecycleDispatcher,
            mShortcutTilesContainerLayout,
            windowAndroid,
            () -> {},
            () -> {});

        mShortcutTilesCoordinator.initWithNative(
            profile, mManager, tileGroupDelegate, touchEnabledDelegate);
    }
}
