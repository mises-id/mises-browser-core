package org.chromium.base;

import android.content.Context;
import android.app.Activity;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;
import androidx.appcompat.app.AlertDialog;
import androidx.annotation.NonNull;
import android.os.Build;
import android.webkit.WebView;
import android.util.SparseArray;
import android.content.res.Resources;
import android.content.res.AssetManager;
import android.content.pm.PackageInfo;
import android.os.Handler;
import java.lang.reflect.Method;

import org.chromium.base.Log;
import java.util.Arrays;

import org.chromium.base.PackageUtils;


import org.chromium.components.version_info.Channel;
import org.chromium.components.version_info.VersionConstants;
import org.chromium.components.version_info.VersionInfo;

import com.openmediation.sdk.ImpressionData;
import com.openmediation.sdk.ImpressionDataListener;
import com.openmediation.sdk.InitCallback;
import com.openmediation.sdk.InitConfiguration;
import com.openmediation.sdk.OmAds;
import com.openmediation.sdk.banner.AdSize;
import com.openmediation.sdk.banner.BannerAd;
import com.openmediation.sdk.banner.BannerAdListener;
import com.openmediation.sdk.interstitial.InterstitialAd;
import com.openmediation.sdk.interstitial.InterstitialAdListener;
import com.openmediation.sdk.promotion.PromotionAd;
import com.openmediation.sdk.promotion.PromotionAdListener;
import com.openmediation.sdk.promotion.PromotionAdRect;
import com.openmediation.sdk.utils.error.Error;
import com.openmediation.sdk.utils.model.Scene;
import com.openmediation.sdk.video.RewardedVideoAd;
import com.openmediation.sdk.video.RewardedVideoListener;


public class MisesAdsUtil {

    private static final String TAG = "MisesAdsUtil";
    
    private static final String APPKEY = "yHtyiIvylOW0RjcuWvIO9mrL63X9vtcH";

    //public static final String P_NATIVE_CAROUSEL_0 = "229";
    // public static final String P_NATIVE_CAROUSEL_1 = "232";
    // public static final String P_NATIVE_CAROUSEL_2 = "233";
    public static final String P_SPLASH = "231";
    public static final String P_REWARD = "230";

    private static final int RETRY_DELAY_BASE_MS = 10000; // 10 seconds
    private static final int RETRY_DELAY_MAX_MS = 960000; // 960 seconds

    private enum AdsStatus {
        NOT_INITIALIZED("NOT_INITIALIZED"),
        INITIALIZING("INITIALIZING"),
        INITIALIZED("INITIALIZED"),
        LOADING("LOADING"),
        READY("READY"),
        SHOWING("SHOWING");
        private String name;
        private AdsStatus(String name) {
            this.name = name;
        }
       
        @Override
        public String toString(){
            return name;
        }
    }
    private static MisesAdsUtil sInstance;
    public static MisesAdsUtil getInstance() {
        ThreadUtils.assertOnUiThread();
        if (sInstance == null) {
            sInstance = new MisesAdsUtil();
        }
        return sInstance;
    }

    private AdsStatus status;


    public interface MisesAdsUtilObserver {
        void onRewardAdsResult(int code, final String message);
    }

    private  MisesAdsUtilObserver observer_;

    private Activity mActivity;

    private Handler uiThreadHandler = new Handler();
    private int retryCounter;

    private  RewardedVideoListener mRewardedVideoListener = new RewardedVideoListener() {
        @Override
        public void onRewardedVideoAvailabilityChanged(boolean available) {
            Log.i(TAG, "----onRewardedVideoAvailabilityChanged----" + available);
            if (available) {
                setStatus(AdsStatus.READY);
                handleRewardedAdReady();
                
            }
        }

        @Override
        public void onRewardedVideoAdShowed(Scene scene) {
            Log.i(TAG, "onRewardedVideoAdShowed " + scene);
        }

        @Override
        public void onRewardedVideoAdShowFailed(Scene scene, Error error) {
            Log.i(TAG, "onRewardedVideoAdShowFailed " + scene);
            setStatus(AdsStatus.INITIALIZED);
            handleRewardAdsResult(2, "load fail: " + error);
        }

        @Override
        public void onRewardedVideoAdClicked(Scene scene) {
            Log.i(TAG, "onRewardedVideoAdClicked " + scene);
        }

        @Override
        public void onRewardedVideoAdClosed(Scene scene) {
            Log.i(TAG, "onRewardedVideoAdClosed " + scene);
            setStatus(AdsStatus.INITIALIZED);
            handleRewardAdsResult(0, "");
        }

        @Override
        public void onRewardedVideoAdStarted(Scene scene) {
            Log.i(TAG, "onRewardedVideoAdStarted " + scene);
        }

        @Override
        public void onRewardedVideoAdEnded(Scene scene) {
            Log.i(TAG, "onRewardedVideoAdEnded " + scene);

            
        }

        @Override
        public void onRewardedVideoAdRewarded(Scene scene) {
            Log.i(TAG, "onRewardedVideoAdRewarded " + scene);
        }
    };
    
