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

    private static final String TAG = "HttpUtil";
   


    private static class JsonGetTask extends AsyncTask<JSONObject> {
        private String mUrlStr;
        private Callback<JSONObject> mCallback;
	    public JsonGetTask(String urlStr, Callback<JSONObject> callback) {
            mUrlStr = urlStr;
            mCallback = callback;
        }

        @Override
        protected JSONObject doInBackground() {
            JSONObject res = JsonGetSync(mUrlStr);
            return res;
        }

        @Override
        protected void onPostExecute(JSONObject res) {
            mCallback.onResult(res);
        }
    }

    public static void JsonGetAsync(String urlStr,Callback<JSONObject> callback) {
        JsonGetTask task = new JsonGetTask(urlStr, callback);
        task.executeOnExecutor(AsyncTask.THREAD_POOL_EXECUTOR);
    }

    public static JSONObject JsonGetSync(String urlStr) {
        JSONObject result = null;
        HttpURLConnection urlConnection = null;
        try {
            URL url = new URL(urlStr);
            urlConnection = (HttpURLConnection) ChromiumNetworkAdapter.openConnection(url, NetworkTrafficAnnotationTag.MISSING_TRAFFIC_ANNOTATION);
            urlConnection.setConnectTimeout(20000);
            urlConnection.setDoOutput(false);
            urlConnection.setDoInput(true);
            urlConnection.setUseCaches(false);
            urlConnection.setRequestMethod("GET");
            urlConnection.setRequestProperty("Connection", "Keep-alive");
            urlConnection.setRequestProperty("Charset", "UTF-8");
            urlConnection.setRequestProperty("Content-Type", "application/json");


            int resCode = urlConnection.getResponseCode();
            Log.d(TAG, "mises http get " + urlStr + ", ret " + resCode);
            if (resCode == 200) {
                InputStream is = urlConnection.getInputStream();
                ByteArrayOutputStream bo = new ByteArrayOutputStream();
                int i = is.read();
                while (i != -1) {
                    bo.write(i);
                    i = is.read();
                }
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
                String err = bo.toString();
                Log.e(TAG, "fail " + err);
            }
        } catch (JSONException e) {
            Log.e(TAG, "mises api get error " + e.toString());
        } catch (MalformedURLException e) {
            Log.e(TAG, "mises api get  error " + e.toString());
        } catch (IOException e) {
            Log.e(TAG, "mises api get  error " + e.toString());
        } catch (IllegalStateException e) {
            Log.e(TAG, "mises api get  error " + e.toString());
        } finally {
            if (urlConnection != null) urlConnection.disconnect();
        }
        return result;
    }
} 
