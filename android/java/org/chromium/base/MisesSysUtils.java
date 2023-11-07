package org.chromium.base;

import android.app.ActivityManager;
import android.app.Activity;
import android.content.Context;
import org.chromium.base.annotations.CalledByNative;
import org.chromium.base.annotations.JNINamespace;
import org.chromium.base.annotations.NativeMethods;
import org.chromium.build.annotations.MainDex;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager.NameNotFoundException;
import android.os.Bundle;
import com.google.firebase.analytics.FirebaseAnalytics;
import org.chromium.chrome.browser.mises.MisesController;

@JNINamespace("base::android")
@MainDex
public class MisesSysUtils {

    private static Activity activityContext;

    public static void init(final Activity act) {
        activityContext = act;
        MisesAdsUtil.getInstance().initAds(act);
    }

    public static Activity getActivityContext() {
        return activityContext;
    }

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
    public static void showRewardAd() {
        if (activityContext == null) {
            return;
        }
        MisesAdsUtil.getInstance().setObserver(new MisesAdsUtil.MisesAdsUtilObserver() {
            
            private boolean mCanceled;
            {
                mCanceled = false;
            }
            @Override
            public void onRewardAdsResult(int code, final String message) {
                nativeOnRewardAdsResult(code, message);
            }
            @Override
            public boolean isCanceled() {
                return mCanceled;

            }
            @Override
            public void cancelShowAds() {
                mCanceled = true;
            }

        });
        MisesAdsUtil.getInstance().loadAndShowRewardedAd(
            MisesController.getInstance().getMisesId()
        );
    }
    @CalledByNative
    public static void cancelRewardAd() {
        if (MisesAdsUtil.getInstance().getObserver() != null) {
            MisesAdsUtil.getInstance().getObserver().cancelShowAds();
        }
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

    public static void nativeOnRewardAdsResult(int code, String j_message) {
        MisesSysUtilsJni.get().onRewardAdsResult(code, j_message);
    };

    @NativeMethods
    interface Natives {
        void onRewardAdsResult(int code, String j_message);
    }
}
