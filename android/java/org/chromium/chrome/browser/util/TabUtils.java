/**
 * Copyright (c) 2020 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package org.chromium.chrome.browser.util;

import static androidx.browser.customtabs.CustomTabsIntent.COLOR_SCHEME_DARK;
import static androidx.browser.customtabs.CustomTabsIntent.COLOR_SCHEME_LIGHT;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.provider.Browser;
import android.view.ContextThemeWrapper;
import android.view.MenuItem;
import android.view.View;
import android.widget.FrameLayout;
import android.widget.PopupMenu;

import androidx.appcompat.view.menu.MenuPopupHelper;
import androidx.browser.customtabs.CustomTabsIntent;
import androidx.core.content.ContextCompat;
import androidx.core.view.MenuCompat;

import org.chromium.base.IntentUtils;
import org.chromium.base.Log;
import org.chromium.base.supplier.ObservableSupplier;
import org.chromium.chrome.R;
import org.chromium.chrome.browser.ChromeTabbedActivity;
import org.chromium.chrome.browser.LaunchIntentDispatcher;
import org.chromium.chrome.browser.app.MisesActivity;
import org.chromium.chrome.browser.bookmarks.BookmarkModel;
import org.chromium.chrome.browser.bookmarks.BookmarkUtils;
import org.chromium.chrome.browser.night_mode.GlobalNightModeStateProviderHolder;
import org.chromium.chrome.browser.tab.Tab;
import org.chromium.chrome.browser.tab.TabLaunchType;
import org.chromium.chrome.browser.tasks.tab_management.MisesTabUiFeatureUtilities;
import org.chromium.chrome.browser.toolbar.LocationBarModel;
import org.chromium.components.bookmarks.BookmarkId;
import org.chromium.content_public.browser.LoadUrlParams;
import org.chromium.ui.util.ColorUtils;

import java.lang.reflect.Field;

public class TabUtils {
    private static final String TAG = "TabUtils";

    public static void showBookmarkTabPopupMenu(Context context, View view,
            ObservableSupplier<BookmarkModel> bookmarkModelSupplier,
            LocationBarModel locationBarModel) {
        Context wrapper = new ContextThemeWrapper(context, R.style.BookmarkTabPopupMenu);

        PopupMenu popup = new PopupMenu(wrapper, view);
        popup.getMenuInflater().inflate(R.menu.bookmark_tab_menu, popup.getMenu());
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            popup.setForceShowIcon(true);
        } else {
            try {
                Field[] fields = popup.getClass().getDeclaredFields();
                for (Field field : fields) {
                    if ("mPopup".equals(field.getName())) {
                        MenuPopupHelper menuPopupHelper = (MenuPopupHelper) field.get(popup);
                        menuPopupHelper.setForceShowIcon(true);
                        break;
                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        Tab currentTab = locationBarModel != null ? locationBarModel.getTab() : null;
        BookmarkModel bridge = bookmarkModelSupplier != null ? bookmarkModelSupplier.get() : null;
        boolean isBookmarked =
                currentTab != null && bridge != null && bridge.hasBookmarkIdForTab(currentTab);
        boolean editingAllowed =
                currentTab == null || bridge == null || bridge.isEditBookmarksEnabled();

        MenuCompat.setGroupDividerEnabled(popup.getMenu(), true);

        MenuItem addMenuItem = popup.getMenu().findItem(R.id.add_bookmark);
        MenuItem editMenuItem = popup.getMenu().findItem(R.id.edit_bookmark);
        MenuItem viewMenuItem = popup.getMenu().findItem(R.id.view_bookmarks);
        MenuItem deleteMenuItem = popup.getMenu().findItem(R.id.delete_bookmark);

        if (GlobalNightModeStateProviderHolder.getInstance().isInNightMode()) {
            addMenuItem.getIcon().setTint(
                    ContextCompat.getColor(context, R.color.bookmark_menu_text_color));
            editMenuItem.getIcon().setTint(
                    ContextCompat.getColor(context, R.color.bookmark_menu_text_color));
            viewMenuItem.getIcon().setTint(
                    ContextCompat.getColor(context, R.color.bookmark_menu_text_color));
            deleteMenuItem.getIcon().setTint(
                    ContextCompat.getColor(context, R.color.bookmark_menu_text_color));
        }

        if (editingAllowed) {
            if (isBookmarked) {
                addMenuItem.setVisible(false);
            } else {
                editMenuItem.setVisible(false);
                deleteMenuItem.setVisible(false);
            }
        } else {
            addMenuItem.setVisible(false);
            editMenuItem.setVisible(false);
            deleteMenuItem.setVisible(false);
        }

        popup.setOnMenuItemClickListener(new PopupMenu.OnMenuItemClickListener() {
            @Override
            public boolean onMenuItemClick(MenuItem item) {
                int id = item.getItemId();
                MisesActivity activity = null;
                try {
                    activity = MisesActivity.getMisesActivity();
                } catch (MisesActivity.MisesActivityNotFoundException e) {
                    Log.e(TAG, "showBookmarkTabPopupMenu popup click " + e);
                }
                if (currentTab == null || activity == null) {
                    return false;
                }

                if (id == R.id.add_bookmark || id == R.id.delete_bookmark) {
                    activity.addOrEditBookmark(currentTab);
                    return true;
                } else if (id == R.id.edit_bookmark && bridge != null) {
                    BookmarkId bookmarkId = bridge.getUserBookmarkIdForTab(currentTab);
                    if (bookmarkId != null) {
                        BookmarkUtils.startEditActivity(activity, bookmarkId);
                        return true;
                    }
                } else if (id == R.id.view_bookmarks) {
                    BookmarkUtils.showBookmarkManager(activity, currentTab.isIncognito());
                    return true;
                }
                return false;
            }
        });

        popup.show();
    }

    public static void showTabPopupMenu(Context context, View view) {
        try {
            MisesActivity misesActivity = MisesActivity.getMisesActivity();
            Context wrapper = new ContextThemeWrapper(context,
                    GlobalNightModeStateProviderHolder.getInstance().isInNightMode()
                            ? R.style.NewTabPopupMenuDark
                            : R.style.NewTabPopupMenuLight);
            // Creating the instance of PopupMenu
            PopupMenu popup = new PopupMenu(wrapper, view);
            // Inflating the Popup using xml file
            popup.getMenuInflater().inflate(R.menu.new_tab_menu, popup.getMenu());

            if (misesActivity != null && misesActivity.getCurrentTabModel().isIncognito()) {
                popup.getMenu().findItem(R.id.new_tab_menu_id).setVisible(false);
            }
            // registering popup with OnMenuItemClickListener
            popup.setOnMenuItemClickListener(new PopupMenu.OnMenuItemClickListener() {
                @Override
                public boolean onMenuItemClick(MenuItem item) {
                    int id = item.getItemId();
                    if (id == R.id.new_tab_menu_id) {
                        openNewTab(misesActivity, false);
                    } else if (id == R.id.new_incognito_tab_menu_id) {
                        openNewTab(misesActivity, true);
                    }
                    return true;
                }
            });
            popup.show(); // showing popup menu
        } catch (MisesActivity.MisesActivityNotFoundException e) {
            Log.e(TAG, "showTabPopupMenu " + e);
        }
    }

    public static void openNewTab() {
        try {
            MisesActivity misesActivity = MisesActivity.getMisesActivity();
            boolean isIncognito = misesActivity != null
                    ? misesActivity.getCurrentTabModel().isIncognito()
                    : false;
            openNewTab(misesActivity, isIncognito);
        } catch (MisesActivity.MisesActivityNotFoundException e) {
            Log.e(TAG, "openNewTab " + e);
        }
    }

    private static void openNewTab(MisesActivity misesActivity, boolean isIncognito) {
        if (misesActivity == null) return;
        misesActivity.getTabModelSelector().getModel(isIncognito).commitAllTabClosures();
        misesActivity.getTabCreator(isIncognito).launchNtp();
    }

    public static void openUrlInNewTab(boolean isIncognito, String url) {
        try {
            MisesActivity misesActivity = MisesActivity.getMisesActivity();
            misesActivity.getTabCreator(isIncognito).launchUrl(url, TabLaunchType.FROM_CHROME_UI);
        } catch (MisesActivity.MisesActivityNotFoundException e) {
            Log.e(TAG, "openUrlInNewTab " + e);
        }
    }

    public static void openUrlInNewTabInBackground(boolean isIncognito, String url) {
        try {
            MisesActivity misesActivity = MisesActivity.getMisesActivity();
            if (misesActivity.getTabModelSelector() != null
                    && misesActivity.getActivityTab() != null) {
                misesActivity.getTabModelSelector().openNewTab(new LoadUrlParams(url),
                        MisesTabUiFeatureUtilities.isMisesTabGroupsEnabled()
                                ? TabLaunchType.FROM_LONGPRESS_BACKGROUND_IN_GROUP
                                : TabLaunchType.FROM_LONGPRESS_BACKGROUND,
                        misesActivity.getActivityTab(), isIncognito);
            }
        } catch (MisesActivity.MisesActivityNotFoundException e) {
            Log.e(TAG, "openUrlInNewTabInBackground " + e);
        }
    }

    public static void openUrlInSameTab(String url) {
        try {
            MisesActivity misesActivity = MisesActivity.getMisesActivity();
            if (misesActivity.getActivityTab() != null) {
                LoadUrlParams loadUrlParams = new LoadUrlParams(url);
                misesActivity.getActivityTab().loadUrl(loadUrlParams);
            }
        } catch (MisesActivity.MisesActivityNotFoundException e) {
            Log.e(TAG, "openUrlInSameTab " + e);
        }
    }

    public static void reloadIgnoringCache() {
        try {
            MisesActivity misesActivity = MisesActivity.getMisesActivity();
            if (misesActivity.getActivityTab() != null) {
                misesActivity.getActivityTab().reloadIgnoringCache();
            }
        } catch (MisesActivity.MisesActivityNotFoundException e) {
            Log.e(TAG, "reloadIgnoringCache " + e);
        }
    }

    // public static void enableRewardsButton() {
    //     try {
    //         MisesActivity misesActivity = MisesActivity.getMisesActivity();
    //         if (misesActivity.getToolbarManager() == null) {
    //             return;
    //         }
    //         View toolbarView = misesActivity.findViewById(R.id.toolbar);
    //         if (toolbarView == null) {
    //             return;
    //         }
    //         FrameLayout rewardsLayout = toolbarView.findViewById(R.id.mises_rewards_button_layout);
    //         if (rewardsLayout == null) {
    //             return;
    //         }
    //         rewardsLayout.setVisibility(View.VISIBLE);
    //     } catch (MisesActivity.MisesActivityNotFoundException e) {
    //         Log.e(TAG, "enableRewardsButton " + e);
    //     }
    // }

    public static void bringChromeTabbedActivityToTheTop(Activity activity) {
        Intent misesActivityIntent = new Intent(activity, ChromeTabbedActivity.class);
        misesActivityIntent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
        misesActivityIntent.setAction(Intent.ACTION_VIEW);
        activity.startActivity(misesActivityIntent);
    }

    /**
     * Open link in a (normal/non-incognito) tab
     * @param activity packageContext/source of the intent
     * @param link to be opened
     */
    public static void openLinkWithFocus(Activity activity, String link) {
        TabUtils.openUrlInNewTab(false, link);
        TabUtils.bringChromeTabbedActivityToTheTop(activity);
    }

    public static void openURLWithMisesActivity(String url) {
        try {
            MisesActivity activity = MisesActivity.getMisesActivity();
            activity.openNewOrSelectExistingTab(url, true);
            TabUtils.bringChromeTabbedActivityToTheTop(activity);
        } catch (MisesActivity.MisesActivityNotFoundException e) {
            Log.e(TAG, "openURLWithMisesActivity error", e);
        }
    }

    /**
     * Open link in a custom tab
     *
     * @param context packageContext/source of the intent
     * @param url to be opened
     */
    public static void openUrlInCustomTab(Context context, String url) {
        CustomTabsIntent customTabIntent =
                new CustomTabsIntent.Builder()
                        .setShowTitle(true)
                        .setColorScheme(ColorUtils.inNightMode(context) ? COLOR_SCHEME_DARK
                                                                        : COLOR_SCHEME_LIGHT)
                        .build();
        customTabIntent.intent.setData(Uri.parse(url));

        Intent intent = LaunchIntentDispatcher.createCustomTabActivityIntent(
                context, customTabIntent.intent);
        intent.setPackage(context.getPackageName());
        intent.putExtra(Browser.EXTRA_APPLICATION_ID, context.getPackageName());
        if (!(context instanceof Activity)) intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        IntentUtils.addTrustedIntentExtras(intent);

        context.startActivity(intent);
    }

    /**
     * Returns transition for the given tab
     *
     * @param tab
     */
    public static int getTransition(Tab tab) {
        if (tab != null
                && tab.getWebContents() != null
                && tab.getWebContents().getNavigationController() != null
                && tab.getWebContents().getNavigationController().getVisibleEntry() != null) {
            int transition =
                    tab.getWebContents()
                            .getNavigationController()
                            .getVisibleEntry()
                            .getTransition();
            return transition;
        }
        return 0;
    }
}
