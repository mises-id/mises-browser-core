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
import java.lang.reflect.Method;

import org.chromium.base.Log;
import java.util.Arrays;
import com.google.android.gms.ads.MobileAds;
import com.google.android.gms.ads.rewarded.RewardedAd;
import com.google.android.gms.ads.rewarded.ServerSideVerificationOptions;
import com.google.android.gms.ads.rewarded.RewardedAdLoadCallback;
import com.google.android.gms.ads.rewarded.RewardItem;
import com.google.android.gms.ads.RequestConfiguration;
import com.google.android.gms.ads.initialization.InitializationStatus;
import com.google.android.gms.ads.initialization.OnInitializationCompleteListener;
import com.google.android.gms.ads.AdRequest;
import com.google.android.gms.ads.LoadAdError;
import com.google.android.gms.ads.AdListener;
import com.google.android.gms.ads.AdError;
import com.google.android.gms.ads.FullScreenContentCallback;
import com.google.android.gms.ads.OnUserEarnedRewardListener;
import com.google.android.gms.ads.AdView;

import com.google.android.gms.ads.AdLoader;


import com.google.android.gms.ads.VideoController;
import com.google.android.gms.ads.VideoController.VideoLifecycleCallbacks;
import com.google.android.gms.ads.nativead.MediaView;
import com.google.android.gms.ads.nativead.NativeAd;
import com.google.android.gms.ads.nativead.NativeAdView;

import org.chromium.base.PackageUtils;


public class MisesAdsUtil {

