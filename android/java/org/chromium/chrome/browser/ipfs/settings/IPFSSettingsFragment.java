/* Copyright (c) 2021 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

package org.chromium.chrome.browser.ipfs.settings;

import android.os.Bundle;
import android.text.TextUtils;

import android.content.SharedPreferences;

import androidx.annotation.Nullable;
import androidx.preference.PreferenceFragmentCompat;

import org.chromium.base.ContextUtils;
import org.chromium.chrome.R;
import org.chromium.chrome.browser.preferences.MisesPrefServiceBridge;
import org.chromium.components.browser_ui.settings.SettingsUtils;
import org.chromium.components.browser_ui.settings.ChromeSwitchPreference;

import org.chromium.components.url_formatter.UrlFormatter;

import org.chromium.chrome.browser.ipfs.settings.RadioButtonGroupIPFSGatewayPreference.IPFSGatewayOption;
import org.chromium.chrome.browser.ipfs.settings.RadioButtonGroupIPFSGatewayPreference.PreferenceValues;


public class IPFSSettingsFragment extends PreferenceFragmentCompat  {
    static final String PREF_IPFS_GATEWAY = "ipfs_gateway";
    public static final String PREF_IPFS_GATEWAY_RADIO_GROUP = "ipfs_gateway_radio_group";
    static final String PREF_IPFS_GATEWAY_CUSTOM_URL = "ipfs_gateway_custom_url";
    final String GATEWAY_URL_DWEB_LINK = "https://dweb.link";
    private ChromeSwitchPreference mIpfsGatewayPref;

    private RadioButtonGroupIPFSGatewayPreference mRadioButtons;
    @Override
    public void onCreatePreferences(@Nullable Bundle savedInstanceState, String rootKey) {
        getActivity().setTitle(R.string.ipfs_title);
        SettingsUtils.addPreferencesFromResource(this, R.xml.ipfs_preferences);

        mIpfsGatewayPref = (ChromeSwitchPreference) findPreference(PREF_IPFS_GATEWAY);

        mIpfsGatewayPref.setOnPreferenceChangeListener((preference, newValue) -> {
            onSwitchPreferenceChange((boolean) newValue);
            return true;
        });

        mRadioButtons =
                (RadioButtonGroupIPFSGatewayPreference) findPreference(PREF_IPFS_GATEWAY_RADIO_GROUP);

        mRadioButtons.setupPreferenceValues(createPreferenceValuesForRadioGroup());
    }


    @Override
    public void onResume() {
        super.onResume();
        // If view created, update the state for pref values or policy state changes.
        if (mRadioButtons != null) {
            mRadioButtons.setupPreferenceValues(createPreferenceValuesForRadioGroup());
        }
    }

    @Override
    public void onStop() {
        super.onStop();

        // Save the final shared preference data.
        updateIPFSGatewayFromRadioGroupPreference(mRadioButtons.getPreferenceValue());
    }

    /**
     * Handle the preference changes when we toggled the homepage switch.
     * @param isChecked Whether switch is turned on.
     */
    private void onSwitchPreferenceChange(boolean isChecked) {
        updateIPFSGatewayEnable(isChecked);
        mRadioButtons.setupPreferenceValues(createPreferenceValuesForRadioGroup());
    }

    private void updateIPFSGatewayEnable(boolean enabled) {
        SharedPreferences.Editor sharedPreferencesEditor = ContextUtils.getAppSharedPreferences().edit();
        sharedPreferencesEditor.putBoolean(PREF_IPFS_GATEWAY, enabled);
        sharedPreferencesEditor.apply();
        MisesPrefServiceBridge.getInstance().setIpfsGatewayEnabled(enabled);
    }
        /**
     * Will be called when the status of {@link #mRadioButtons} is changed.
     * TODO(https://crbug.com/1127383): Record changes whenever user changes settings rather than
     * homepage settings is stopped.
     * @param newValue The {@link PreferenceValues} that the {@link
     *         RadioButtonGroupIPFSGatewayPreference} is holding.
     */
    private void updateIPFSGatewayFromRadioGroupPreference(PreferenceValues newValue) {

        boolean setToUseDwebLink = newValue.getCheckedOption() == IPFSGatewayOption.ENTRY_DWEB_LINK;
        String newGateway = UrlFormatter.fixupUrl(newValue.getCustomURI()).getValidSpecOrEmpty();
        SharedPreferences.Editor sharedPreferencesEditor = ContextUtils.getAppSharedPreferences().edit();
        if (setToUseDwebLink) {
            newGateway = GATEWAY_URL_DWEB_LINK;
            sharedPreferencesEditor.putString(PREF_IPFS_GATEWAY_CUSTOM_URL, "");
        } else {
            sharedPreferencesEditor.putString(PREF_IPFS_GATEWAY_CUSTOM_URL, newGateway);
        }
        sharedPreferencesEditor.apply();
        MisesPrefServiceBridge.getInstance().setIpfsGateway(newGateway);
        
    }
       /**
     * @return The user customized homepage setting.
     */
    private String getIPFSGatewayForEditText() {
        String customUrl = ContextUtils.getAppSharedPreferences().getString(PREF_IPFS_GATEWAY_CUSTOM_URL, "");
        String defaultUrl = GATEWAY_URL_DWEB_LINK;

        if (TextUtils.isEmpty(customUrl) || customUrl.equals(defaultUrl)) {
            return "";
        }

        return customUrl;
    }

    private PreferenceValues createPreferenceValuesForRadioGroup() {
        String customGateway = getIPFSGatewayForEditText();
        @IPFSGatewayOption
        int checkedOption =
                TextUtils.isEmpty(customGateway) ? IPFSGatewayOption.ENTRY_DWEB_LINK : IPFSGatewayOption.ENTRY_CUSTOM_URI;
        
        boolean isRadioButtonPreferenceEnabled = ContextUtils.getAppSharedPreferences().getBoolean(PREF_IPFS_GATEWAY, true);
        boolean isDwebLinkOptionVisible = isRadioButtonPreferenceEnabled;
        boolean isCustomizedOptionVisible = isRadioButtonPreferenceEnabled;
        return new PreferenceValues(checkedOption, customGateway,
                isRadioButtonPreferenceEnabled, isDwebLinkOptionVisible, isCustomizedOptionVisible);
    }

}
