package org.chromium.base;

import android.app.ActivityManager;
import android.content.Context;
import org.chromium.base.annotations.CalledByNative;
import org.chromium.base.annotations.JNINamespace;
import org.chromium.base.annotations.MainDex;
import org.chromium.base.annotations.NativeMethods;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager.NameNotFoundException;

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

}
