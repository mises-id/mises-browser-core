package org.chromium.chrome.browser.mises;

import android.app.Application;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.os.Build;
import android.os.Handler;
import android.os.Binder;
import android.os.IBinder;
import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;

import android.app.ForegroundServiceStartNotAllowedException;

import lcd.MLightNode;
import lcd.MLightNodeDelegator;
import lcd.Lcd;

import org.chromium.base.Log;
import org.chromium.chrome.mises.R;
import org.chromium.net.ChromiumNetworkAdapter;
import org.chromium.net.NetworkTrafficAnnotationTag;
import org.chromium.base.ContextUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.Random;
import java.lang.SecurityException;



public class MisesLCDServiceImpl extends MisesLCDService.Impl implements MLightNodeDelegator {
    private static final String CHANNEL_ID = "1001";
    private static final String CHANNEL_NAME = "Event Tracker";
    private static final int SERVICE_ID = 1;
    public static Boolean IS_RUNNING = false;
    private static final String TAG = "MISES_LCD_SERVICE";
    private static final String ACTION_RESTART_FOREGROUND_SERVICE = "ACTION_RESTART_FOREGROUND_SERVICE";
    private static final String ACTION_OPEN_APP = "ACTION_OPEN_APP";
    public static final String KEY_DATA = "KEY_DATA";
    private Handler uiThreadHandler = new Handler();
    private int retryCounter;
    private static MLightNode nodeLCD;
    private Thread nodeThread;
    private Thread nodeRestartThread;
    private String homePath; 

    private Context mContext = ContextUtils.getApplicationContext();
    private final IBinder mBinder = new LocalBinder(); 
    class LocalBinder extends Binder {
        MisesLCDServiceImpl getService() {
            return MisesLCDServiceImpl.this;
        }
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return mBinder;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        Log.i(TAG, "onCreate");
        //Create Notification channel for all the notifications sent from this app.
        createNotificationChannel();

        // Start foreground service.
	    startLCDService();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        Log.i(TAG, "onStartCommand");
        if (intent != null) {
            if (intent.getAction() != null) {
		        Log.i(TAG, "onStartCommand " + intent.getAction());
                if (intent.getAction().equals(ACTION_RESTART_FOREGROUND_SERVICE)) {
		            retryCounter = 0;
                    startLCDService();
                } else if (intent.getAction().equals(ACTION_OPEN_APP)) {
                    String key_data = intent.getStringExtra(KEY_DATA);
                    openAppHomePage(key_data);
                }
            }
        }
        return Service.START_STICKY;
    }

    private void openAppHomePage(String keydata) {
        try {
            getService().sendBroadcast(new Intent(Intent.ACTION_CLOSE_SYSTEM_DIALOGS));
	    } catch (SecurityException e) {
	    }
        Intent newintent = new Intent();
        newintent.setClassName("site.mises.browser", "org.chromium.chrome.browser.ChromeTabbedActivity");
        newintent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK );
        getService().startActivity(newintent);



    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel chan = new NotificationChannel(
                CHANNEL_ID,
                CHANNEL_NAME, NotificationManager.IMPORTANCE_DEFAULT
            );

