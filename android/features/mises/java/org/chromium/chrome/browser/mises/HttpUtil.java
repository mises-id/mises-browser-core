package org.chromium.chrome.browser.mises;

import android.content.Context;
import android.app.Activity;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;
import androidx.appcompat.app.AlertDialog;
import androidx.annotation.NonNull;
import org.json.JSONObject;
import org.json.JSONException;
import java.io.ByteArrayOutputStream;
import java.net.HttpURLConnection;
import java.net.InetAddress;
import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.URL;

import org.chromium.base.Log;
import org.chromium.chrome.mises.R;
import org.chromium.net.ChromiumNetworkAdapter;
import org.chromium.net.NetworkTrafficAnnotationTag;
import org.chromium.base.ContextUtils;
import org.chromium.base.Callback;
import org.chromium.base.task.AsyncTask;

import java.util.Arrays;


public class HttpUtil {

    private static final String TAG = "MisesHttpUtil";
   


    private static class JsonGetTask extends AsyncTask<JSONObject> {
        private String mUrlStr;
        private String mUserAgentStr;
        private Callback<JSONObject> mCallback;
	    public JsonGetTask(final String urlStr, final String userAgentStr, Callback<JSONObject> callback) {
            mUrlStr = urlStr;
            mUserAgentStr = userAgentStr;
            mCallback = callback;
        }

        @Override
        protected JSONObject doInBackground() {
            JSONObject res = JsonGetSync(mUrlStr, mUserAgentStr);
            return res;
        }

        @Override
        protected void onPostExecute(JSONObject res) {
            mCallback.onResult(res);
        }
    }

    public static void JsonGetAsync(final String urlStr, final String userAgentStr, Callback<JSONObject> callback) {
        JsonGetTask task = new JsonGetTask(urlStr, userAgentStr, callback);
        task.executeOnExecutor(AsyncTask.THREAD_POOL_EXECUTOR);
    }

    public static JSONObject JsonGetSync(final String urlStr, final String userAgentStr) {
        JSONObject result = null;
        HttpURLConnection urlConnection = null;
        try {
            URL url = new URL(urlStr);
            String host = url.getHost();
            InetAddress address = InetAddress.getByName(host);
            String ip = address.getHostAddress();
            Log.d(TAG, "JsonGetSync " + urlStr + ", ip = " + ip);
            urlConnection = (HttpURLConnection) ChromiumNetworkAdapter.openConnection(url, NetworkTrafficAnnotationTag.MISSING_TRAFFIC_ANNOTATION);
            urlConnection.setConnectTimeout(20000);
            urlConnection.setReadTimeout(60000);
            urlConnection.setDoOutput(false);
            urlConnection.setDoInput(true);
            urlConnection.setUseCaches(false);
            urlConnection.setRequestMethod("GET");
            urlConnection.setRequestProperty("Charset", "UTF-8");
            urlConnection.setRequestProperty("Content-Type", "application/json");
            urlConnection.setRequestProperty("User-Agent", userAgentStr);

            Log.d(TAG, "JsonGetSync " + urlStr + ", getResponseCode");
            int resCode = urlConnection.getResponseCode();
            Log.d(TAG, "JsonGetSync " + urlStr + ", ret " + resCode);
            if (resCode == HttpURLConnection.HTTP_OK) {
                InputStream is = urlConnection.getInputStream();
                ByteArrayOutputStream bo = new ByteArrayOutputStream();
                int i = is.read();
                while (i != -1) {
                    bo.write(i);
                    i = is.read();
                }
                is.close();
                String resJson = bo.toString();
                result = new JSONObject(resJson);
            } else {
                InputStream is = urlConnection.getErrorStream();
                ByteArrayOutputStream bo = new ByteArrayOutputStream();
                int i = is.read();
                while (i != -1) {
                    bo.write(i);
                    i = is.read();
                }
                is.close();
                String err = bo.toString();
                Log.e(TAG, "fail " + err);
            }
        } catch (Exception e) {
            Log.e(TAG, "JsonGetSync error " + e.toString());
        } finally {
            if (urlConnection != null) urlConnection.disconnect();
        }
        return result;
    }
} 
