package org.chromium.chrome.browser.logcat;

import android.content.Context;
import android.os.Environment;
import android.util.Log;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.InputStreamReader;
import java.io.BufferedReader;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.io.Serializable;
import org.json.JSONException;
import org.json.JSONObject;
import java.util.regex.Pattern;
import java.util.regex.Matcher;
import java.net.URISyntaxException;
import java.net.URI;
import org.chromium.chrome.browser.websocketclient.WebSocketClient;


public class RemoteLogDumper implements ILogDumper {

    public class Event implements Serializable {
        public String tag;
        public String message;
        public String time;
        public String level;
        public String toJson() {
            JSONObject jsonSavedState = new JSONObject();
            try {
                jsonSavedState.put("tag", tag);
                jsonSavedState.put("message", message);
                jsonSavedState.put("time", time);
                jsonSavedState.put("level", level);
                return jsonSavedState.toString();
            } catch (JSONException e) {
                Log.d(TAG, "Unable to write to a JSONObject.");
            }
            return "";
        }
    }

    public static class Config {
        private String uri = "ws://52.204.164.56:6000/";
        private int copyBufferSize = 8192;
        private String subDirDateFormat = "yyyy-MM-dd";
        private String subDirDateFormatSuffix = " HH:mm:ss";
    }

    private static final String TAG = "RemoteLogDumper";

    private Config config;

    private volatile boolean isWritable = false;

    private SimpleDateFormat simpleDateFormat;

    private WebSocketClient webSocketClient;

    private static final Pattern sLogcatPattern
        = Pattern.compile("([\\d-]+ [\\d:\\.]+)[\\w\\s]+(\\d*)[\\w\\s]+(\\d*) ([IDWVE]) ([^:]*): (.*)");


    public RemoteLogDumper() {
        this(new Config());
    }

    public RemoteLogDumper(Config config) {
        this.config = config;
        simpleDateFormat = new SimpleDateFormat(config.subDirDateFormat
                + config.subDirDateFormatSuffix);
    }


    private void createWebSocketClient() {
	    URI uri;
        try {
            uri = new URI(config.uri);
        }
        catch (URISyntaxException e) {
            e.printStackTrace();
            return;
        }

        webSocketClient = new WebSocketClient(uri) {
            @Override
            public void onOpen() {
                System.out.println("onOpen");
                isWritable = true;
            }

            @Override
            public void onTextReceived(String message) {
                Log.i(TAG,"onTextReceived");
            }

            @Override
            public void onBinaryReceived(byte[] data) {
                Log.i(TAG,"onBinaryReceived");
            }

            @Override
            public void onPingReceived(byte[] data) {
                Log.i(TAG,"onPingReceived");
            }

            @Override
            public void onPongReceived(byte[] data) {
                Log.i(TAG,"onPongReceived");
            }

            @Override
            public void onException(Exception e) {
                Log.i(TAG,e.getMessage());
                isWritable = false;
            }

            @Override
            public void onCloseReceived(int reason, String description) {
                Log.i(TAG,"onCloseReceived");
                isWritable = false;
            }
        };

        webSocketClient.setConnectTimeout(10000);
        //webSocketClient.setReadTimeout(60000);
        //webSocketClient.enableAutomaticReconnection(5000);
        webSocketClient.connect();
    }

    @Override
    public void onStart(Context applicationContext, LogcatDump.Config dumpConfig) {

        try {
            Log.i(TAG, "onStart!");
            createWebSocketClient();

        } catch (Exception e) {
            ILogDumper.super.onException(e);
        }

    }

    @Override
    public void onCrash(Thread t, Throwable e) {
        if (!checkIsWebsocketWritable()) {
            return;
        }
        
        try {
            Log.i(TAG, "begin to write crash ");
            Event event = new Event();
            event.time = simpleDateFormat.format(new Date());
            event.level = "F";
            event.tag = "CRASH";
            event.message = android.util.Log.getStackTraceString(e);
            webSocketClient.send(event.toJson());
        } catch (Exception ioe) {
            onException(ioe);
        }
    }

    @Override
    public boolean onInput(InputStream inputStream) {
        if (!checkIsWebsocketWritable()) {
            return false;
        }

        try {
            Log.i(TAG, "begin to write logcat ");
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    Matcher matcher = sLogcatPattern.matcher(line);
                    if (matcher.find()) {
                        Event event = new Event();
                        event.time = matcher.group(1);
                        event.level = matcher.group(4);
                        event.tag = matcher.group(5);
                        event.message = matcher.group(6);
                        webSocketClient.send(event.toJson());
                    }
                }
            }
        } catch (IOException e) {
            onException(e);
        }
        return true;
    }

    @Override
    public void onException(Exception e) {
        Log.e("ILogDumper", e.getClass().getCanonicalName() + " occurred " + e.getMessage(), e);
        e.printStackTrace();
        if (!checkIsWebsocketWritable()) {
            return;
        }
    }


    private boolean checkIsWebsocketWritable() {
        if (!isWritable) {
            onError("RemoteLogDumper failed to start");
        }
        return isWritable;
    }


}
