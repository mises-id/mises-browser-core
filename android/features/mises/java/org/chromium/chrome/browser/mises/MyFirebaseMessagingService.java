package org.chromium.chrome.browser.mises;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.media.RingtoneManager;
import android.net.Uri;
import android.os.Build;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;

import org.chromium.base.Log;

import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;
import org.chromium.chrome.mises.R;
import org.chromium.components.url_formatter.UrlFormatter;

public class MyFirebaseMessagingService extends FirebaseMessagingService {
    private static final String CHANNEL_NAME = "News";

    @Override
    public void onMessageReceived(RemoteMessage remoteMessage) {
        super.onMessageReceived(remoteMessage);
        if (remoteMessage == null)
            return;
        if (remoteMessage.getNotification() != null && remoteMessage.getData() != null) {
            final int tag = (int) System.currentTimeMillis();
            String CHANNEL_ID = getString(R.string.default_fcm_channel_id);
            Log.d("luobo notification", remoteMessage.getNotification().getTitle() + " " + remoteMessage.getNotification().getBody());
            Log.d("luobo data", remoteMessage.getData().toString());
            String url = remoteMessage.getData().get("mises_url");
            Intent intent = null;
            if (url != null && !url.isEmpty()) {
                String fixedUrl = UrlFormatter.fixupUrl(url).getSpec();
                intent = new Intent(Intent.ACTION_VIEW, Uri.parse(fixedUrl));
                intent.setPackage(getPackageName());
            }  else {
                intent = new Intent();
                intent.setClassName("site.mises.browser", "org.chromium.chrome.browser.ChromeTabbedActivity");
            }
            PendingIntent pendingIntent = PendingIntent.getActivity(this, 0, intent, PendingIntent.FLAG_ONE_SHOT);
            NotificationManager notificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                NotificationChannel channel = new NotificationChannel(CHANNEL_ID, CHANNEL_NAME, NotificationManager.IMPORTANCE_DEFAULT);
                notificationManager.createNotificationChannel(channel);
            }
            Uri defaultSoundUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);
            NotificationCompat.Builder builder = new NotificationCompat.Builder(this, CHANNEL_ID)
                    .setContentTitle(remoteMessage.getNotification().getTitle())
                    .setContentText(remoteMessage.getNotification().getBody())
                    .setAutoCancel(true)
                    .setSound(defaultSoundUri)
                    .setContentIntent(pendingIntent);
            if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
              builder.setSmallIcon(R.mipmap.app_icon);
            } else {
              builder.setSmallIcon(R.drawable.ic_launcher);
            }
            NotificationManagerCompat.from(this).notify(0, builder.build());
        }
    }
}

