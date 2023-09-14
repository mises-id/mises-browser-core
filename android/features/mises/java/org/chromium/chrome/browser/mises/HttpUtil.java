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
import java.io.OutputStream;
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
   
    public static class HttpResp {
        public HttpResp() {
            code = -1;
            resp = null;
        }
        public JSONObject resp;
        public Integer code;
    }


    private static class JsonGetTask extends AsyncTask<HttpResp> {
        private String mUrlStr;
         private String mToken;
        private String mUserAgentStr;
        private Callback<HttpResp> mCallback;
	    public JsonGetTask(final String urlStr, final String token, final String userAgentStr, Callback<HttpResp> callback) {
            mUrlStr = urlStr;
            mToken = token;
            mUserAgentStr = userAgentStr;
            mCallback = callback;
        }

        @Override
        protected HttpResp doInBackground() {
            HttpResp res = JsonGetSync(mUrlStr, mToken, mUserAgentStr);
            return res;
        }

        @Override
        protected void onPostExecute(HttpResp res) {
            mCallback.onResult(res);
        }
    }

    public static void JsonGetAsync(final String urlStr, final String token, final String userAgentStr, Callback<HttpResp> callback) {
        JsonGetTask task = new JsonGetTask(urlStr, token, userAgentStr, callback);
        task.executeOnExecutor(AsyncTask.THREAD_POOL_EXECUTOR);
    }

    public static HttpResp JsonGetSync(final String urlStr, final String tokenStr, final String userAgentStr) {
        HttpResp result = new HttpResp();
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
            if (!tokenStr.isEmpty()) {
                urlConnection.setRequestProperty("Authorization", "Bearer " + tokenStr);
            }
            

            Log.d(TAG, "JsonGetSync " + urlStr + ", getResponseCode");
            int resCode = urlConnection.getResponseCode();
            result.code = resCode;
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
                result.resp = new JSONObject(resJson);
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



    private static class JsonPostTask extends AsyncTask<HttpResp> {
        private String mUrlStr;
        private String mUserAgentStr;
        private JSONObject mBody;
        private String mTokenStr;
        private Callback<HttpResp> mCallback;
	    public JsonPostTask(final String urlStr, final JSONObject body, final String tokenStr, final String userAgentStr, Callback<HttpResp> callback) {
            mUrlStr = urlStr;
            mUserAgentStr = userAgentStr;
            mBody = body;
            mTokenStr = tokenStr;
            mCallback = callback;
        }

        @Override
        protected HttpResp doInBackground() {
            HttpResp res = JsonPostSync(mUrlStr, mBody, mTokenStr, mUserAgentStr);
            return res;
        }

        @Override
        protected void onPostExecute(HttpResp res) {
            mCallback.onResult(res);
        }
    }

    public static void JsonPostAsync(final String urlStr, final JSONObject body, final String tokenStr, final String userAgentStr, Callback<HttpResp> callback) {
        JsonPostTask task = new JsonPostTask(urlStr, body, tokenStr, userAgentStr, callback);
        task.executeOnExecutor(AsyncTask.THREAD_POOL_EXECUTOR);
    }


    public static HttpResp JsonPostSync(final String urlStr, final JSONObject body, final String tokenStr, final String userAgentStr) {
        HttpResp result = new HttpResp();
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
            urlConnection.setDoOutput(true);
            urlConnection.setDoInput(true);
            urlConnection.setUseCaches(false);
            urlConnection.setRequestMethod("POST");
            urlConnection.setRequestProperty("Charset", "UTF-8");
            urlConnection.setRequestProperty("Content-Type", "application/json;charset = utf-8");
            urlConnection.setRequestProperty("Connection", "Keep-alive");
            urlConnection.setRequestProperty("User-Agent", userAgentStr);
            if (!tokenStr.isEmpty()) {
                urlConnection.setRequestProperty("Authorization", "Bearer " + tokenStr);
            }

            OutputStream outputStream = urlConnection.getOutputStream();
            String param = body.toString();
            Log.e("JsonPostSync", "body: " + param);
            outputStream.write(param.getBytes("UTF-8"));

            Log.d(TAG, "JsonPostSync " + urlStr + ", getResponseCode");
            int resCode = urlConnection.getResponseCode();
            result.code = resCode;
            Log.d(TAG, "JsonPostSync " + urlStr + ", ret " + resCode);
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
                result.resp = new JSONObject(resJson);
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
            Log.e(TAG, "JsonPostSync error " + e.toString());
        } finally {
            if (urlConnection != null) urlConnection.disconnect();
        }
        return result;
    }
} 