            chan.setLightColor(Color.BLUE);
            chan.setLockscreenVisibility(NotificationCompat.VISIBILITY_PRIVATE);
            NotificationManager manager = (NotificationManager) getService().getSystemService(Context.NOTIFICATION_SERVICE);
            manager.createNotificationChannel(chan);
        }
    }

    private void startLCDService() {
        Log.i(TAG, "startLCDService");
	    try {
            getService().startForeground(SERVICE_ID, getStickyNotification(
              mContext.getResources().getString(R.string.title_foreground_service_notification_running),
              mContext.getResources().getString(R.string.msg_notification_service_desc), true
            ));
	    } catch (Exception ex) {
	    }
        IS_RUNNING = true;

        uiThreadHandler.removeCallbacksAndMessages(null);
        
        restartNode();

        uiThreadHandler.postDelayed( () -> {
            getService().stopForeground(true);
        }, 5000);
    }

    private void resetNode() {
        if (nodeRestartThread != null) {
          return;
        }
        nodeRestartThread = new Thread(new Runnable() {
            @Override
            public void run() {
                Log.i(TAG, "mises light node restarting");
                try {
                    nodeLCD.restart();
                } catch (Exception e) {
                
                    Log.i(TAG, "mises light node restart fail");
                }
                nodeRestartThread = null;

            }
        });
        nodeRestartThread.start();
    }
    
    private void deleteTrustStore() {
        try {
            Log.i(TAG, "deleteTrustStore");
            File dbdir = new File(homePath + "//.misestm//light//light-client-db.db");
            if ( dbdir.isDirectory() ) {
                //list all the files in directory
                File dbfiles[] = dbdir.listFiles();
            
                for (File dbfile : dbfiles) {
                    //recursive delete
                    dbfile.delete();
                }
            }
        }catch (Exception e) {
            Log.e(TAG, "fail to delete trust store");

        }
    }
    private void initNode() {
        if (nodeThread != null) {
	        return;
	    }
        nodeThread = new Thread(new Runnable() {
            @Override
            public void run() {
                Log.i(TAG, "mises light node starting");
                String block_height = "";
                String block_hash = "";
                String primary_node = "";
                String witness_nodes = "";
                String chain_id = "";
                boolean first_run = false;
                File f = new File(homePath + "//.misestm//light//light-client-db.db");
                if (!f.exists()) {
                    first_run = true;
                }
                ArrayList<String> trust_nodes = new ArrayList<String>();
                try {
                    JSONObject ret = MisesLCDServiceImpl.this.MisesApiGet("mises/chaininfo");
                    if (ret != null && ret.has("code")) {
                        int code = ret.getInt("code");
                        if (code == 0) {
                            JSONObject data = ret.getJSONObject("data");
                            if (data != null) {
                                block_hash = data.getString("block_hash");
                                block_height = data.getInt("block_height") + "";
                                JSONArray nodes  = data.getJSONArray("trust_nodes");
                                if (nodes != null) {
                                    for( int i = 0 ;i < nodes.length(); i ++ ) {
                                        trust_nodes.add(nodes.getString(i));
                                    }
                                }
                                chain_id = data.getString("chain_id");
                            }

                        }
                    }
                }catch (Exception e) {
                    Log.e(TAG, "fail to get mises chain info");

                }finally {
                    if (block_hash.isEmpty() || block_height.isEmpty()) {
                        if (first_run) {
                            //if no old light data, restart later
                            Log.e(TAG, "no trust block");
			                nodeThread = null;
			                MisesLCDServiceImpl.this.onError("");
			                return;
                        } else {
                            //leave block_hash and block_height empty so that trust the existing block
                            Log.i(TAG, "trust the existing block");
                        }
                    }
                    if (trust_nodes.isEmpty()) {
                        trust_nodes.add("http://e1.mises.site:26657");
                        trust_nodes.add("http://e2.mises.site:26657");
                        trust_nodes.add("http://w1.mises.site:26657");
                        trust_nodes.add("http://w2.mises.site:26657");
                    }
                    if (chain_id.isEmpty()) {
                        chain_id = "mainnet";
                    }
                    Random rand = new Random(System.currentTimeMillis());
                    int n = rand.nextInt(trust_nodes.size());
                    primary_node = trust_nodes.remove(n);
                    StringBuilder str = new StringBuilder("");
                    // Traversing the ArrayList
                    for (String node : trust_nodes) {
                        str.append(node).append(",");
                    }
                    if (trust_nodes.size() > 0) {
                        str.deleteCharAt(str.lastIndexOf(","));
                    }
                    witness_nodes = str.toString();

                }
                try {
		            nodeLCD = Lcd.newMLightNode();
                    nodeLCD.setChainID(chain_id);
                    nodeLCD.setEndpoints(primary_node, witness_nodes);
                    nodeLCD.setTrust(block_height, block_hash);
		            if (Build.VERSION.SDK_INT <= Build.VERSION_CODES.N_MR1) {
			            // these android version dont support isrg_root_x1 CA, so simply make Ssl skip checking CA
		                nodeLCD.setInsecureSsl(true);
		            }
                    nodeLCD.serve("tcp://127.0.0.1:26657", MisesLCDServiceImpl.this);
                    Log.i(TAG, "mises light node started");
                } catch (Exception e) {
                    Log.e(TAG, "mises light node start error");
		            nodeLCD = null;
                    //we delete  the trust store here for it could be corupted
                    MisesLCDServiceImpl.this.onError("");
                }
		        nodeThread = null;

            }
        });
        nodeThread.start();
    }
   
    
    private void onErrorUIThread(final String reason) {
        Log.e(TAG, "onError " + reason + ", retry:"+ retryCounter);
        if (!reason.isEmpty()) {
            deleteTrustStore();
            nodeLCD = null;
        }
	  try {
            getService().startForeground(SERVICE_ID, getStickyNotification(
              mContext.getResources().getString(R.string.title_foreground_service_notification_error),
              mContext.getResources().getString(R.string.msg_notification_service_desc), false
            ));
	  }
	  catch (Exception ex) {
	  }
        int retryDelay = 30000;
        if (retryCounter < 0) {
            retryDelay = 30000;
        } else if (retryCounter < 6) {
            retryDelay = (int)Math.round(Math.pow(2, retryCounter) * 30000);
        } else {
            retryDelay = 960000;
        }
        retryCounter += 1;
	    uiThreadHandler.removeCallbacksAndMessages(null);
        uiThreadHandler.postDelayed( () -> {
            startLCDService();
        }, retryDelay); 
    }

    @Override
    public void onError(String reason) {
        final String error_reason = reason;
	    uiThreadHandler.post( () -> {onErrorUIThread(error_reason);});
    }
    private void restartNode() {
        try {
            if (nodeLCD == null) {
                homePath = mContext.getFilesDir().getAbsolutePath() + File.separator;
                Lcd.setHomePath(homePath);
                initNode();
            } else {
                resetNode();
            }
        } catch (Exception e) {
           Log.e(TAG, "mises light node restart error");
           onError("");
        }
    }

    private Notification getStickyNotification(String title, String message, boolean running) {
        PendingIntent pendingIntent = PendingIntent.getActivity(mContext, 0, new Intent(), PendingIntent.FLAG_IMMUTABLE);

        // Create notification builder.
        NotificationCompat.Builder builder = new NotificationCompat.Builder(mContext, CHANNEL_ID);
        // Make notification show big text.
        NotificationCompat.BigTextStyle bigTextStyle = new NotificationCompat.BigTextStyle();
        bigTextStyle.setBigContentTitle(title);
        bigTextStyle.bigText(message);
        // Set big text style.
        builder.setStyle(bigTextStyle);
        builder.setWhen(System.currentTimeMillis());
	    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
	        builder.setSmallIcon(R.mipmap.app_icon);
	    } else {
            builder.setSmallIcon(R.drawable.ic_launcher);
	    }
        //val largeIconBitmap = BitmapFactory.decodeResource(resources, R.drawable.ic_alarm_on)
        //builder.setLargeIcon(largeIconBitmap)
        // Make the notification max priority.
        builder.setPriority(NotificationCompat.PRIORITY_DEFAULT);

        // Make head-up notification.
        builder.setFullScreenIntent(pendingIntent, true);


        // Add Open App button in notification.
        if (running) {
            Intent openAppIntent = new Intent(mContext,  MisesLCDService.class);
            openAppIntent.setAction(ACTION_OPEN_APP);
            openAppIntent.putExtra(KEY_DATA, "" + System.currentTimeMillis());
            PendingIntent pendingPlayIntent = PendingIntent.getService(mContext, 0, openAppIntent, PendingIntent.FLAG_IMMUTABLE);
            NotificationCompat.Action openAppAction = new NotificationCompat.Action(
                    android.R.drawable.ic_menu_view,
                    mContext.getResources().getString(R.string.lbl_btn_sticky_notification_open_app),
                    pendingPlayIntent
            );
            builder.addAction(openAppAction);
        } else {
            Intent restartIntent = new Intent(mContext, MisesLCDService.class);
            restartIntent.setAction(ACTION_RESTART_FOREGROUND_SERVICE);
            restartIntent.putExtra(KEY_DATA, "" + System.currentTimeMillis());
            PendingIntent pendingPlayIntent = PendingIntent.getService(mContext, 0, restartIntent, PendingIntent.FLAG_IMMUTABLE);
            NotificationCompat.Action restartAction = new NotificationCompat.Action(
                    android.R.drawable.ic_menu_view,
                    mContext.getResources().getString(R.string.lbl_btn_sticky_notification_restart_lcd),
                    pendingPlayIntent
            );
            builder.addAction(restartAction);
        }


        // Build the notification.
        return builder.build();
    }

    private void stopService() {
        Log.i(TAG, "stopService");
        // Stop foreground service and remove the notification.
        getService().stopForeground(true);
        // Stop the foreground service.
        getService().stopSelf();

        IS_RUNNING = false;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        Log.i(TAG, "onDestroy");
        if (IS_RUNNING) {
            stopService();
        }
    }

    static public void maybeStartService(final Application application) {
        Log.i(TAG, "maybeStartService");
        if (!MisesLCDServiceImpl.IS_RUNNING) {
            try {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    Log.i(TAG, "start MisesLCDService1");
                    application.startForegroundService(new Intent(application, MisesLCDService.class));
                } else {
                    Log.i(TAG, "start MisesLCDService2");
                    application.startService(new Intent(application, MisesLCDService.class));
                }
            }
            catch (ForegroundServiceStartNotAllowedException e) {
                   Log.i(TAG, "fail to start MisesLCDService with ForegroundServiceStartNotAllowedException");
            }
        }
    }


    private JSONObject MisesApiGet(String path) {
        HttpUtil.HttpResp result = HttpUtil.JsonGetSync("https://api.alb.mises.site/api/v1/" + path, "", "");
        return result.resp;
    }
}
