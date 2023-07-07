/**
 * Copyright (c) 2022 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package org.chromium.chrome.browser.omnibox.suggestions;

import android.content.Context;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.annotation.Px;

import org.chromium.base.ContextUtils;
import org.chromium.base.supplier.Supplier;
import org.chromium.chrome.browser.flags.ChromeFeatureList;
import org.chromium.chrome.browser.omnibox.R;
import org.chromium.chrome.browser.omnibox.UrlBarEditingTextStateProvider;
import org.chromium.chrome.browser.omnibox.suggestions.basic.BasicSuggestionProcessor.BookmarkState;
import org.chromium.chrome.browser.omnibox.suggestions.ads.MisesAdsBannerProcessor;
import org.chromium.chrome.browser.profiles.Profile;
import org.chromium.chrome.browser.tab.Tab;
import org.chromium.components.omnibox.AutocompleteMatch;
import org.chromium.components.omnibox.AutocompleteResult;
import org.chromium.ui.modelutil.PropertyModel;

import java.util.Arrays;
import java.util.List;
import java.util.Locale;

class MisesDropdownItemViewInfoListBuilder extends DropdownItemViewInfoListBuilder {
    private @Nullable MisesAdsBannerProcessor mMisesAdsBannerProcessor;
    private UrlBarEditingTextStateProvider mUrlBarEditingTextProvider;
    private @NonNull Supplier<Tab> mActivityTabSupplier;
    @Px
    private static final int DROPDOWN_HEIGHT_UNKNOWN = -1;
    private static final int DEFAULT_SIZE_OF_VISIBLE_GROUP = 5;
    private Context mContext;

    MisesDropdownItemViewInfoListBuilder(@NonNull Supplier<Tab> tabSupplier,
            BookmarkState bookmarkState, @NonNull OmniboxPedalDelegate omniboxPedalDelegate) {
        super(tabSupplier, bookmarkState, omniboxPedalDelegate);

        mActivityTabSupplier = tabSupplier;
    }

    @Override
    void initDefaultProcessors(Context context, SuggestionHost host, AutocompleteDelegate delegate,
            UrlBarEditingTextStateProvider textProvider) {
        mContext = context;
        mUrlBarEditingTextProvider = textProvider;
        super.initDefaultProcessors(context, host, delegate, textProvider);
        mMisesAdsBannerProcessor = new MisesAdsBannerProcessor(
                context, host, textProvider, delegate);
    }

    @Override
    void onUrlFocusChange(boolean hasFocus) {
        super.onUrlFocusChange(hasFocus);
        mMisesAdsBannerProcessor.onUrlFocusChange(hasFocus);
    }

    @Override
    void onNativeInitialized() {
        super.onNativeInitialized();
        mMisesAdsBannerProcessor.onNativeInitialized();
    }

    @Override
    @NonNull
    List<DropdownItemViewInfo> buildDropdownViewInfoList(AutocompleteResult autocompleteResult) {
        mMisesAdsBannerProcessor.onSuggestionsReceived();
        List<DropdownItemViewInfo> viewInfoList =
                super.buildDropdownViewInfoList(autocompleteResult);

            final PropertyModel model = mMisesAdsBannerProcessor.createModel();
            mMisesAdsBannerProcessor.populateModel(model);
            viewInfoList.add(new DropdownItemViewInfo(mMisesAdsBannerProcessor, model,
                    MisesAdsBannerProcessor.MISES_ADS_PROMO_GROUP));
      

        return viewInfoList;
    }

}
