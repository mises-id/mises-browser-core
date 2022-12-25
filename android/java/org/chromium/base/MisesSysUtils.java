package org.chromium.base;

import android.app.ActivityManager;
import android.content.Context;
import org.chromium.base.annotations.CalledByNative;
import org.chromium.base.annotations.JNINamespace;
import org.chromium.base.annotations.MainDex;
import org.chromium.base.annotations.NativeMethods;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager.NameNotFoundException;
import android.os.Bundle;
import com.google.firebase.analytics.FirebaseAnalytics;

@JNINamespace("base::android")
@MainDex
public class MisesSysUtils {


    @CalledByNative
    public static long firstInstallDate() {
        Context context = ContextUtils.getApplicationContext();
        if (context == null)
            return 0;
        PackageInfo packageInfo;
        try {
            packageInfo = context.getPackageManager().getPackageInfo(context.getPackageName(), 0);
        } catch (NameNotFoundException e) {
            packageInfo = null;
        }
        return packageInfo == null ? 0 : (packageInfo.firstInstallTime / 1000);
    }

    @CalledByNative
    public static String referrerString() {
        return ContextUtils.getAppSharedPreferences().getString("install_referrer", "");
    }

    @CalledByNative
    public static String nightModeSettings() {
        return ContextUtils.getAppSharedPreferences().getString("night_mode_settings", "");
    }


    @CalledByNative
    public static void logEvent(final String name, final String key, final String value) {
        Context context = ContextUtils.getApplicationContext();
        if (context == null)
            return;
        Bundle params = new Bundle();
        params.putString(key, value);
        FirebaseAnalytics.getInstance(context).logEvent(name, params);
        return ;
    }
    
    @CalledByNative
    public static void logEvent(final String name, final String key, final String value, final String key1, final String value1) {
        Context context = ContextUtils.getApplicationContext();
        if (context == null)
            return;
        Bundle params = new Bundle();
        params.putString(key, value);
        params.putString(key1, value1);
        FirebaseAnalytics.getInstance(context).logEvent(name, params);
        return ;
    }
}
