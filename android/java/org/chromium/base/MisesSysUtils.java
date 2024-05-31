package org.chromium.base;

import android.app.ActivityManager;
import android.app.Activity;
import android.content.Context;
import org.jni_zero.CalledByNative;
import org.jni_zero.JNINamespace;
import org.jni_zero.NativeMethods;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager.NameNotFoundException;
import android.os.Bundle;
import org.json.JSONException;
import org.json.JSONObject;

import android.view.View;
import android.view.ViewGroup;

import com.google.firebase.analytics.FirebaseAnalytics;
import org.chromium.base.MisesController;
import org.chromium.base.Callback;
import org.chromium.chrome.browser.tabmodel.TabCreatorManager;
import org.chromium.chrome.browser.tabmodel.TabModel;
import org.chromium.chrome.browser.tabmodel.TabCreator;
import org.chromium.chrome.browser.mises.UIUtil;
import org.chromium.chrome.mises.R;

@JNINamespace("base::android")
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
            
            @Override
            public void onRewardAdsResult(int code, final String message) {
                nativeOnRewardAdsResult(code, message);
            }

        });
        MisesAdsUtil.getInstance().loadAndShowRewardedAd(
            MisesController.getInstance().getMisesId()
        );
    }
    @CalledByNative
    public static void cancelRewardAd() {
        MisesAdsUtil.getInstance().cancelShowAds();
    }

    @CalledByNative
    public static void openVpn() {
        final Context context = getActivityContext();
        if (context == null)
            return;
        MisesVpnUtils.openVpn(context, new Callback<Integer>() {
            @Override
            public final void onResult(Integer code) {
                if (code == 403) {
                    // auth expired
                    UIUtil.showAlertDialog(context, context.getString(R.string.lbl_auth_tip), new View.OnClickListener() {
                        @Override
                        public void onClick(View v) {
                            TabCreator tabCreator = null;
                            if (context instanceof TabCreatorManager) {
                                TabCreatorManager chromeTabbedActivity = (TabCreatorManager) context;
                                tabCreator = chromeTabbedActivity.getTabCreator(false);
                            }
                            if (tabCreator != null) {
                                tabCreator.openSinglePage(MisesController.MISES_WALLET_BASE_URL);
                            }
                        }
                    });
                } else if (code != 200) {
                    UIUtil.showAlertDialog(context, String.format(context.getString(R.string.lbl_mises_vpn_error_format), code), new View.OnClickListener() {
                        @Override
                        public void onClick(View v) {
                            
                        }
                    });
                }
            }
        });
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
