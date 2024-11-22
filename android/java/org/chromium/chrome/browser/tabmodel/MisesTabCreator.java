/* Copyright (c) 2020 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at https://mozilla.org/MPL/2.0/. */

package org.chromium.chrome.browser.tabmodel;

import android.app.Activity;
import android.os.Build;

import android.content.Intent;
import android.graphics.Rect;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.ActionMode;
import android.view.View.OnClickListener;

import androidx.annotation.Nullable;

import org.chromium.base.MisesReflectionUtil;
import org.chromium.base.supplier.OneshotSupplier;
import org.chromium.base.supplier.Supplier;
import org.chromium.chrome.browser.ChromeTabbedActivity;
import org.chromium.chrome.browser.app.MisesActivity;
import org.chromium.chrome.browser.compositor.CompositorViewHolder;
import org.chromium.chrome.browser.new_tab_url.DseNewTabUrlManager;
import org.chromium.chrome.browser.profiles.Profile;
import org.chromium.chrome.browser.profiles.ProfileManager;
import org.chromium.chrome.browser.profiles.ProfileProvider;
import org.chromium.chrome.browser.tab.Tab;
import org.chromium.chrome.browser.tab.TabDelegateFactory;
import org.chromium.chrome.browser.tab.TabLaunchType;
import org.chromium.chrome.browser.TabbedModeTabDelegateFactory;
import org.chromium.components.embedder_support.util.UrlConstants;
import org.chromium.components.user_prefs.UserPrefs;
import org.chromium.content_public.browser.LoadUrlParams;
import org.chromium.content_public.browser.WebContents;
import org.chromium.ui.base.WindowAndroid;
import org.chromium.chrome.browser.ephemeraltab.EphemeralTabCoordinator;
import org.chromium.url.GURL;
import org.chromium.content_public.browser.SelectionPopupController;
import org.chromium.chrome.browser.selection.ChromeSelectionDropdownMenuDelegate;
import org.chromium.content_public.browser.ActionModeCallback;
import org.chromium.content_public.browser.ActionModeCallbackHelper;

public class MisesTabCreator extends ChromeTabCreator {
    private Supplier<TabDelegateFactory> mTabDelegateFactorySupplier;

    public MisesTabCreator(
            Activity activity,
            WindowAndroid nativeWindow,
            Supplier<TabDelegateFactory> tabDelegateFactory,
            OneshotSupplier<ProfileProvider> profileProviderSupplier,
            boolean incognito,
            AsyncTabParamsManager asyncTabParamsManager,
            Supplier<TabModelSelector> tabModelSelectorSupplier,
            Supplier<CompositorViewHolder> compositorViewHolderSupplier,
            @Nullable DseNewTabUrlManager dseNewTabUrlManager) {
        super(
                activity,
                nativeWindow,
                tabDelegateFactory,
                profileProviderSupplier,
                incognito,
                asyncTabParamsManager,
                tabModelSelectorSupplier,
                compositorViewHolderSupplier,
                dseNewTabUrlManager);
        mTabDelegateFactorySupplier = tabDelegateFactory;

    }

    @Override
    public Tab launchUrl(String url, @TabLaunchType int type) {
        if (url.equals(UrlConstants.NTP_URL)
                && (type == TabLaunchType.FROM_CHROME_UI || type == TabLaunchType.FROM_STARTUP
                        || type == TabLaunchType.FROM_TAB_SWITCHER_UI)) {
            registerPageView();
            ChromeTabbedActivity chromeTabbedActivity = MisesActivity.getChromeTabbedActivity();
            if (chromeTabbedActivity != null && Build.VERSION.SDK_INT <= Build.VERSION_CODES.M) {
                TabModel tabModel = chromeTabbedActivity.getCurrentTabModel();

            }
        }
        return super.launchUrl(url, type);
    }

