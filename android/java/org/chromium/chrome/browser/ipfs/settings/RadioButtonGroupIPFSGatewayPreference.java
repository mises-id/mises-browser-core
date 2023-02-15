// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

package org.chromium.chrome.browser.ipfs.settings;

import android.content.Context;
import android.util.AttributeSet;
import android.view.View;
import android.widget.RadioGroup;
import android.widget.TextView;

import androidx.annotation.IntDef;
import androidx.annotation.NonNull;
import androidx.annotation.VisibleForTesting;
import androidx.preference.Preference;
import androidx.preference.PreferenceViewHolder;

import org.chromium.chrome.R;
import org.chromium.components.browser_ui.widget.RadioButtonWithDescription;
import org.chromium.components.browser_ui.widget.RadioButtonWithDescriptionLayout;
import org.chromium.components.browser_ui.widget.RadioButtonWithEditText;
import org.chromium.components.browser_ui.widget.RadioButtonWithEditText.OnTextChangeListener;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

/**
 * A radio button group Preference used for IPFS Gateway Preference. It contains 2 options:
 * a {@link RadioButtonWithDescription} that represent dweb.link, and a
 * {@link RadioButtonWithEditText} that represents customized URL set by partner or user.
 */
public final class RadioButtonGroupIPFSGatewayPreference
        extends Preference implements RadioGroup.OnCheckedChangeListener, OnTextChangeListener {
    /**
     * A data structure which holds the displayed value and the status for this preference.
     */
    static class PreferenceValues {
        /**
         * The option that is checked in {@link RadioButtonGroupIPFSGatewayPreference}.
         */
        private @IPFSGatewayOption int mCheckedOption;

        /**
         * The string that displayed on the edit text box.
         */
        private String mCustomizedText;

        /**
         * Whether the RadioButtonGroup is enabled.
         */
        private boolean mIsEnabled;

        /**
         * Whether the option for to {@link IPFSGatewayOption#ENTRY_DWEB_LINK} is visible.
         */
        private boolean mIsDwebLinkVisible;

        /**
         * Whether the option for to {@link IPFSGatewayOption#ENTRY_CUSTOM_URI} is visible.
         */
        private boolean mIsCustomizedOptionVisible;

        /**
         * Created the data structure for {@link RadioButtonGroupIPFSGatewayPreference} to communicate
         * the preference status to outside fragment.
         * @param checkedOption The option that is checked in {@link
         *         RadioButtonGroupIPFSGatewayPreference}
         * @param customizedText The string that displayed on the edit text box.
         * @param isEnabled Whether the RadioButtonGroup is enabled.
         * @param isNTPButtonVisible Whether the option for to {@link
         *         IPFSGatewayOption#ENTRY_DWEB_LINK} is visible.
         * @param isCustomizedOptionVisible Whether the option for to {@link
         *         IPFSGatewayOption#ENTRY_CUSTOM_URI} is visible.
         */
        PreferenceValues(@IPFSGatewayOption int checkedOption, String customizedText,
                boolean isEnabled, boolean isDwebLinkVisible, boolean isCustomizedOptionVisible) {
            mCheckedOption = checkedOption;
            mCustomizedText = customizedText;

            mIsEnabled = isEnabled;
            mIsDwebLinkVisible = isDwebLinkVisible;
            mIsCustomizedOptionVisible = isCustomizedOptionVisible;
        }

        /**
         * @return The option that is checked in {@link RadioButtonGroupIPFSGatewayPreference}.
         */
        @IPFSGatewayOption
        int getCheckedOption() {
            return mCheckedOption;
        }

        /**
         * @return The string that displayed on the edit text box.
         */
        String getCustomURI() {
            return mCustomizedText;
        }
    }

    /**
     * Enums that represent the status of radio buttons inside this Preference.
     */
    @IntDef({IPFSGatewayOption.ENTRY_DWEB_LINK, IPFSGatewayOption.ENTRY_CUSTOM_URI})
    @Retention(RetentionPolicy.SOURCE)
    @interface IPFSGatewayOption {
        int ENTRY_DWEB_LINK = 0;
        int ENTRY_CUSTOM_URI = 1;

        int NUM_ENTRIES = 2;
    }

    private boolean mIsBoundToViewHolder;

    private RadioButtonWithEditText mCustomUri;
    private RadioButtonWithDescription mDwebLink;

    private RadioButtonWithDescriptionLayout mGroup;
    private TextView mTitle;

    private PreferenceValues mPreferenceValues;

    public RadioButtonGroupIPFSGatewayPreference(Context context, AttributeSet attrs) {
        super(context, attrs);

        // Inflating from XML.
        setLayoutResource(R.layout.radio_button_group_ipfs_gateway_preference);
    }

    /**
     * Called when the checked radio button has changed. When the selection is cleared, checkedId is
     * -1.
     *
     * @param group The group in which the checked radio button has changed
     * @param checkedId The unique identifier of the newly checked radio button
     */
    @Override
    public void onCheckedChanged(RadioGroup group, int checkedId) {
        assert mCustomUri.isChecked() != mDwebLink.isChecked();

        @IPFSGatewayOption
        int checkedOption = mDwebLink.isChecked() ? IPFSGatewayOption.ENTRY_DWEB_LINK
                                                   : IPFSGatewayOption.ENTRY_CUSTOM_URI;

        mPreferenceValues.mCheckedOption = checkedOption;
    }

    @Override
    public void onBindViewHolder(PreferenceViewHolder holder) {
        super.onBindViewHolder(holder);
        mDwebLink = (RadioButtonWithDescription) holder.findViewById(R.id.radio_button_ipfs_gateway_dweb_link);
        mCustomUri = (RadioButtonWithEditText) holder.findViewById(R.id.radio_button_ipfs_gateway_edit);

        assert mDwebLink != null : "Dweb Link button missing in the layout";
        assert mCustomUri != null : "Custom URI button missing in the layout";

        mGroup = (RadioButtonWithDescriptionLayout) holder.findViewById(R.id.radio_button_group);
        mGroup.setOnCheckedChangeListener(this);

        mTitle = (TextView) holder.findViewById(R.id.title);

        mIsBoundToViewHolder = true;
        // Set up views with data provided by the delegate.
        if (mPreferenceValues != null) {
            setupPreferenceValues(mPreferenceValues);
        }

        // Set up text listeners after initial value are set.
        mCustomUri.addTextChangeListener(this);
    }

    /**
     * Will be called when the text edit has a value change.
     */
    @Override
    public void onTextChanged(CharSequence newText) {
        assert mPreferenceValues != null;
        // If the text change is triggered by the preference fragment (ex. setting up when toggle
        // the switch), ignore this update.
        if (mPreferenceValues.mCustomizedText.equals(newText.toString())) return;

        mPreferenceValues.mCheckedOption = IPFSGatewayOption.ENTRY_CUSTOM_URI;
        mPreferenceValues.mCustomizedText = newText.toString();
    }

    /**
     * Update the current view with the latest data from the {@link PreferenceValues}. If the
     * preference is not bounded with view holder yet, the values will be stored and populated at
     * the end of {@link #onBindViewHolder(PreferenceViewHolder)}.
     *
     * @param value The {@link PreferenceValues} that should be presents by this preference.
     */
    void setupPreferenceValues(@NonNull PreferenceValues value) {
        if (mIsBoundToViewHolder) {
            mGroup.setEnabled(value.mIsEnabled);
            mTitle.setEnabled(value.mIsEnabled);

            // Change the text first so that #onTextChanged will not mess up radio buttons that
            // should be checked.
            mCustomUri.setPrimaryText(value.mCustomizedText);

            if (value.mCheckedOption == IPFSGatewayOption.ENTRY_DWEB_LINK) {
                mDwebLink.setChecked(true);
            } else {
                mCustomUri.setChecked(true);
            }

            mDwebLink.setVisibility(value.mIsDwebLinkVisible ? View.VISIBLE : View.GONE);
            mCustomUri.setVisibility(value.mIsCustomizedOptionVisible ? View.VISIBLE : View.GONE);
        }

        // Lastly, store the value as current value the preference is displaying.
        // Doing it last to keep the previous value for necessary comparing in #onTextChanged.
        mPreferenceValues = value;
    }

    /**
     * @return The current preference value stored in the preference.
     */
    PreferenceValues getPreferenceValue() {
        return mPreferenceValues;
    }

    @VisibleForTesting
    RadioButtonWithEditText getCustomUriRadioButton() {
        return mCustomUri;
    }

    @VisibleForTesting
    RadioButtonWithDescription getDwebLinkRadioButton() {
        return mDwebLink;
    }

    @VisibleForTesting
    TextView getTitleTextView() {
        return mTitle;
    }
}
