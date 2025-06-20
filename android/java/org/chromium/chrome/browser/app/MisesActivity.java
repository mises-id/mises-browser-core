package org.chromium.chrome.browser.app;


import android.app.Activity;
import android.content.res.Configuration;
import androidx.annotation.NonNull;
import android.view.View;
import android.view.ViewGroup;
import androidx.coordinatorlayout.widget.CoordinatorLayout;
import android.content.Context;

import org.jni_zero.JNINamespace;
import org.jni_zero.NativeMethods;

import org.chromium.base.ApplicationStatus;
import org.chromium.base.supplier.ObservableSupplier;
import org.chromium.base.supplier.UnownedUserDataSupplier;
import org.chromium.base.ContextUtils;

import org.chromium.chrome.browser.ChromeTabbedActivity;
import org.chromium.chrome.browser.dependency_injection.ChromeActivityComponent;
import org.chromium.chrome.browser.toolbar.bottom.BottomToolbarConfiguration;
import org.chromium.chrome.R;
import org.chromium.chrome.browser.tab.Tab;
import org.chromium.chrome.browser.tab.TabSelectionType;
import org.chromium.chrome.browser.tab.TabLaunchType;
import org.chromium.chrome.browser.tabmodel.TabModel;
import org.chromium.chrome.browser.tabmodel.TabModelUtils;
import org.chromium.chrome.browser.bookmarks.TabBookmarker;
import org.chromium.chrome.browser.fullscreen.BrowserControlsManager;
import org.chromium.chrome.browser.tabmodel.MismatchedIndicesHandler;



/** Mises's extension for ChromeActivity */
@JNINamespace("chrome::android")
public abstract class MisesActivity extends ChromeActivity<ChromeActivityComponent> implements MismatchedIndicesHandler {
    public boolean mComesFromNewTab;

    private UnownedUserDataSupplier<BrowserControlsManager> mBrowserControlsManagerSupplier;

    /** Serves as a general exception for failed attempts to get MisesActivity. */
    public static class MisesActivityNotFoundException extends Exception {
        public MisesActivityNotFoundException(String message) {
            super(message);
        }
    }


    public MisesActivity() {}

    public static ChromeTabbedActivity getChromeTabbedActivity() {
        return (ChromeTabbedActivity) getActivityOfType(ChromeTabbedActivity.class);
    }

    private static Activity getActivityOfType(Class<?> classOfActivity) {
        for (Activity ref : ApplicationStatus.getRunningActivities()) {
            if (!classOfActivity.isInstance(ref)) continue;

            return ref;
        }

        return null;
    }

    @NonNull
    public static MisesActivity getMisesActivity() throws MisesActivityNotFoundException {
        MisesActivity activity = (MisesActivity) getActivityOfType(MisesActivity.class);
        if (activity != null) {
            return activity;
        }

        throw new MisesActivityNotFoundException("MisesActivity Not Found");
    }

    public void updateBottomSheetPosition(int orientation) {
        //do not adjust bottom sheet because of space for ads

        // if (BottomToolbarConfiguration.isBottomToolbarEnabled()) {
        //     // Ensure the bottom sheet's container is adjusted to the height of the bottom toolbar.
        //     ViewGroup sheetContainer = findViewById(R.id.sheet_container);
        //     assert sheetContainer != null;

        //     if (sheetContainer != null) {
        //         CoordinatorLayout.LayoutParams params =
        //                 (CoordinatorLayout.LayoutParams) sheetContainer.getLayoutParams();
        //         params.bottomMargin = orientation == Configuration.ORIENTATION_LANDSCAPE
        //                 ? 0
        //                 : getResources().getDimensionPixelSize(R.dimen.bottom_controls_height);
        //         sheetContainer.setLayoutParams(params);
        //     }
        // }
    }

    public void addOrEditBookmark(final Tab tabToBookmark) {
        //RateUtils.getInstance().setPrefAddedBookmarkCount();
        ((TabBookmarker) mTabBookmarkerSupplier.get()).addOrEditBookmark(tabToBookmark);
    }

    public Tab selectExistingTab(String url) {
        Tab tab = getActivityTab();
        if (tab != null && tab.getUrl().getSpec().equals(url)) {
            return tab;
        }

        TabModel tabModel = getCurrentTabModel();
        int tabIndex = TabModelUtils.getTabIndexByUrl(tabModel, url);

        // Find if tab exists
        if (tabIndex != TabModel.INVALID_TAB_INDEX) {
            tab = tabModel.getTabAt(tabIndex);
            // Set active tab
            tabModel.setIndex(tabIndex, TabSelectionType.FROM_USER);
            return tab;
        } else {
            return null;
        }
    }

    public Tab openNewOrSelectExistingTab(String url, boolean refresh) {
        Tab tab = selectExistingTab(url);
        if (tab != null) {
            if (refresh) {
                tab.reload();
            }
            return tab;
        } else { // Open a new tab
            return getTabCreator(false).launchUrl(url, TabLaunchType.FROM_CHROME_UI);
        }
    }

    public void setComesFromNewTab(boolean comesFromNewTab) {
        this.mComesFromNewTab = comesFromNewTab;
    }
    @Override
    public void finishNativeInitialization() {
        super.finishNativeInitialization();
    }
}
