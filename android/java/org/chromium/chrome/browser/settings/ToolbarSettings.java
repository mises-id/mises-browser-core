package org.chromium.chrome.browser.settings;

import android.os.Bundle;
import android.app.Activity;
import androidx.appcompat.app.AlertDialog;
import androidx.preference.Preference;
import androidx.preference.PreferenceFragmentCompat;
import android.content.SharedPreferences;
import androidx.preference.PreferenceCategory;
import androidx.preference.PreferenceScreen;

import android.content.DialogInterface;
import org.chromium.chrome.R;
import org.chromium.chrome.browser.lifetime.ApplicationLifetime;
import org.chromium.components.browser_ui.settings.SettingsUtils;
import org.chromium.chrome.browser.flags.ChromeFeatureList;
import org.chromium.chrome.browser.MisesLocalState;
import org.chromium.chrome.browser.MisesRelaunchUtils;
import org.chromium.chrome.browser.MisesFeatureUtil;
import org.chromium.components.browser_ui.settings.ChromeSwitchPreference;
import org.chromium.components.browser_ui.settings.SettingsUtils;
import org.chromium.chrome.browser.preferences.MisesPref;
import org.chromium.chrome.browser.preferences.MisesPrefServiceBridge;
import org.chromium.chrome.browser.tracing.settings.DeveloperSettings;
import org.chromium.chrome.browser.MisesFirebaseMessagingService;

public class ToolbarSettings extends PreferenceFragmentCompat implements Preference.OnPreferenceChangeListener {
    public static final String PREF_WIDEVINE_ENABLED = "widevine_enabled";
    private static final String PREF_ENABLE_BOTTOM_TOOLBAR = "enable_bottom_toolbar";
    public static final String PREF_BACKGROUND_VIDEO_PLAYBACK = "background_video_playback";
    
    public static final String MISES_BACKGROUND_VIDEO_PLAYBACK =
	               "MisesBackgroundVideoPlayback";    
    public static final String MISES_BACKGROUND_VIDEO_PLAYBACK_INTERNAL =
            "mises-background-video-playback";
    
    private static final String PREF_NOTIFICATION_SECTION = "notification_section";
    private static final String PREF_NOTIFICATION_ID = "notification_id";

    public ToolbarSettings() {
        setHasOptionsMenu(true);		  
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getActivity().setTitle(R.string.preferences_toolbar);
        SettingsUtils.addPreferencesFromResource(this, R.xml.toolbar_preferences);

        if (!DeveloperSettings.shouldShowDeveloperSettings()) {
            PreferenceCategory category = findPreference(PREF_NOTIFICATION_SECTION);

            if (category != null) {
                PreferenceScreen screen = getPreferenceScreen();
                screen.removePreference(category);
            }
        } else {
            MisesFirebaseMessagingService.getToken(token -> {
                Preference p = findPreference(PREF_NOTIFICATION_ID);
                p.setSummary(token);
            });
        }

    }

    @Override
    public boolean onPreferenceChange(Preference preference, Object newValue) {
        String key = preference.getKey();
        boolean shouldRelaunch = false;
        if (PREF_WIDEVINE_ENABLED.equals(key)) {
            ChromeSwitchPreference enableWidevinePref =
                    (ChromeSwitchPreference) findPreference(PREF_WIDEVINE_ENABLED);
            MisesLocalState.get().setBoolean(MisesPref.WIDEVINE_ENABLED, (boolean) newValue);
            shouldRelaunch = true;
        } else if (PREF_ENABLE_BOTTOM_TOOLBAR.equals(key)) {
            shouldRelaunch = true;
        } else if (PREF_BACKGROUND_VIDEO_PLAYBACK.equals(key)) {
            MisesFeatureUtil.enableFeature(
                    MISES_BACKGROUND_VIDEO_PLAYBACK_INTERNAL, (boolean) newValue,
                    false);
            shouldRelaunch = true;
        } 
        if (shouldRelaunch) {
            MisesRelaunchUtils.askForRelaunch(getActivity());
        }
        
        return true;
    }

    @Override
    public void onCreatePreferences(Bundle savedInstanceState, String rootKey) {}

    @Override
    public void onActivityCreated(Bundle savedInstanceState) {
        super.onActivityCreated(savedInstanceState);

        ChromeSwitchPreference enableWidevinePref =
                    (ChromeSwitchPreference) findPreference(PREF_WIDEVINE_ENABLED);
        if (enableWidevinePref != null) {
            enableWidevinePref.setChecked(
                    MisesLocalState.get().getBoolean(MisesPref.WIDEVINE_ENABLED));
            enableWidevinePref.setOnPreferenceChangeListener(this);
        }
        ChromeSwitchPreference enableBottomToolbar = (ChromeSwitchPreference) findPreference(PREF_ENABLE_BOTTOM_TOOLBAR);
        if (enableBottomToolbar != null) {
            enableBottomToolbar.setOnPreferenceChangeListener(this);
        }
        
        ChromeSwitchPreference backgroundVideoPlaybackPref =
                (ChromeSwitchPreference) findPreference(PREF_BACKGROUND_VIDEO_PLAYBACK);
        if (backgroundVideoPlaybackPref != null) {
            backgroundVideoPlaybackPref.setOnPreferenceChangeListener(this);
            boolean enabled =
                    ChromeFeatureList.isEnabled(MISES_BACKGROUND_VIDEO_PLAYBACK)
                    || MisesPrefServiceBridge.getInstance().getBackgroundVideoPlaybackEnabled();
            backgroundVideoPlaybackPref.setChecked(enabled);
        }
    }
}
