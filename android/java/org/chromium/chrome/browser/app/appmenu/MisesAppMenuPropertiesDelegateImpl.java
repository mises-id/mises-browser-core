/* Copyright (c) 2021 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

package org.chromium.chrome.browser.app.appmenu;

import android.content.Context;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;

import androidx.annotation.Nullable;
import androidx.appcompat.content.res.AppCompatResources;

import org.chromium.base.supplier.ObservableSupplier;
import org.chromium.base.supplier.OneshotSupplier;
import org.chromium.base.supplier.Supplier;
import org.chromium.chrome.R;
import org.chromium.chrome.browser.ActivityTabProvider;
import org.chromium.chrome.browser.bookmarks.BookmarkModel;
import org.chromium.chrome.browser.feed.webfeed.WebFeedBridge;
import org.chromium.chrome.browser.incognito.reauth.IncognitoReauthController;
import org.chromium.chrome.browser.layouts.LayoutStateProvider;
import org.chromium.chrome.browser.multiwindow.MultiWindowModeStateDispatcher;
import org.chromium.chrome.browser.tabmodel.TabModelSelector;
import org.chromium.chrome.browser.toolbar.ToolbarManager;
import org.chromium.chrome.browser.ui.appmenu.AppMenuHandler;
import org.chromium.chrome.browser.ui.appmenu.AppMenuHandler.AppMenuItemType;
import org.chromium.chrome.browser.ui.appmenu.AppMenuItemProperties;
import org.chromium.ui.modaldialog.ModalDialogManager;
import org.chromium.ui.modelutil.MVCListAdapter;
import org.chromium.ui.modelutil.MVCListAdapter.ModelList;
import org.chromium.chrome.browser.readaloud.ReadAloudController;

public class MisesAppMenuPropertiesDelegateImpl extends AppMenuPropertiesDelegateImpl {
    public MisesAppMenuPropertiesDelegateImpl(
            Context context,
            ActivityTabProvider activityTabProvider,
            MultiWindowModeStateDispatcher multiWindowModeStateDispatcher,
            TabModelSelector tabModelSelector,
            ToolbarManager toolbarManager,
            View decorView,
            @Nullable OneshotSupplier<LayoutStateProvider> layoutStateProvidersSupplier,
            ObservableSupplier<BookmarkModel> bookmarkModelSupplier,
            @Nullable
                    OneshotSupplier<IncognitoReauthController>
                            incognitoReauthControllerOneshotSupplier,
            @Nullable Supplier<ReadAloudController> readAloudControllerSupplier){
        super(context, activityTabProvider, multiWindowModeStateDispatcher, tabModelSelector,
                toolbarManager, decorView, layoutStateProvidersSupplier,
                bookmarkModelSupplier, incognitoReauthControllerOneshotSupplier,
                readAloudControllerSupplier);
    }

    @Override
    public void prepareMenu(Menu menu, AppMenuHandler handler) {
        super.prepareMenu(menu, handler);

        maybeReplaceIcons(menu);
    }

    @Override
    public int getAppMenuLayoutId() {
        return R.menu.mises_main_menu;
    }

    @Override
    public ModelList getMenuItems(
            CustomItemViewTypeProvider customItemViewTypeProvider, AppMenuHandler handler) {
        ModelList modelList = super.getMenuItems(customItemViewTypeProvider, handler);

        for (int i = 0; i < modelList.size(); ++i) {
            MVCListAdapter.ListItem item = modelList.get(i);
            int id = item.model.get(AppMenuItemProperties.MENU_ITEM_ID);

            //if (id == R.id.request_brave_vpn_row_menu_id) {
            //    int menutype = AppMenuItemType.TITLE_BUTTON;
            //    modelList.update(i, new MVCListAdapter.ListItem(menutype, item.model));
            //}
        }

        return modelList;
    }

    private void maybeReplaceIcons(Menu menu) {
        if (shouldShowIconBeforeItem()) {
            for (int i = 0; i < menu.size(); ++i) {
                MenuItem item = menu.getItem(i);
                if (item.hasSubMenu()) {
                    maybeReplaceIcons(item.getSubMenu());
                } 
            }
        }
    }
}
