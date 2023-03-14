/* Copyright (c) 2022 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

package org.chromium.chrome.browser.omnibox.suggestions;

import android.content.Context;
import android.os.Handler;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import org.chromium.base.Callback;
import org.chromium.base.jank_tracker.JankTracker;
import org.chromium.base.supplier.Supplier;
import org.chromium.chrome.browser.omnibox.LocationBarDataProvider;
import org.chromium.chrome.browser.omnibox.UrlBarEditingTextStateProvider;
import org.chromium.chrome.browser.omnibox.suggestions.basic.BasicSuggestionProcessor.BookmarkState;
import org.chromium.chrome.browser.profiles.Profile;
import org.chromium.chrome.browser.profiles.ProfileManager;
import org.chromium.chrome.browser.share.ShareDelegate;
import org.chromium.chrome.browser.tab.Tab;
import org.chromium.chrome.browser.tabmodel.TabWindowManager;
import org.chromium.components.user_prefs.UserPrefs;
import org.chromium.ui.modaldialog.ModalDialogManager;
import org.chromium.ui.modelutil.PropertyModel;
import java.net.URLEncoder;
import org.chromium.chrome.browser.omnibox.UrlBarData;
import org.chromium.url.GURL;
import org.chromium.components.omnibox.AutocompleteMatch;
import org.chromium.base.MisesReflectionUtil;
import org.chromium.chrome.browser.omnibox.OmniboxSuggestionType;

class MisesAutocompleteMediator extends AutocompleteMediator {
    private static final int SUGGESTION_NOT_FOUND = -1;
    private @NonNull UrlBarEditingTextStateProvider mUrlBarEditingTextProvider;
    private boolean mNativeInitialized;
    private AutocompleteController mAutocomplete;
    private @Nullable Runnable mDeferredLoadAction;

    public MisesAutocompleteMediator(@NonNull Context context,
            @NonNull AutocompleteDelegate delegate,
            @NonNull UrlBarEditingTextStateProvider textProvider,
            @NonNull PropertyModel listPropertyModel, @NonNull Handler handler,
            @NonNull Supplier<ModalDialogManager> modalDialogManagerSupplier,
            @NonNull Supplier<Tab> activityTabSupplier,
            @Nullable Supplier<ShareDelegate> shareDelegateSupplier,
            @NonNull LocationBarDataProvider locationBarDataProvider,
            @NonNull Callback<Tab> bringTabToFrontCallback,
            @NonNull Supplier<TabWindowManager> tabWindowManagerSupplier,
            @NonNull BookmarkState bookmarkState, @NonNull JankTracker jankTracker,
            @NonNull OmniboxPedalDelegate omniboxPedalDelegate) {
        super(context, delegate, textProvider, listPropertyModel, handler,
                modalDialogManagerSupplier, activityTabSupplier, shareDelegateSupplier,
                locationBarDataProvider, bringTabToFrontCallback, tabWindowManagerSupplier,
                bookmarkState, jankTracker, omniboxPedalDelegate);
    }

    private void cancelAutocompleteRequests() {
      assert (false);
    }
    private void findMatchAndLoadUrl(String urlText, long inputStart) {
      assert (false);
    }
    private int findSuggestionInAutocompleteResult(AutocompleteMatch suggestion, int matchIndex) {
      assert (false);
      return -1;
    }
    private long getElapsedTimeSinceInputChange() {
      assert (false);
      return -1;
    }

    @Override void loadTypedOmniboxText(long eventTime) {
        String urlText = mUrlBarEditingTextProvider.getTextWithAutocomplete();
        if (urlText.startsWith("chrome://")) {
          urlText = UrlBarData.replaceOnce(urlText, "chrome://", "mises://");
        }
        if (urlText.startsWith("chrome-extension://")) {
          urlText = UrlBarData.replaceOnce(urlText, "chrome-extension://", "mises-extension://");
        }
        final String urlTextToLoad = urlText;
        cancelAutocompleteRequests();
        if (mNativeInitialized && mAutocomplete != null) {
            findMatchAndLoadUrl(urlTextToLoad, eventTime);
        } else {
            mDeferredLoadAction = () -> findMatchAndLoadUrl(urlTextToLoad, eventTime);
        }
    }

    GURL updateSuggestionUrlIfNeeded(@NonNull AutocompleteMatch suggestion, int matchIndex,
        @NonNull GURL url, boolean skipCheck) {
        if (!mNativeInitialized || mAutocomplete == null) return url;
        if (suggestion.getType() == OmniboxSuggestionType.VOICE_SUGGEST
                || suggestion.getType() == OmniboxSuggestionType.TILE_SUGGESTION
                || suggestion.getType() == OmniboxSuggestionType.TILE_NAVSUGGEST) {
            return url;
        }

        int verifiedIndex = SUGGESTION_NOT_FOUND;
        if (!skipCheck) {
            verifiedIndex = findSuggestionInAutocompleteResult(suggestion, matchIndex);
        }

        // If we do not have the suggestion as part of our results, skip the URL update.
        if (verifiedIndex == SUGGESTION_NOT_FOUND) return url;

        // TODO(mariakhomenko): Ideally we want to update match destination URL with new aqs
        // for query in the omnibox and voice suggestions, but it's currently difficult to do.
        GURL updatedUrl = mAutocomplete.updateMatchDestinationUrlWithQueryFormulationTime(
                verifiedIndex, getElapsedTimeSinceInputChange());

        GURL superRet =  updatedUrl == null ? url : updatedUrl;

        String newUrl = superRet.getSpec();
        if (newUrl.startsWith("mises://"))
          newUrl = newUrl.replaceFirst("mises://", "chrome://");
        if (newUrl.startsWith("mises-extension://"))
          newUrl = newUrl.replaceFirst("mises-extension://", "chrome-extension://");
        if (suggestion.getDisplayText().startsWith("!")) {
           newUrl = "https://www.duckduckgo.com/?q=" + URLEncoder.encode(suggestion.getDisplayText());
        }
        return new GURL(newUrl);
    }

}
