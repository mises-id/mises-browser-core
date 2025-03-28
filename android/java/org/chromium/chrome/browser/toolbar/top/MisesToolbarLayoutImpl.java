/* Copyright (c) 2019 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at https://mozilla.org/MPL/2.0/. */

package org.chromium.chrome.browser.toolbar.top;

import static org.chromium.ui.base.ViewUtils.dpToPx;

import android.animation.Animator;
import android.animation.ObjectAnimator;
import android.app.Dialog;
import android.content.Context;
import android.content.Intent;
import android.content.res.ColorStateList;
import android.content.res.Configuration;
import android.content.res.Resources;
import android.graphics.Canvas;
import android.graphics.PorterDuff;
import android.graphics.drawable.Drawable;
import android.text.SpannableString;
import android.text.Spanned;
import android.text.TextPaint;
import android.text.method.LinkMovementMethod;
import android.text.style.ClickableSpan;
import android.text.style.ForegroundColorSpan;
import android.util.AttributeSet;
import android.view.Gravity;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.ViewGroup;
import android.view.Window;
import android.widget.FrameLayout;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.core.content.ContextCompat;
import androidx.core.content.res.ResourcesCompat;
import androidx.core.widget.ImageViewCompat;


import org.chromium.base.ApiCompatibilityUtils;
import org.chromium.base.MisesReflectionUtil;
import org.chromium.base.Log;
import org.chromium.base.MathUtils;
import org.chromium.base.ThreadUtils;
import org.chromium.base.supplier.ObservableSupplier;
import org.chromium.base.task.AsyncTask;
import org.chromium.chrome.R;
import org.chromium.chrome.browser.app.MisesActivity;
import org.chromium.chrome.browser.customtabs.CustomTabActivity;
import org.chromium.chrome.browser.customtabs.features.toolbar.CustomTabToolbar;
import org.chromium.chrome.browser.flags.ChromeFeatureList;
import org.chromium.chrome.browser.omnibox.LocationBarCoordinator;
import org.chromium.chrome.browser.profiles.Profile;
import org.chromium.chrome.browser.tab.Tab;
import org.chromium.chrome.browser.tab.TabHidingType;
import org.chromium.chrome.browser.tab.TabSelectionType;
import org.chromium.chrome.browser.tabmodel.TabModelSelector;
import org.chromium.chrome.browser.tabmodel.TabModelSelectorTabModelObserver;
import org.chromium.chrome.browser.tabmodel.TabModelSelectorTabObserver;
import org.chromium.chrome.browser.theme.ThemeUtils;
import org.chromium.chrome.browser.toolbar.ToolbarDataProvider;
import org.chromium.chrome.browser.toolbar.ToolbarTabController;
import org.chromium.chrome.browser.toolbar.bottom.BottomToolbarConfiguration;
import org.chromium.chrome.browser.toolbar.bottom.BottomToolbarVariationManager;
import org.chromium.chrome.browser.toolbar.home_button.HomeButton;
import org.chromium.chrome.browser.toolbar.menu_button.MisesMenuButtonCoordinator;
import org.chromium.chrome.browser.toolbar.menu_button.MenuButtonCoordinator;
import org.chromium.chrome.browser.toolbar.top.NavigationPopup.HistoryDelegate;
import org.chromium.chrome.browser.toolbar.top.ToolbarTablet.OfflineDownloader;
import org.chromium.chrome.browser.user_education.UserEducationHelper;
import org.chromium.components.embedder_support.util.UrlUtilities;
import org.chromium.components.feature_engagement.Tracker;
import org.chromium.content_public.browser.NavigationHandle;
import org.chromium.mojo.bindings.ConnectionErrorHandler;
import org.chromium.mojo.system.MojoException;
import org.chromium.ui.UiUtils;
import org.chromium.ui.base.DeviceFormFactor;
import org.chromium.ui.base.ViewUtils;
import org.chromium.ui.interpolators.Interpolators;
import org.chromium.ui.util.ColorUtils;
import org.chromium.ui.widget.Toast;
import org.chromium.ui.widget.ChromeImageButton;
import org.chromium.url.GURL;
import org.chromium.url.mojom.Url;


import java.net.URL;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Collections;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.function.BooleanSupplier;

public abstract class MisesToolbarLayoutImpl extends ToolbarLayout
        implements MisesToolbarLayout{
    private static final String TAG = "MisesToolbar";


    private boolean mIsBottomToolbarVisible;


    public MisesToolbarLayoutImpl(Context context, AttributeSet attrs) {
        super(context, attrs);

        mIsBottomToolbarVisible =
                BottomToolbarConfiguration.isBottomToolbarEnabled()
                        && MisesMenuButtonCoordinator.isMenuFromBottom();
    }


    public void onBottomToolbarVisibilityChanged(boolean isVisible) {
        mIsBottomToolbarVisible = isVisible;
        if (MisesReflectionUtil.equalTypes(this.getClass(), ToolbarPhone.class)
                && getMenuButtonCoordinator() != null) {
            getMenuButtonCoordinator().setVisibility(!isVisible);
            ToggleTabStackButton toggleTabStackButton = findViewById(R.id.tab_switcher_button);
            if (toggleTabStackButton != null) {
                toggleTabStackButton.setVisibility(isTabSwitcherOnBottom() ? GONE : VISIBLE);
            }
            ChromeImageButton extensionButton = findViewById(R.id.mises_extension_button);
            if (extensionButton != null) {
                extensionButton.setVisibility(isTabSwitcherOnBottom() ? GONE : VISIBLE);
            }
        }
    }
    @Override
    protected void onFinishInflate() {
        super.onFinishInflate();
        if (MisesReflectionUtil.equalTypes(this.getClass(), ToolbarPhone.class)) {
            if (getMenuButtonCoordinator() != null && isMenuButtonOnBottom()) {
                getMenuButtonCoordinator().setVisibility(false);
            }
        }
    }

    @Override
    public void initialize(
            ToolbarDataProvider toolbarDataProvider,
            ToolbarTabController tabController,
            MenuButtonCoordinator menuButtonCoordinator,
            ToggleTabStackButtonCoordinator tabSwitcherButtonCoordinator,
            HistoryDelegate historyDelegate,
            BooleanSupplier partnerHomepageEnabledSupplier,
            OfflineDownloader offlineDownloader,
            UserEducationHelper userEducationHelper,
            ObservableSupplier<Tracker> trackerSupplier) {
        super.initialize(
                toolbarDataProvider,
                tabController,
                menuButtonCoordinator,
                tabSwitcherButtonCoordinator,
                historyDelegate,
                partnerHomepageEnabledSupplier,
                offlineDownloader,
                userEducationHelper,
                trackerSupplier);

        MisesMenuButtonCoordinator.setMenuFromBottom(isMenuButtonOnBottom());
    }

    private boolean isTabSwitcherOnBottom() {
        return mIsBottomToolbarVisible && BottomToolbarVariationManager.isTabSwitcherOnBottom();
    }

    private boolean isMenuButtonOnBottom() {
        return mIsBottomToolbarVisible && BottomToolbarVariationManager.isMenuButtonOnBottom();
    }

    public void updateMenuButtonState() {
        MisesMenuButtonCoordinator.setMenuFromBottom(mIsBottomToolbarVisible);
    }

    public void setTabModelSelector(TabModelSelector selector) {
    }
}
