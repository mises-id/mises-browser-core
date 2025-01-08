package org.chromium.chrome.browser;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.media.RingtoneManager;
import android.graphics.Bitmap;
import android.graphics.drawable.Drawable;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;
import androidx.annotation.NonNull;


import org.chromium.base.Log;

import com.bumptech.glide.Glide;
import com.bumptech.glide.request.target.SimpleTarget;
import com.bumptech.glide.request.transition.Transition;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;
import com.google.android.gms.tasks.Continuation;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;

import org.chromium.base.IntentUtils;
import org.chromium.base.ContextUtils;
import org.chromium.chrome.mises.R;
import org.chromium.components.url_formatter.UrlFormatter;
import org.chromium.chrome.browser.services.gcm.ChromeGcmListenerServiceImpl;
import org.chromium.base.MisesSysUtils;

public class MisesFirebaseMessagingService extends ChromeGcmListenerServiceImpl {
    private static final String TAG = "MisesFirebaseMessagingService";
    private static final String CHANNEL_NAME = "News";

    @Override
    public void onMessageReceived(final String from, final Bundle data) {
        
        if (data == null)
            return;
        Log.i(TAG, "onMessageReceived: " + data.toString());
        String bundleChannelId = "gcm.notification.android_channel_id";
        String bundleImage = "gcm.notification.image";
        String bundleTitle = "gcm.notification.title";
        String bundleBody = "gcm.notification.body";
        String bundleOpenUrl = "open_url";
        Context context = ContextUtils.getApplicationContext();
        String CHANNEL_ID = context.getString(R.string.default_fcm_channel_id);

        String title = data.getString(bundleTitle);
        String body = data.getString(bundleBody);
        String openUrl = data.getString(bundleOpenUrl);
        String imageUrl = data.getString(bundleImage);
        String channelId = data.getString(bundleChannelId);
        if (title != null && body != null && channelId != null && channelId.equals(CHANNEL_ID)) {
            if (imageUrl != null && !imageUrl.isEmpty()) {
                loadImageAndDisplayNotification(title, body, openUrl, imageUrl);
            } else {
                sendNotification(title, body, openUrl, null);
            }
        } else {
            super.onMessageReceived(from, data);
        }
    }

    // Method to load the image using Glide
    private void loadImageAndDisplayNotification(final String title, final String body, final String url, final String imageUrl) {
        Context context = ContextUtils.getApplicationContext();
        Glide.with(context)
            .asBitmap()
            .load(imageUrl)
            .into(new SimpleTarget<Bitmap>() {
                @Override
                public void onResourceReady(@NonNull Bitmap resource, Transition<? super Bitmap> transition) {
                    // Once the image is loaded, display the notification with the image
                    sendNotification(title, body, url, resource);
                }

                @Override
                public void onLoadFailed(@NonNull Drawable errorDrawable) {
                    // If the image load failed, display a notification without an image
                    sendNotification(title, body, url, null);
                }
            });
    }


    private void sendNotification(final String title, final String body, final String url, final Bitmap imageBitmap) {
        MisesSysUtils.logEvent("notification", "url", MisesSysUtils.shortenUrl(url));
        Context context = ContextUtils.getApplicationContext();
        final int tag = (int) System.currentTimeMillis();
        String CHANNEL_ID = context.getString(R.string.default_fcm_channel_id);
        Intent intent = null;
        if (url != null && !url.isEmpty()) {
            Log.i(TAG, "sendNotification: " + url);
            String fixedUrl = UrlFormatter.fixupUrl(url).getSpec();
            intent = new Intent(Intent.ACTION_VIEW, Uri.parse(fixedUrl));
            intent.setPackage(context.getPackageName());
        }  else {
            Log.i(TAG, "sendNotification");
            intent = new Intent();
            intent.setClassName(context.getPackageName(), "org.chromium.chrome.browser.ChromeTabbedActivity");
        }
        PendingIntent pendingIntent = PendingIntent.getActivity(context, 0, intent, PendingIntent.FLAG_ONE_SHOT | IntentUtils.getPendingIntentMutabilityFlag(false));
        NotificationManager notificationManager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            if (notificationManager != null && notificationManager.getNotificationChannel(CHANNEL_ID) == null) {
                NotificationChannel channel = new NotificationChannel(CHANNEL_ID, CHANNEL_NAME, NotificationManager.IMPORTANCE_DEFAULT);
                notificationManager.createNotificationChannel(channel);
            }
        }
        Uri defaultSoundUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);
        NotificationCompat.Builder builder = new NotificationCompat.Builder(context, CHANNEL_ID)
                .setContentTitle(title)
                .setContentText(body)
                .setAutoCancel(true)
                .setSound(defaultSoundUri)
                .setContentIntent(pendingIntent);
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
            builder.setSmallIcon(R.mipmap.app_icon);
        } else {
            builder.setSmallIcon(R.drawable.ic_launcher);
        }
        // If there's an image, use BigPictureStyle
        if (imageBitmap != null) {
            NotificationCompat.BigPictureStyle bigPictureStyle =
                    new NotificationCompat.BigPictureStyle()
                            .bigPicture(imageBitmap);
            builder.setStyle(bigPictureStyle);
        }
        NotificationManagerCompat.from(context).notify(0, builder.build());
    }

    @Override
    public void onNewToken(@NonNull String token) {
        Log.d(TAG, "Refreshed token: " + token);

    }

    public interface RunnableWithResult {
        void run(String result);
    }
    static public void getToken(final RunnableWithResult callback) {
        FirebaseMessaging.getInstance().getToken()
        .addOnCompleteListener(new OnCompleteListener<String>() {
            @Override
                public void onComplete(@NonNull Task<String> task) {
                if (!task.isSuccessful()) {
                    Log.w(TAG, "Fetching FCM registration token failed", task.getException());
                    return;
                }

                // Get new FCM registration token
                String token = task.getResult();

                // Log and toast
                Log.i(TAG, "Get token: " + token);

                if (callback != null) {
                    callback.run(token);
                }
            }
        });
    }
    
}