    public void initAds(final Activity act) {
        setStatus(AdsStatus.NOT_INITIALIZED);
        retryCounter = 0;

        initSDK(act);
    }

    public boolean isInitSucess() {
        return status != AdsStatus.NOT_INITIALIZED && status != AdsStatus.INITIALIZING;
    }
    public void setObserver(final MisesAdsUtilObserver observer) {
        observer_ = observer;
    }


    public void cancelShowAds() {
        handleRewardAdsResult(101, "user canceled");
        
    }
    private void handleRewardAdsResult(int code, final String message) {
        Log.i(TAG, "handleRewardAdsResult " + code);
        if (observer_ != null) {
            observer_.onRewardAdsResult(code, message);
            observer_ = null;
        }
    }


    private void setStatus(AdsStatus newStatus) {
        Log.i(TAG, "setStatus " + status + " -> "+ newStatus);
        status = newStatus;
        
    }

    private static void runtimeCheck(Context ctx) throws RuntimeException{
        if (!PackageUtils.isPackageInstalled("com.google.android.webview")) {
            throw new RuntimeException("com.google.android.webview not exists!");
        }
        if (Build.VERSION.SDK_INT <= Build.VERSION_CODES.P)  {
            PackageInfo webViewPackageInfo = WebView.getCurrentWebViewPackage();
            if (webViewPackageInfo == null || webViewPackageInfo.packageName.equals("com.android.chrome")) {
                throw new RuntimeException("not support com.android.chrome as webview in android 7-9");
            }
        };
        final WebView dummyWebView = new WebView(ctx);
        dummyWebView.destroy();
    }


    private void retryInitSDK(final Activity act) {

        int retryDelay = RETRY_DELAY_BASE_MS;
        if (retryCounter < 0) {
            retryDelay = RETRY_DELAY_BASE_MS;
        } else {
            retryDelay = (int)Math.round(Math.pow(2, retryCounter) * RETRY_DELAY_BASE_MS);
        } 
        if (retryDelay > RETRY_DELAY_MAX_MS) {
            retryDelay = RETRY_DELAY_MAX_MS;
        }
        retryCounter += 1;
	    uiThreadHandler.removeCallbacksAndMessages(null);
        uiThreadHandler.postDelayed( () -> {
            initSDK(act);
        }, retryDelay); 
    }
    private void initSDK(final Activity act) {
        mActivity = act;
        setStatus(AdsStatus.INITIALIZING);
        OmAds.setGDPRConsent(true);
        Log.i(TAG, "om start init sdk " + VersionConstants.CHANNEL);
        String initHost = "https://ads.mises.site/init";
        if (VersionConstants.CHANNEL == Channel.DEV) {
            initHost = "https://ads.test.mises.site/init";
        };
        InitConfiguration configuration = new InitConfiguration.Builder()
                .appKey(APPKEY)
                .logEnable(true)
                .initHost(initHost)
                .preloadAdTypes(OmAds.AD_TYPE.NONE)
                .useCacheAdTypes(OmAds.CACHE_TYPE.NATIVE)
                .build();
        OmAds.init(act, configuration, new InitCallback() {
            @Override
            public void onSuccess() {
                Log.i(TAG, "init success");
                setStatus(AdsStatus.INITIALIZED);
                RewardedVideoAd.addAdListener(mRewardedVideoListener);
            }

            @Override
            public void onError(Error result) {
                Log.i(TAG, "init failed " + result.toString());
                retryInitSDK(act);
            }
        });
    }

    private void showRewardedAd() {
        if (status != AdsStatus.READY) {
            return;
        }
        Log.i(TAG, "showRewardedAd");
        setStatus(AdsStatus.SHOWING);
        RewardedVideoAd.showAd();
    }

    public void loadAndShowRewardedAd(final String misesID) {
        Log.i(TAG, "loadAndShowRewardedAd");
        if (!isInitSucess()) {
          handleRewardAdsResult(5, "sdk initializing");
          return;
        }
        OmAds.setUserId(misesID);


        if (status == AdsStatus.READY) {
            handleRewardedAdReady();
        } else {
            loadRewardedAd(); 
        }
        
         
    }
    private void handleRewardedAdReady() {
        Log.i(TAG, "handleRewardedAdReady");
        if (observer_ != null) {
           showRewardedAd();
        }
    }
    private void loadRewardedAd() {
        Log.i(TAG, "loadRewardedAd");
        if (status == AdsStatus.LOADING) {
            if (mActivity != null) {
                Toast.makeText(mActivity, "Ads Loading ...", Toast.LENGTH_SHORT).show();
            }
        }
        
        setStatus(AdsStatus.LOADING);

        RewardedVideoAd.loadAd();
    }

    
} 