    private static final String TAG = "MisesAdsUtil";
    private static final String REWARDAD_UNIT_ID = "ca-app-pub-3526707353288294/9383547028";
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
        boolean shouldShowAds();
        void setShouldShowAds(boolean show);
    }

    private  MisesAdsUtilObserver observer_;
    
    public  void initAds(final Activity act) {
        setStatus(AdsStatus.NOT_INITIALIZED);
    }

    public void setObserver(final MisesAdsUtilObserver observer) {
        observer_ = observer;
        observer_.setShouldShowAds(true);
    }
    public MisesAdsUtilObserver getObserver() {
        return observer_;
    }
    private void handleRewardAdsResult(int code, final String message) {
        if (observer_ != null) {
            observer_.onRewardAdsResult(code, message);
        }
    }

    private boolean shouldShowRewardAds() {
        if (observer_ != null) {
            return observer_.shouldShowAds();
        }
        return true;

    }

    private void setStatus(AdsStatus newStatus) {
        Log.i(TAG, "setStatus " + status + " -> "+ newStatus);
        status = newStatus;
        
    }

    private static int webViewDelegateGetPackageId(Resources resources, String packageName) {
        // this code is from android source 
        // https://android.googlesource.com/platform/frameworks/base/+/refs/heads/master/core/java/android/webkit/WebViewDelegate.java
        try {
            Method getAssignedPackageIdentifiers =
                    AssetManager.class.getMethod("getAssignedPackageIdentifiers");
            SparseArray<String> packageIdentifiers =
                    (SparseArray) getAssignedPackageIdentifiers.invoke(
                            resources.getAssets());
            for (int i = 0; i < packageIdentifiers.size(); i++) {
                final String name = packageIdentifiers.valueAt(i);
                if (packageName.equals(name)) {
                    return packageIdentifiers.keyAt(i);
                }
            }
        } catch (ReflectiveOperationException e) {
             throw new RuntimeException(e);
        }
        throw new RuntimeException("Package not found: " + packageName);
    }

    private static void runtimeCheck(Context ctx) throws RuntimeException{
        if (!PackageUtils.isPackageInstalled("com.google.android.webview")) {
            throw new RuntimeException("com.google.android.webview not exists!");
        }
        if (Build.VERSION.SDK_INT <= Build.VERSION_CODES.P)  {
            webViewDelegateGetPackageId(ctx.getResources(), "com.android.chrome");
        };
        final WebView dummyWebView = new WebView(ctx);
        dummyWebView.destroy();
    }

    private void doInitForRewardedAd(final Activity act, final String misesID) {
        if (status != AdsStatus.NOT_INITIALIZED) {
            return;
        }
        try {
            runtimeCheck(act);
            setStatus(AdsStatus.INITIALIZING);
            MobileAds.initialize(act, new OnInitializationCompleteListener() {
                @Override
                public void onInitializationComplete(InitializationStatus initializationStatus) {
                    Log.i(TAG,"initAds onInitializationComplete:" + initializationStatus);
                    setStatus(AdsStatus.INITIALIZED);
                    loadRewardedAd(act, misesID);
                }
            });
        } catch(Exception e) {
          Log.w(TAG, "MobileAds.initialize failed: " + e.getMessage());
          handleRewardAdsResult(4, "initialize fail: " + e.getMessage());
        }
    }
    private void showRewardedAd(final Activity act, final RewardedAd rewardedAd, final String misesID) {
        if (status != AdsStatus.READY) {
            return;
        }
        Log.i(TAG, "showRewardedAd");
        setStatus(AdsStatus.SHOWING);

        rewardedAd.setFullScreenContentCallback(
            new FullScreenContentCallback() {
            @Override
            public void onAdShowedFullScreenContent() {
                // Called when ad is shown.
                Log.i(TAG, "onAdShowedFullScreenContent");
            }

            @Override
            public void onAdFailedToShowFullScreenContent(AdError adError) {
                // Called when ad fails to show.
                Log.i(TAG, "onAdFailedToShowFullScreenContent");
                // Don't forget to set the ad reference to null so you
                // don't show the ad a second time.
                setStatus(AdsStatus.INITIALIZED);
                handleRewardAdsResult(1, "show fail: " + adError.getMessage());
            }

            @Override
            public void onAdDismissedFullScreenContent() {
                // Called when ad is dismissed.
                // Don't forget to set the ad reference to null so you
                // don't show the ad a second time.
                Log.i(TAG, "onAdDismissedFullScreenContent");

                setStatus(AdsStatus.INITIALIZED);
                handleRewardAdsResult(0, "");
            }
        });
        rewardedAd.show(
            act,
            new OnUserEarnedRewardListener() {
                @Override
                public void onUserEarnedReward(@NonNull RewardItem rewardItem) {
                    // Handle the reward.
                    Log.i("TAG", "The user earned the reward.");
                    int rewardAmount = rewardItem.getAmount();
                    String rewardType = rewardItem.getType();
                    Toast.makeText(act, "Thank your for your support", Toast.LENGTH_SHORT).show();
                    

                }
        });
    }
    public void maybeLoadBannerAd(final Context ctx, final AdView view) {
        try {
            runtimeCheck(ctx);
            AdRequest adRequest = new AdRequest.Builder().build();
            view.loadAd(adRequest);
        } catch(Exception e) {
            Log.w(TAG, "AdView.load fail: " + e.getMessage());
        }

    }
    public void loadAndShowRewardedAd(final Activity act, final String misesID) {
        if (status == AdsStatus.NOT_INITIALIZED) {
            doInitForRewardedAd(act, misesID);
            return;
        }
        if (status == AdsStatus.INITIALIZING) {
          handleRewardAdsResult(5, "sdk initializing");
          return;
        }
        loadRewardedAd(act, misesID);  
    }
    private void loadRewardedAd(final Activity act, final String misesID) {
        if (status == AdsStatus.LOADING) {
            if (shouldShowRewardAds()) {
                Toast.makeText(act, "Ads Loading ...", Toast.LENGTH_SHORT).show();
            }
            return;
        }
        Log.i(TAG, "loadRewardedAd");
        setStatus(AdsStatus.LOADING);
        try {
            AdRequest adRequest = new AdRequest.Builder().build();
            RewardedAd.load(
                act,
                REWARDAD_UNIT_ID,
                adRequest,
                new RewardedAdLoadCallback() {
                    @Override
                    public void onAdFailedToLoad(@NonNull LoadAdError loadAdError) {
                        // Handle the error.
                        Log.i(TAG, "onAdFailedToLoad:" + loadAdError.getMessage());
                        setStatus(AdsStatus.INITIALIZED);
                        handleRewardAdsResult(2, "load fail: " + loadAdError.getMessage());
                    }

                    @Override
                    public void onAdLoaded(@NonNull RewardedAd rewardedAd) {
                        Log.i(TAG, "onAdLoaded");
                        setStatus(AdsStatus.READY);
                        ServerSideVerificationOptions options = new ServerSideVerificationOptions
                            .Builder()
                            .setUserId(misesID)
                            .build();
                        rewardedAd.setServerSideVerificationOptions(options);
                        if (shouldShowRewardAds()) {
                            showRewardedAd(act, rewardedAd, misesID);
                        } else {
                            handleRewardAdsResult(101, "user canceled");
                        }
                        
                    }
                }
            );
        } catch(Exception e) {
          Log.w(TAG, "RewardedAd.load fail: " + e.getMessage());
          setStatus(AdsStatus.INITIALIZED);
          handleRewardAdsResult(3, "load fail: " + e.getMessage());
        }
    }



    public void maybeLoadNativeAd(final Activity act, final NativeAdView view, Callback<NativeAd> callback) {
        try {
            runtimeCheck(act);
            loadNativeAd(act, view, callback);
        } catch(Exception e) {
            Log.w(TAG, "NativeAdView.loadNativeAd fail: " + e.getMessage());
        }

    }

    private void loadNativeAd(final Activity activity, final NativeAdView adView, Callback<NativeAd> callback) {

        AdLoader adLoader = new AdLoader.Builder(activity, "ca-app-pub-3526707353288294/8739102663")
            .forNativeAd(new NativeAd.OnNativeAdLoadedListener() {
                @Override
                public void onNativeAdLoaded(NativeAd nativeAd) {
                    if (activity.isDestroyed()) {
                        nativeAd.destroy();
                        return;
                    }
                    // This method sets the text, images and the native ad, etc into the ad
                    // view.
                    Log.i(TAG, "onNativeAdLoaded");
                    callback.onResult(nativeAd);
                }
            }).withAdListener(new AdListener() {
                @Override
                public void onAdFailedToLoad(LoadAdError adError) {
                    // Handle the failure by logging, altering the UI, and so on.
                    Log.i(TAG, "onAdFailedToLoad:" + adError);
                }
                @Override
                public void onAdClicked() {
                    // Log the click event or other custom behavior.
                    Log.i(TAG, "onAdClicked");
                }
            }).build();
        
        adLoader.loadAds(new AdRequest.Builder().build(), 1);
    }   
    
} 
