/**
 * Copyright (c) 2022 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package org.chromium.chrome.browser.omnibox.suggestions.ads;

import android.content.Context;

import androidx.annotation.NonNull;

import org.chromium.chrome.browser.omnibox.R;
import org.chromium.chrome.browser.omnibox.UrlBarEditingTextStateProvider;
import org.chromium.chrome.browser.omnibox.suggestions.AutocompleteDelegate;
import org.chromium.chrome.browser.omnibox.suggestions.MisesOmniboxSuggestionUiType;
import org.chromium.chrome.browser.omnibox.suggestions.SuggestionHost;
import org.chromium.chrome.browser.omnibox.suggestions.DropdownItemProcessor;
import org.chromium.ui.base.PageTransition;
import org.chromium.ui.modelutil.PropertyModel;

/** A class that handles model and view creation for the suggestion brave search banner. */
public class MisesAdsBannerProcessor implements DropdownItemProcessor {
    private final SuggestionHost mSuggestionHost;
    private final int mMinimumHeight;
    private final UrlBarEditingTextStateProvider mUrlBarEditingTextProvider;
    private final AutocompleteDelegate mUrlBarDelegate;
    public static final int MISES_ADS_PROMO_GROUP = 100;

    /**
     * @param context An Android context.
     * @param suggestionHost A handle to the object using the suggestions.
     */
    public MisesAdsBannerProcessor(Context context, SuggestionHost suggestionHost,
            UrlBarEditingTextStateProvider editingTextProvider, AutocompleteDelegate urlDelegate) {
        mSuggestionHost = suggestionHost;
        mUrlBarEditingTextProvider = editingTextProvider;
        mUrlBarDelegate = urlDelegate;
        mMinimumHeight = context.getResources().getDimensionPixelSize(
                R.dimen.omnibox_mises_ads_banner_height);
    }

    public void populateModel(final PropertyModel model) {
        model.set(MisesAdsBannerProperties.SHOWADS, true); 
        model.set(MisesAdsBannerProperties.DELEGATE, new MisesAdsBannerProperties.Delegate() {
            @Override
            public void onPositiveClicked() {
                mUrlBarDelegate.loadUrl("https://search.brave.com/search?q="
                                + mUrlBarEditingTextProvider.getTextWithoutAutocomplete()
                                + "&action=makeDefault",
                        PageTransition.LINK, System.currentTimeMillis());
            }

            @Override
            public void onNegativeClicked() {
                //mSuggestionHost.removeMisesAdsSuggestion();
            }
        });
    }

    @Override
    public int getViewTypeId() {
        return MisesOmniboxSuggestionUiType.MISES_ADS_PROMO_BANNER;
    }

    @Override
    public int getMinimumViewHeight() {
        return mMinimumHeight;
    }

    @Override
    public PropertyModel createModel() {
        return new PropertyModel(MisesAdsBannerProperties.ALL_KEYS);
    }

    @Override
    public void onUrlFocusChange(boolean hasFocus) {}

    @Override
    public void onNativeInitialized() {}

    @Override
    public boolean allowBackgroundRounding() {
        return false;
    }
}