    @Override
    public Tab createNewTab(LoadUrlParams loadUrlParams, @TabLaunchType int type, Tab parent) {
        if (loadUrlParams.getUrl().equals(UrlConstants.NTP_URL)
                && type == TabLaunchType.FROM_TAB_GROUP_UI) {
            registerPageView();
        }
        return super.createNewTab(loadUrlParams, type, parent, null);
    }

    public WebContents createExtensionPopup(LoadUrlParams loadUrlParams, Tab parent) {
        if (!mTabDelegateFactorySupplier.hasValue()) {
            return null;
        }
        TabDelegateFactory tabDelegateFactory = mTabDelegateFactorySupplier.get();
        if (TabbedModeTabDelegateFactory.class.isInstance(tabDelegateFactory)) {
            TabbedModeTabDelegateFactory  tabbedModeTabDelegateFactory = (TabbedModeTabDelegateFactory)tabDelegateFactory;
            EphemeralTabCoordinator ephemeralTabCoordinator = tabbedModeTabDelegateFactory.getEphemeralTabCoordinator();
            if (ephemeralTabCoordinator != null) {
                Profile profile = (Profile)MisesReflectionUtil.invokeMethod(
                        ChromeTabCreator.class,
                        this,
                        "getProfile");
                ephemeralTabCoordinator.requestOpenSheet(new GURL(loadUrlParams.getUrl()), "", profile);
                WebContents webContents =  ephemeralTabCoordinator.getWebContentsForTesting();
                SelectionPopupController spc =
                            SelectionPopupController.fromWebContents(webContents);

                spc.setActionModeCallback(defaultActionCallback(spc));
                spc.setDropdownMenuDelegate(new ChromeSelectionDropdownMenuDelegate());
                return webContents;
            }
        }
        return null;
    }

    private ActionModeCallback defaultActionCallback(final SelectionPopupController spc) {
        final ActionModeCallbackHelper helper =
                spc.getActionModeCallbackHelper();

        return new ActionModeCallback() {
            @Override
            public boolean onCreateActionMode(ActionMode mode, Menu menu) {
                helper.onCreateActionMode(mode, menu);
                return true;
            }

            @Override
            public boolean onPrepareActionMode(ActionMode mode, Menu menu) {
                return helper.onPrepareActionMode(mode, menu);
            }

            @Override
            public boolean onActionItemClicked(ActionMode mode, MenuItem item) {
                return helper.onActionItemClicked(mode, item);
            }

            @Override
            public boolean onDropdownItemClicked(
                    int groupId,
                    int id,
                    @Nullable Intent intent,
                    @Nullable OnClickListener clickListener) {
                return helper.onDropdownItemClicked(groupId, id, intent, clickListener);
            }

            @Override
            public void onDestroyActionMode(ActionMode mode) {
                helper.onDestroyActionMode();
            }

            @Override
            public void onGetContentRect(ActionMode mode, View view, Rect outRect) {
                helper.onGetContentRect(mode, view, outRect);
            }
        };
    }

    public void closeExtensionPopup(final String extensionId) {
        if (!mTabDelegateFactorySupplier.hasValue()) {
            return;
        }
        TabDelegateFactory tabDelegateFactory = mTabDelegateFactorySupplier.get();
        if (TabbedModeTabDelegateFactory.class.isInstance(tabDelegateFactory)) {
            TabbedModeTabDelegateFactory  tabbedModeTabDelegateFactory = (TabbedModeTabDelegateFactory)tabDelegateFactory;
            EphemeralTabCoordinator ephemeralTabCoordinator = tabbedModeTabDelegateFactory.getEphemeralTabCoordinator();
            if (ephemeralTabCoordinator != null && ephemeralTabCoordinator.isOpened()) {
                GURL url = ephemeralTabCoordinator.getUrlForTesting();
                if (url != null && url.getHost().contains(extensionId)) {
                    ephemeralTabCoordinator.close();
                }
            }
        }
        return;
    }

    private void registerPageView() {
        // NTPBackgroundImagesBridge.getInstance(ProfileManager.getLastUsedRegularProfile())
        //         .registerPageView();
    }
}
