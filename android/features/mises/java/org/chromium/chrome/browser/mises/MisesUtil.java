package org.chromium.chrome.browser.mises;

import android.content.Context;
import android.app.Activity;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.TextView;
import androidx.appcompat.app.AlertDialog;
import org.chromium.chrome.mises.R;
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
import org.chromium.chrome.browser.mises.MisesController;


public class MisesUtil {

    private static final String TAG = "MisesUtil";
    private static final String REWARDAD_UNIT_ID = "ca-app-pub-3526707353288294/9383547028";
    private static boolean isLoading; 
    private static Activity activityContext; 
    public static void initAds(final Activity act) {
        RequestConfiguration configuration = new RequestConfiguration.Builder().setTestDeviceIds(
        Arrays.asList("7C6221C0BF81BF12ACAD4E9B5730EB05")).build();
        MobileAds.setRequestConfiguration(configuration);
        MobileAds.initialize(act, new OnInitializationCompleteListener() {
            @Override
            public void onInitializationComplete(InitializationStatus initializationStatus) {
                Log.i(TAG,"initAds onInitializationComplete:" + initializationStatus);
            }
        });
        activityContext = act;
    }
    public static Activity getActivityContext() {
        return activityContext;
    }
    private static void showRewardedAd(final Activity act, final RewardedAd rewardedAd) {


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
                
            }

            @Override
            public void onAdDismissedFullScreenContent() {
                // Called when ad is dismissed.
                // Don't forget to set the ad reference to null so you
                // don't show the ad a second time.
                Log.d(TAG, "onAdDismissedFullScreenContent");
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
                }
        });
    }
    public static void loadRewardedAd(final Activity act) {
        if (!isLoading) {
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
                        Log.d(TAG, loadAdError.getMessage());
                        isLoading = false;
                    }

                    @Override
                    public void onAdLoaded(@NonNull RewardedAd rewardedAd) {
                        Log.d(TAG, "onAdLoaded");
                        isLoading = false;
                        String misesid = MisesController.getInstance().getMisesId();
                        ServerSideVerificationOptions options = new ServerSideVerificationOptions
                            .Builder()
                            .setUserId(misesid)
                            .build();
                        rewardedAd.setServerSideVerificationOptions(options);
                        showRewardedAd(act, rewardedAd);
                    }
                });
        }
    }
    public static void showAlertDialog(Context context, String message, View.OnClickListener okListener) {
        AlertDialog.Builder builder = new AlertDialog.Builder(context);
        View view = LayoutInflater.from(context).inflate(R.layout.mises_alert_dialog, null);
        builder.setView(view);
        //builder.setCancelable(false);
        TextView tvContent = (TextView) view.findViewById(R.id.tv_content);
        tvContent.setText(message);
        final AlertDialog dialog = builder.create();
        dialog.show();
        view.findViewById(R.id.btn_confirm).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (okListener != null) {
                    okListener.onClick(v);
                }
                dialog.dismiss();
            }
        });
        view.findViewById(R.id.btn_cancel).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dialog.dismiss();
            }
        });
    }
} 
