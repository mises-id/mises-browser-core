package org.chromium.chrome.browser.settings;

import android.os.Bundle;
import android.app.Activity;
import androidx.appcompat.app.AlertDialog;
import androidx.preference.Preference;
import androidx.preference.PreferenceFragmentCompat;
import android.content.SharedPreferences;

import android.content.DialogInterface;
import org.chromium.chrome.R;
import org.chromium.chrome.browser.ApplicationLifetime;
import org.chromium.components.browser_ui.settings.SettingsUtils;
import org.chromium.chrome.browser.MisesRelaunchUtils;

public class ToolbarSettings extends PreferenceFragmentCompat implements Preference.OnPreferenceChangeListener {

    private static final String PREF_ENABLE_BOTTOM_TOOLBAR = "enable_bottom_toolbar";
    private Preference mEnableBottomToolbar;
    public ToolbarSettings() {
        setHasOptionsMenu(true);		  
    }

    @Override
    public void onCreatePreferences(Bundle savedInstanceState, String rootKey) {
        getActivity().setTitle(R.string.preferences_toolbar);
        SettingsUtils.addPreferencesFromResource(this, R.xml.toolbar_preferences);

        mEnableBottomToolbar = (Preference) findPreference(PREF_ENABLE_BOTTOM_TOOLBAR);
        mEnableBottomToolbar.setOnPreferenceChangeListener(this);
    }

    @Override
    public boolean onPreferenceChange(Preference preference, Object newValue) {
        MisesRelaunchUtils.askForRelaunch(getActivity());
        return true;
    }
}
