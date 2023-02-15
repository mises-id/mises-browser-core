// Copyright 2015 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

package org.chromium.chrome.browser.settings;

import android.os.Bundle;
import android.text.TextUtils;

import androidx.annotation.VisibleForTesting;
import androidx.preference.Preference;
import androidx.preference.PreferenceFragmentCompat;
import android.content.SharedPreferences;

import org.chromium.base.ContextUtils;
import org.chromium.base.metrics.RecordUserAction;
import org.chromium.chrome.R;
import org.chromium.chrome.browser.settings.ChromeManagedPreferenceDelegate;
import org.chromium.components.browser_ui.settings.SettingsUtils;
import org.chromium.components.embedder_support.util.UrlUtilities;
import org.chromium.components.url_formatter.UrlFormatter;
import org.chromium.chrome.browser.preferences.MisesPrefServiceBridge;

/**
 * Fragment that allows the user to configure tabswitcher related preferences.
 */
public class Web3Settings extends PreferenceFragmentCompat implements Preference.OnPreferenceChangeListener {
    private static final String PREF_UNSTOPPABLE_DOMAINS = "unstoppable_domains";
    private static final String PREF_ETH_NAMED_SERVICE = "ens";
    private static final String PREF_IPFS_GATEWAY = "ipfs_gateway";

    private Preference mUstoppableDomains;

    @Override
    public void onCreatePreferences(Bundle savedInstanceState, String rootKey) {
        getActivity().setTitle(R.string.preferences_web3);
        SettingsUtils.addPreferencesFromResource(this, R.xml.web3_preferences);



        mUstoppableDomains = (Preference) findPreference(PREF_UNSTOPPABLE_DOMAINS);
        mUstoppableDomains.setOnPreferenceChangeListener(this);



        RecordUserAction.record("Settings.Web3.Opened");
    }


    @Override
    public boolean onPreferenceChange(Preference preference, Object newValue) {
       return true;
    }
}
