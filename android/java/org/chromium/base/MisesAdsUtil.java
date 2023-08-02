package org.chromium.base;

import android.content.Context;
import android.app.Activity;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;
import androidx.appcompat.app.AlertDialog;
import androidx.annotation.NonNull;

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
import com.google.android.gms.ads.AdError;
import com.google.android.gms.ads.FullScreenContentCallback;
import com.google.android.gms.ads.OnUserEarnedRewardListener;


public class MisesAdsUtil {

    private static final String TAG = "MisesAdsUtil";
    private static final String REWARDAD_UNIT_ID = "ca-app-pub-3526707353288294/9383547028";
    private static boolean isInitialized;
    private static boolean isLoading;
    private static boolean isShowing; 
    private static Activity activityContext; 
    private static RewardedAd rewardedAdCache;
    public static void initAds(final Activity act) {
        // RequestConfiguration configuration = new RequestConfiguration.Builder().setTestDeviceIds(
        // Arrays.asList("7C6221C0BF81BF12ACAD4E9B5730EB05")).build();
        // MobileAds.setRequestConfiguration(configuration);
        try {
            MobileAds.initialize(act, new OnInitializationCompleteListener() {
                @Override
                public void onInitializationComplete(InitializationStatus initializationStatus) {
                    Log.i(TAG,"initAds onInitializationComplete:" + initializationStatus);
                    isInitialized = true;
                }
            });
        } catch(Exception e) {
          Log.w(TAG, "MobileAds.initialize failed: " + e.getMessage());
        }

        activityContext = act;
    }
    public static Activity getActivityContext() {
        return activityContext;
    }
    private static void showRewardedAd(final Activity act, final RewardedAd rewardedAd) {
        if (isShowing) {
            return;
        }
        Log.i(TAG, "showRewardedAd");
        isShowing = true;

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
                isShowing = false;
                
            }

            @Override
            public void onAdDismissedFullScreenContent() {
                // Called when ad is dismissed.
                // Don't forget to set the ad reference to null so you
                // don't show the ad a second time.
                Log.d(TAG, "onAdDismissedFullScreenContent");
                isShowing = false;
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
    public static void loadAndShowRewardedAd(final Activity act, final String misesID) {
        if (!isInitialized) {
            return;
        }
        if (rewardedAdCache == null) {
            loadRewardedAd(act, true, misesID);
        } else {
            showRewardedAd(act, rewardedAdCache);
            rewardedAdCache = null;
            loadRewardedAd(act, false, misesID);
        }   
    }
    private static void loadRewardedAd(final Activity act, final boolean show, final String misesID) {
        if (isLoading) {
            if (show) {
                Toast.makeText(act, "Ads Loading ...", Toast.LENGTH_SHORT).show();
            }
            return;
        }
        Log.i(TAG, "loadRewardedAd show " + show);
        isLoading = true;
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
                    isLoading = false;
                }

                @Override
                public void onAdLoaded(@NonNull RewardedAd rewardedAd) {
                    Log.d(TAG, "onAdLoaded");
                    isLoading = false;
                    ServerSideVerificationOptions options = new ServerSideVerificationOptions
                        .Builder()
                        .setUserId(misesID)
                        .build();
                    rewardedAd.setServerSideVerificationOptions(options);
                    if (show) {
                        showRewardedAd(act, rewardedAd);
                        loadRewardedAd(act, false, misesID);
                    } else {
                        MisesAdsUtil.rewardedAdCache = rewardedAd;
                    }
                    
                }
            }
        );
    }
} 
