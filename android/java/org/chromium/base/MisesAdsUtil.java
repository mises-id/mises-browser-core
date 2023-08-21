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

    private static AdsStatus status;
    private static Activity activityContext;
    public static void initAds(final Activity act) {
        activityContext = act;
        setStatus(AdsStatus.NOT_INITIALIZED);
    }

    public static Activity getActivityContext() {
        return activityContext;
    }
    private static void setStatus(AdsStatus newStatus) {
        Log.i(TAG, "setStatus " + status + " -> "+ newStatus);
        status = newStatus;
        
    }

    private static void runtimeCheck(Context ctx) throws RuntimeException{
        if (!PackageUtils.isPackageInstalled("com.google.android.webview")) {
            throw new RuntimeException("webview not exists!");
        }
        if (Build.VERSION.SDK_INT <= Build.VERSION_CODES.P)  {
            if (!PackageUtils.isPackageInstalled("com.android.chrome")) {
                throw new RuntimeException("chrome not exists!");
            }
        };
        final WebView dummyWebView = new WebView(ctx);
        dummyWebView.destroy();
    }

    private static void doInit(final Activity act, final String misesID) {
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
                    loadRewardedAd(act, true, misesID);
                }
            });
        } catch(Exception e) {
          Log.w(TAG, "MobileAds.initialize failed: " + e.getMessage());
        }
    }
    private static void showRewardedAd(final Activity act, final RewardedAd rewardedAd, final String misesID) {
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
                Log.d(TAG, "onAdShowedFullScreenContent");
            }

            @Override
            public void onAdFailedToShowFullScreenContent(AdError adError) {
                // Called when ad fails to show.
                Log.d(TAG, "onAdFailedToShowFullScreenContent");
                // Don't forget to set the ad reference to null so you
                // don't show the ad a second time.
                setStatus(AdsStatus.INITIALIZED);
                
            }

            @Override
            public void onAdDismissedFullScreenContent() {
                // Called when ad is dismissed.
                // Don't forget to set the ad reference to null so you
                // don't show the ad a second time.
                Log.d(TAG, "onAdDismissedFullScreenContent");
                setStatus(AdsStatus.INITIALIZED);
            }
        });
        rewardedAd.show(
            act,
            new OnUserEarnedRewardListener() {
                @Override
                public void onUserEarnedReward(@NonNull RewardItem rewardItem) {
                    // Handle the reward.
                    Log.d("TAG", "The user earned the reward.");
                    int rewardAmount = rewardItem.getAmount();
                    String rewardType = rewardItem.getType();
                    Toast.makeText(act, "Thank your for your support", Toast.LENGTH_SHORT).show();
                }
        });
    }
    public static void maybeLoadBannerAd(final Context ctx, final AdView view) {
        try {
            runtimeCheck(ctx);
            AdRequest adRequest = new AdRequest.Builder().build();
            view.loadAd(adRequest);
        } catch(Exception e) {
            Log.w(TAG, "AdView.load fail: " + e.getMessage());
        }

    }
    public static void loadAndShowRewardedAd(final Activity act, final String misesID) {
        if (status == AdsStatus.NOT_INITIALIZED) {
            doInit(act, misesID);
            return;
        }
        if (status == AdsStatus.INITIALIZING) {
            return;
        }
        loadRewardedAd(act, true, misesID);  
    }
    private static void loadRewardedAd(final Activity act, final boolean show, final String misesID) {
        if (status == AdsStatus.LOADING) {
            if (show) {
                Toast.makeText(act, "Ads Loading ...", Toast.LENGTH_SHORT).show();
            }
            return;
        }
        Log.i(TAG, "loadRewardedAd show " + show);
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
                        Log.d(TAG, "onAdFailedToLoad:" + loadAdError.getMessage());
                        setStatus(AdsStatus.INITIALIZED);
                    }

                    @Override
                    public void onAdLoaded(@NonNull RewardedAd rewardedAd) {
                        Log.d(TAG, "onAdLoaded");
                        setStatus(AdsStatus.READY);
                        ServerSideVerificationOptions options = new ServerSideVerificationOptions
                            .Builder()
                            .setUserId(misesID)
                            .build();
                        rewardedAd.setServerSideVerificationOptions(options);
                        if (show) {
                            showRewardedAd(act, rewardedAd, misesID);
                        }
                        
                    }
                }
            );
        } catch(Exception e) {
          Log.w(TAG, "RewardedAd.load fail: " + e.getMessage());
          setStatus(AdsStatus.INITIALIZED);
        }
    }



    public static void maybeLoadNativeAd(final Activity act, final NativeAdView view, Callback<NativeAd> callback) {
        try {
            runtimeCheck(act);
            loadNativeAd(act, view, callback);
        } catch(Exception e) {
            Log.w(TAG, "NativeAdView.loadNativeAd fail: " + e.getMessage());
        }

    }

    private static void loadNativeAd(final Activity activity, final NativeAdView adView, Callback<NativeAd> callback) {

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
